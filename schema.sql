-- ============================================================================
-- RETROCYCLE: MARKETPLACE DE HARDWARE VINTAGE Y RECICLAJE ELECTRÓNICO
-- Schema DDL para PostgreSQL 14+ con Soporte Relacional, Índices y Búsqueda
-- ============================================================================

-- Extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Búsqueda difusa y trigramas
CREATE EXTENSION IF NOT EXISTS "cube";
CREATE EXTENSION IF NOT EXISTS "earthdistance"; -- Para cálculo geodésico de distancias

-- 1. ENUMS DEL DOMINIO
CREATE TYPE user_role_enum AS ENUM ('vendedor', 'comprador', 'reciclador');

CREATE TYPE hardware_category_enum AS ENUM (
    'placas_madre',
    'memorias_ram',
    'tarjetas_graficas',
    'discos_almacenamiento',
    'fuentes_poder',
    'monitores_crt_lcd',
    'laptops_completas',
    'procesadores_cpu',
    'perifericos_vintage',
    'lotes_reciclaje'
);

CREATE TYPE hardware_condition_enum AS ENUM (
    'funcionando',      -- Operativo al 100%
    'para_piezas',      -- Averiado / donante de repuestos
    'para_reciclaje'    -- Chatarra electrónica / chatarra metálica
);

CREATE TYPE transaction_modality_enum AS ENUM (
    'venta_fija',       -- Venta directa con precio establecido
    'negociable',       -- Abierto a ofertas y contraofertas
    'intercambio',      -- Trueque directo por otro componente
    'donacion'          -- $0 (Sin costo para centros de reciclaje o estudiantes)
);

CREATE TYPE listing_status_enum AS ENUM (
    'disponible',
    'en_negociacion',
    'reservado',
    'vendido',
    'reciclado'
);

CREATE TYPE offer_type_enum AS ENUM (
    'compra_precio',
    'contraoferta',
    'propuesta_trueque',
    'solicitud_donacion'
);

CREATE TYPE offer_status_enum AS ENUM (
    'pendiente',
    'aceptada',
    'rechazada',
    'contraofertada',
    'cancelada'
);

-- 2. TABLA DE USUARIOS Y REPUTACIÓN
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'comprador',
    avatar_url TEXT,
    bio TEXT,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'España',
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00 CHECK (rating >= 1.0 AND rating <= 5.0),
    review_count INT DEFAULT 0 CHECK (review_count >= 0),
    completed_deals INT DEFAULT 0 CHECK (completed_deals >= 0),
    ewaste_diverted_kg NUMERIC(8, 2) DEFAULT 0.00 CHECK (ewaste_diverted_kg >= 0),
    is_verified BOOLEAN DEFAULT FALSE,
    badge VARCHAR(80),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_location ON users USING gist (ll_to_earth(latitude, longitude));

-- 3. TABLA DE PUBLICACIONES (HARDWARE LISTINGS)
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category hardware_category_enum NOT NULL,
    condition hardware_condition_enum NOT NULL,
    modality transaction_modality_enum NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    allow_offers BOOLEAN DEFAULT TRUE,
    trade_preferences TEXT,
    description TEXT NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(120) NOT NULL,
    year_estimated INT CHECK (year_estimated BETWEEN 1970 AND 2015),
    weight_kg NUMERIC(6, 2) NOT NULL CHECK (weight_kg > 0),
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    tested_notes TEXT,
    status listing_status_enum NOT NULL DEFAULT 'disponible',
    city VARCHAR(100) NOT NULL,
    neighborhood VARCHAR(100),
    latitude NUMERIC(9, 6) NOT NULL,
    longitude NUMERIC(9, 6) NOT NULL,
    views_count INT DEFAULT 0 CHECK (views_count >= 0),
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(brand, '') || ' ' || coalesce(model, ''))
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_donation_zero_price CHECK (
        (modality = 'donacion' AND price = 0) OR (modality != 'donacion')
    )
);

CREATE INDEX idx_listings_seller ON listings(seller_id);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_condition ON listings(condition);
CREATE INDEX idx_listings_modality ON listings(modality);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX idx_listings_search ON listings USING gin(search_vector);
CREATE INDEX idx_listings_specs ON listings USING gin(specs);
CREATE INDEX idx_listings_geo ON listings USING gist (ll_to_earth(latitude, longitude));

-- 4. FOTOS DE LAS PUBLICACIONES
CREATE TABLE listing_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_listing_images_listing_id ON listing_images(listing_id);

-- 5. OFERTAS Y TRANSACCIONES
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    offer_type offer_type_enum NOT NULL,
    proposed_amount NUMERIC(10, 2) CHECK (proposed_amount >= 0),
    proposed_trade_item TEXT,
    message TEXT NOT NULL,
    status offer_status_enum NOT NULL DEFAULT 'pendiente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_offers_listing ON offers(listing_id);
CREATE INDEX idx_offers_buyer ON offers(buyer_id);
CREATE INDEX idx_offers_seller ON offers(seller_id);
CREATE INDEX idx_offers_status ON offers(status);

-- 6. HILOS DE MENSAJERÍA Y CHAT
CREATE TABLE chat_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    last_message_text TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_buyer_seller_listing UNIQUE (listing_id, buyer_id, seller_id)
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_offer_notice BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_thread ON chat_messages(thread_id, created_at);

-- 7. VALORACIONES Y REPUTACIÓN
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewed_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    role_context VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT one_review_per_transaction UNIQUE (listing_id, reviewer_id, reviewed_id)
);

CREATE INDEX idx_reviews_reviewed ON reviews(reviewed_id);

-- 8. TRIGGER PARA ACTUALIZAR PROMEDIO DE REPUTACIÓN AL RECIBIR REVIEW
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET 
        rating = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE reviewed_id = NEW.reviewed_id),
        review_count = (SELECT COUNT(*) FROM reviews WHERE reviewed_id = NEW.reviewed_id)
    WHERE id = NEW.reviewed_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_review_insert
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_user_rating();
