"""
Backend Test Configuration and Utilities
"""

import os
import pytest
import tempfile
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app import app, get_db, Base
from app import create_access_token, get_password_hash
from app import User, Planet
import json

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_planets.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    """Override database dependency for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Override the database dependency
app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def test_db():
    """Create a fresh database for each test"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(test_db):
    """Create a test client"""
    return TestClient(app)

@pytest.fixture(scope="function")
def test_user(test_db):
    """Create a test user"""
    db = TestingSessionLocal()
    user = User(
        username="testuser",
        email="test@planets.com",
        hashed_password=get_password_hash("testpass123"),
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return user

@pytest.fixture(scope="function")
def test_admin(test_db):
    """Create a test admin user"""
    db = TestingSessionLocal()
    admin = User(
        username="admin",
        email="admin@example.com",
        hashed_password=get_password_hash("admin123"),
        is_active=True
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    db.close()
    return admin

@pytest.fixture(scope="function")
def test_planets(test_db):
    """Create test planets"""
    db = TestingSessionLocal()
    planets = [
        Planet(
            name="Test Planet 1",
            planet_type="Terrestrial",
            distance_from_sun=1.0,
            radius=6371.0,
            description="A test terrestrial planet",
            mass=5.9724e24,
            orbital_period=365.25
        ),
        Planet(
            name="Test Planet 2",
            planet_type="Gas Giant",
            distance_from_sun=5.2,
            radius=69911,
            description="A test gas giant planet",
            mass=1.8982e27,
            orbital_period=4332.59
        )
    ]
    for planet in planets:
        db.add(planet)
    db.commit()
    for planet in planets:
        db.refresh(planet)
    db.close()
    return planets

@pytest.fixture(scope="function")
def auth_token(test_user):
    """Create a JWT token for testing"""
    return create_access_token(data={"sub": test_user.username})

@pytest.fixture(scope="function")
def admin_token(test_admin):
    """Create a JWT token for admin testing"""
    return create_access_token(data={"sub": test_admin.username})

@pytest.fixture(scope="function")
def auth_headers(auth_token):
    """Create authorization headers"""
    return {"Authorization": f"Bearer {auth_token}"}

@pytest.fixture(scope="function")
def admin_headers(admin_token):
    """Create admin authorization headers"""
    return {"Authorization": f"Bearer {admin_token}"}
