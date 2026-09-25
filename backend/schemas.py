from pydantic import BaseModel, Field, EmailStr, model_validator
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=150)
    role: str = Field(default="comprador", pattern="^(vendedor|comprador|reciclador)$")
    city: str
    country: str = "España"
    latitude: float
    longitude: float
    bio: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserResponse(UserBase):
    id: uuid.UUID
    avatar_url: Optional[str] = None
    rating: float = 5.0
    review_count: int = 0
    completed_deals: int = 0
    ewaste_diverted_kg: float = 0.0
    is_verified: bool = False
    badge: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Listing Schemas
class ListingBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    category: str = Field(..., pattern="^(placas_madre|memorias_ram|tarjetas_graficas|discos_almacenamiento|fuentes_poder|monitores_crt_lcd|laptops_completas|procesadores_cpu|perifericos_vintage|lotes_reciclaje)$")
    condition: str = Field(..., pattern="^(funcionando|para_piezas|para_reciclaje)$")
    modality: str = Field(..., pattern="^(venta_fija|negociable|intercambio|donacion)$")
    price: float = Field(default=0.0, ge=0)
    currency: str = "USD"
    allow_offers: bool = True
    trade_preferences: Optional[str] = None
    description: str = Field(..., min_length=10)
    brand: str
    model: str
    year_estimated: Optional[int] = Field(None, ge=1970, le=2015)
    weight_kg: float = Field(..., gt=0, description="Peso para cálculo de huella e-waste")
    specs: Dict[str, Any] = {}
    tested_notes: Optional[str] = None
    city: str
    neighborhood: Optional[str] = None
    latitude: float
    longitude: float

    @model_validator(mode='after')
    def validate_modality_price(self):
        if self.modality == 'donacion' and self.price > 0:
            raise ValueError('En la modalidad de donación el precio debe ser 0.00 USD')
        return self

class ListingCreate(ListingBase):
    pass

class ListingResponse(ListingBase):
    id: uuid.UUID
    seller_id: uuid.UUID
    status: str
    views_count: int
    created_at: datetime
    seller: Optional[UserResponse] = None

    class Config:
        from_attributes = True

# Offer Schemas
class OfferCreate(BaseModel):
    listing_id: uuid.UUID
    offer_type: str = Field(..., pattern="^(compra_precio|contraoferta|propuesta_trueque|solicitud_donacion)$")
    proposed_amount: Optional[float] = Field(None, ge=0)
    proposed_trade_item: Optional[str] = None
    message: str = Field(..., min_length=3)

class OfferResponse(BaseModel):
    id: uuid.UUID
    listing_id: uuid.UUID
    buyer_id: uuid.UUID
    seller_id: uuid.UUID
    offer_type: str
    proposed_amount: Optional[float]
    proposed_trade_item: Optional[str]
    message: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
