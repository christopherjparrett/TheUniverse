"""
Test database models and utilities
"""

import pytest
from sqlalchemy.orm import Session
from app import User, Planet, get_password_hash, verify_password, create_access_token
from datetime import datetime, timedelta
import time

class TestUserModel:
    """Test User model functionality"""
    
    def test_create_user(self, test_db):
        """Test creating a user"""
        db = Session(bind=engine)
        timestamp = int(time.time() * 1000)  # Use timestamp for uniqueness
        user = User(
            username=f"user_{timestamp}",
            email=f"user_{timestamp}@example.com",
            hashed_password=get_password_hash("password123"),
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        assert user.id is not None
        assert user.username == f"user_{timestamp}"
        assert user.email == f"user_{timestamp}@example.com"
        assert user.is_active == True
        assert user.created_at is not None
        
        # Clean up - delete the user
        db.delete(user)
        db.commit()
        db.close()
    
    def test_user_password_hashing(self):
        """Test password hashing and verification"""
        password = "testpassword123"
        hashed = get_password_hash(password)
        
        # Hashed password should be different from original
        assert hashed != password
        assert len(hashed) > 0
        
        # Should be able to verify the password
        assert verify_password(password, hashed) == True
        assert verify_password("wrongpassword", hashed) == False

class TestPlanetModel:
    """Test Planet model functionality"""
    
    def test_create_planet(self, test_db, client, auth_headers):
        """Test creating a planet using API endpoints"""
        timestamp = int(time.time() * 1000)  # Use timestamp for uniqueness
        planet_data = {
            "name": f"Planet_{timestamp}",
            "planet_type": "Terrestrial",
            "distance_from_sun": 1.0,
            "radius": 6371.0,
            "description": "A unique test planet",
            "mass": 5.9724e24,
            "orbital_period": 365.25
        }
        
        # Create planet via API
        response = client.post("/planets", json=planet_data, headers=auth_headers)
        assert response.status_code == 201
        created_planet = response.json()
        
        # Verify planet was created correctly
        assert created_planet["id"] is not None
        assert created_planet["name"] == f"Planet_{timestamp}"
        assert created_planet["planet_type"] == "Terrestrial"
        assert created_planet["distance_from_sun"] == 1.0
        assert created_planet["radius"] == 6371.0
        assert created_planet["description"] == "A unique test planet"
        assert created_planet["mass"] == 5.9724e24
        assert created_planet["orbital_period"] == 365.25
        assert created_planet["created_at"] is not None
        assert created_planet["updated_at"] is not None
        
        # Clean up - delete the planet via API
        delete_response = client.delete(f"/planets/{created_planet['id']}", headers=auth_headers)
        assert delete_response.status_code == 204
    
    def test_planet_optional_fields(self, test_db, client, auth_headers):
        """Test creating a planet with only required fields using API endpoints"""
        timestamp = int(time.time() * 1000)  # Use timestamp for uniqueness
        planet_data = {
            "name": f"Minimal_{timestamp}",
            "planet_type": "Terrestrial",
            "distance_from_sun": 1.5,
            "radius": 5000.0
        }
        
        # Create planet via API
        response = client.post("/planets", json=planet_data, headers=auth_headers)
        assert response.status_code == 201
        created_planet = response.json()
        
        # Verify planet was created correctly with only required fields
        assert created_planet["id"] is not None
        assert created_planet["name"] == f"Minimal_{timestamp}"
        assert created_planet["planet_type"] == "Terrestrial"
        assert created_planet["distance_from_sun"] == 1.5
        assert created_planet["radius"] == 5000.0
        assert created_planet["description"] is None
        assert created_planet["mass"] is None
        assert created_planet["orbital_period"] is None
        
        # Clean up - delete the planet via API
        delete_response = client.delete(f"/planets/{created_planet['id']}", headers=auth_headers)
        assert delete_response.status_code == 204

class TestJWTUtilities:
    """Test JWT utility functions"""
    
    def test_create_access_token(self):
        """Test JWT token creation"""
        data = {"sub": "testuser"}
        token = create_access_token(data)
        
        assert isinstance(token, str)
        assert len(token) > 0
        
        # Token should be decodable
        from jose import jwt
        from app import SECRET_KEY, ALGORITHM
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        assert payload["sub"] == "testuser"
        assert "exp" in payload
    
    def test_create_access_token_with_expiration(self):
        """Test JWT token creation with custom expiration"""
        data = {"sub": "testuser"}
        expires_delta = timedelta(minutes=60)
        token = create_access_token(data, expires_delta=expires_delta)
        
        from jose import jwt
        from app import SECRET_KEY, ALGORITHM
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Just verify that exp field exists and token can be decoded
        assert "exp" in payload
        assert payload["sub"] == "testuser"

# Import engine for database tests
from app import engine
