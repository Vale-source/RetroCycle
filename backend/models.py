import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Numeric, Integer, Boolean, DateTime, ForeignKey, Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    role = Column(String(50), default="comprador", nullable=False)
    avatar_url = Column(Text, nullable=True)
    bio = Column(Text, nullable=True)
    city = Column(String(100), nullable=False)
    country = Column(String(100), default="España", nullable=False)
    latitude = Column(Numeric(9, 6), nullable=False)
    longitude = Column(Numeric(9, 6), nullable=False)
    rating = Column(Numeric(3, 2), default=5.00)
    review_count = Column(Integer, default=0)
    completed_deals = Column(Integer, default=0)
    ewaste_diverted_kg = Column(Numeric(8, 2), default=0.00)
    is_verified = Column(Boolean, default=False)
    badge = Column(String(80), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    listings = relationship("Listing", back_populates="seller", cascade="all, delete-orphan")
    sent_offers = relationship("Offer", foreign_keys="Offer.buyer_id", back_populates="buyer")
    received_offers = relationship("Offer", foreign_keys="Offer.seller_id", back_populates="seller")

class Listing(Base):
    __tablename__ = "listings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    seller_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)
    condition = Column(String(50), nullable=False, index=True)
    modality = Column(String(50), nullable=False, index=True)
    price = Column(Numeric(10, 2), default=0.00, nullable=False)
    currency = Column(String(3), default="USD", nullable=False)
    allow_offers = Column(Boolean, default=True)
    trade_preferences = Column(Text, nullable=True)
    description = Column(Text, nullable=False)
    brand = Column(String(100), nullable=False)
    model = Column(String(120), nullable=False)
    year_estimated = Column(Integer, nullable=True)
    weight_kg = Column(Numeric(6, 2), nullable=False)
    specs = Column(JSONB, default={}, nullable=False)
    tested_notes = Column(Text, nullable=True)
    status = Column(String(50), default="disponible", index=True)
    city = Column(String(100), nullable=False)
    neighborhood = Column(String(100), nullable=True)
    latitude = Column(Numeric(9, 6), nullable=False)
    longitude = Column(Numeric(9, 6), nullable=False)
    views_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    seller = relationship("User", back_populates="listings")
    offers = relationship("Offer", back_populates="listing", cascade="all, delete-orphan")

class Offer(Base):
    __tablename__ = "offers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id", ondelete="CASCADE"), nullable=False)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    seller_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    offer_type = Column(String(50), nullable=False) # 'compra_precio', 'contraoferta', 'propuesta_trueque', 'solicitud_donacion'
    proposed_amount = Column(Numeric(10, 2), nullable=True)
    proposed_trade_item = Column(Text, nullable=True)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="pendiente") # 'pendiente', 'aceptada', 'rechazada'
    created_at = Column(DateTime, default=datetime.utcnow)

    listing = relationship("Listing", back_populates="offers")
    buyer = relationship("User", foreign_keys=[buyer_id], back_populates="sent_offers")
    seller = relationship("User", foreign_keys=[seller_id], back_populates="received_offers")
