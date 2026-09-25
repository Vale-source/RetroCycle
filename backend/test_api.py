import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from database import Base, get_db

# In-memory SQLite for high-speed local testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_user_registration():
    payload = {
        "email": "vendedor_vintage@retro.org",
        "password": "superPassword123!",
        "full_name": "Mario Bros",
        "role": "vendedor",
        "city": "Madrid",
        "country": "España",
        "latitude": 40.4168,
        "longitude": -3.7038,
        "bio": "Restaurador de hardware vintage"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == payload["email"]
    assert data["role"] == "vendedor"

def test_user_registration_duplicate_fails():
    payload = {
        "email": "vendedor_vintage@retro.org",
        "password": "superPassword123!",
        "full_name": "Mario Bros Duplicado",
        "role": "vendedor",
        "city": "Madrid",
        "latitude": 40.4168,
        "longitude": -3.7038
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 400
    assert "registrado" in response.json()["detail"]

def test_get_listings_empty_or_filtered():
    response = client.get("/api/v1/listings?category=tarjetas_graficas")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
