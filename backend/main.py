from fastapi import FastAPI, Depends, HTTPException, Query, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
from typing import List, Optional
import os
import uuid

import models
import schemas
from database import engine, get_db
from auth import verify_password, get_password_hash, create_access_token, get_current_user

# Create database tables if needed
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RetroCycle REST API",
    description="Backend oficial para marketplace de componentes informáticos antiguos, chatarra electrónica y reciclaje.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- WEBSOCKET CONNECTION MANAGER FOR LIVE MESSAGING ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, List[WebSocket]] = {}

    async def connect(self, thread_id: str, websocket: WebSocket):
        await websocket.accept()
        if thread_id not in self.active_connections:
            self.active_connections[thread_id] = []
        self.active_connections[thread_id].append(websocket)

    def disconnect(self, thread_id: str, websocket: WebSocket):
        if thread_id in self.active_connections:
            self.active_connections[thread_id].remove(websocket)

    async def broadcast_to_thread(self, thread_id: str, message: dict):
        if thread_id in self.active_connections:
            for connection in self.active_connections[thread_id]:
                await connection.send_json(message)

manager = ConnectionManager()

# --- ROOT & HEALTH CHECK ---
@app.get("/", tags=["Salud"])
def root():
    return {"message": "Bienvenido a RetroCycle REST API", "docs": "/docs", "health": "/health"}

@app.get("/api/v1", tags=["Salud"])
def api_v1_root():
    return {"status": "ok", "version": "v1", "endpoints": ["/api/v1/listings", "/api/v1/auth/register", "/api/v1/offers"]}

@app.get("/health", tags=["Salud"])
def health_check():
    return {"status": "ok", "service": "RetroCycle API", "engine": "FastAPI ASGI"}

# --- AUTH & USERS ---
@app.post("/api/v1/auth/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED, tags=["Autenticación"])
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="El correo electrónico ya se encuentra registrado.")
    
    user = models.User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role,
        city=user_in.city,
        country=user_in.country,
        latitude=user_in.latitude,
        longitude=user_in.longitude,
        bio=user_in.bio
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# --- LISTINGS ENDPOINTS ---
@app.get("/api/v1/listings", response_model=List[schemas.ListingResponse], tags=["Publicaciones"])
def list_components(
    q: Optional[str] = Query(None, description="Búsqueda por texto (modelo, marca, título)"),
    category: Optional[str] = Query(None, description="Categoría de hardware"),
    condition: Optional[str] = Query(None, description="Estado (funcionando, para_piezas, para_reciclaje)"),
    modality: Optional[str] = Query(None, description="Modalidad (venta_fija, negociable, intercambio, donacion)"),
    max_price: Optional[float] = Query(None, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(models.Listing).filter(models.Listing.status == "disponible")

    if q:
        search_fmt = f"%{q}%"
        query = query.filter(
            or_(
                models.Listing.title.ilike(search_fmt),
                models.Listing.description.ilike(search_fmt),
                models.Listing.brand.ilike(search_fmt),
                models.Listing.model.ilike(search_fmt)
            )
        )
    if category:
        query = query.filter(models.Listing.category == category)
    if condition:
        query = query.filter(models.Listing.condition == condition)
    if modality:
        query = query.filter(models.Listing.modality == modality)
    if max_price is not None:
        query = query.filter(models.Listing.price <= max_price)

    return query.order_by(desc(models.Listing.created_at)).all()

@app.post("/api/v1/listings", response_model=schemas.ListingResponse, status_code=status.HTTP_201_CREATED, tags=["Publicaciones"])
def create_listing(
    listing_in: schemas.ListingCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = models.Listing(
        seller_id=current_user.id,
        title=listing_in.title,
        category=listing_in.category,
        condition=listing_in.condition,
        modality=listing_in.modality,
        price=listing_in.price,
        currency=listing_in.currency,
        allow_offers=listing_in.allow_offers,
        trade_preferences=listing_in.trade_preferences,
        description=listing_in.description,
        brand=listing_in.brand,
        model=listing_in.model,
        year_estimated=listing_in.year_estimated,
        weight_kg=listing_in.weight_kg,
        specs=listing_in.specs,
        tested_notes=listing_in.tested_notes,
        city=listing_in.city,
        neighborhood=listing_in.neighborhood,
        latitude=listing_in.latitude,
        longitude=listing_in.longitude
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing

# --- OFFERS & TRANSACTIONS ---
@app.post("/api/v1/offers", response_model=schemas.OfferResponse, status_code=status.HTTP_201_CREATED, tags=["Ofertas"])
def create_offer(
    offer_in: schemas.OfferCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(models.Listing).filter(models.Listing.id == offer_in.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Publicación no encontrada.")
    if listing.seller_id == current_user.id:
        raise HTTPException(status_code=400, detail="No puedes ofertar en tu propia publicación.")

    offer = models.Offer(
        listing_id=listing.id,
        buyer_id=current_user.id,
        seller_id=listing.seller_id,
        offer_type=offer_in.offer_type,
        proposed_amount=offer_in.proposed_amount,
        proposed_trade_item=offer_in.proposed_trade_item,
        message=offer_in.message
    )
    db.add(offer)
    db.commit()
    db.refresh(offer)
    return offer

# --- WEBSOCKET LIVE CHAT ---
@app.websocket("/ws/chat/{thread_id}")
async def websocket_chat_endpoint(websocket: WebSocket, thread_id: str):
    await manager.connect(thread_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            await manager.broadcast_to_thread(thread_id, data)
    except WebSocketDisconnect:
        manager.disconnect(thread_id, websocket)
