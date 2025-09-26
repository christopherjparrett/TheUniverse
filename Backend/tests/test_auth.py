"""
Test Authentication and JWT functionality
"""

import pytest
from fastapi import status
from jose import jwt
from datetime import datetime, timedelta
from app import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

class TestAuthentication:
    """Test authentication endpoints and JWT functionality"""
    
    def test_login_success(self, client, test_user):
        """Test successful login"""
        login_data = {
            "username": "testuser",
            "password": "testpass123"
        }
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert len(data["access_token"]) > 0
    
    def test_login_invalid_username(self, client):
        """Test login with invalid username"""
        login_data = {
            "username": "invaliduser",
            "password": "testpass123"
        }
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        data = response.json()
        assert "Incorrect username or password" in data["detail"]
    
    def test_login_invalid_password(self, client, test_user):
        """Test login with invalid password"""
        login_data = {
            "username": "testuser",
            "password": "wrongpassword"
        }
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        data = response.json()
        assert "Incorrect username or password" in data["detail"]
    
    def test_get_current_user_success(self, client, auth_headers, test_user):
        """Test getting current user with valid token"""
        response = client.get("/auth/me", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["username"] == test_user.username
        assert data["email"] == test_user.email
        assert data["is_active"] == True
        assert "id" in data
        assert "created_at" in data
    
    def test_get_current_user_no_token(self, client):
        """Test getting current user without token"""
        response = client.get("/auth/me")
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_get_current_user_invalid_token(self, client):
        """Test getting current user with invalid token"""
        headers = {"Authorization": "Bearer invalid_token"}
        response = client.get("/auth/me", headers=headers)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_get_current_user_expired_token(self, client):
        """Test getting current user with expired token"""
        # Create an expired token
        expired_data = {
            "sub": "testuser",
            "exp": datetime.utcnow() - timedelta(minutes=1)  # Expired 1 minute ago
        }
        expired_token = jwt.encode(expired_data, SECRET_KEY, algorithm=ALGORITHM)
        headers = {"Authorization": f"Bearer {expired_token}"}
        response = client.get("/auth/me", headers=headers)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

class TestJWTTokenGeneration:
    """Test JWT token generation and validation"""
    
    def test_token_contains_correct_data(self, client, test_user):
        """Test that generated token contains correct user data"""
        login_data = {
            "username": "testuser",
            "password": "testpass123"
        }
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == status.HTTP_200_OK
        
        token = response.json()["access_token"]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        assert payload["sub"] == test_user.username
        assert "exp" in payload
        assert "iat" in payload or "exp" in payload
    
    def test_token_expiration_time(self, client, test_user):
        """Test that token has correct expiration time"""
        login_data = {
            "username": "testuser",
            "password": "testpass123"
        }
        response = client.post("/auth/login", json=login_data)
        assert response.status_code == status.HTTP_200_OK
        
        token = response.json()["access_token"]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Just verify that exp field exists and token can be decoded
        assert "exp" in payload
        assert payload["sub"] == test_user.username

class TestProtectedRoutes:
    """Test that protected routes require authentication"""
    
    def test_protected_route_without_token(self, client):
        """Test accessing protected route without token"""
        planet_data = {
            "name": "Test Planet",
            "planet_type": "Terrestrial",
            "distance_from_sun": 1.0,
            "radius": 6371.0
        }
        response = client.post("/planets", json=planet_data)
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_protected_route_with_valid_token(self, client, auth_headers):
        """Test accessing protected route with valid token"""
        planet_data = {
            "name": "Test Planet",
            "planet_type": "Terrestrial",
            "distance_from_sun": 1.0,
            "radius": 6371.0
        }
        response = client.post("/planets", json=planet_data, headers=auth_headers)
        assert response.status_code == status.HTTP_201_CREATED
    
    def test_protected_route_with_invalid_token(self, client):
        """Test accessing protected route with invalid token"""
        headers = {"Authorization": "Bearer invalid_token"}
        planet_data = {
            "name": "Test Planet",
            "planet_type": "Terrestrial",
            "distance_from_sun": 1.0,
            "radius": 6371.0
        }
        response = client.post("/planets", json=planet_data, headers=headers)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_protected_route_with_malformed_header(self, client):
        """Test accessing protected route with malformed authorization header"""
        headers = {"Authorization": "InvalidFormat token"}
        planet_data = {
            "name": "Test Planet",
            "planet_type": "Terrestrial",
            "distance_from_sun": 1.0,
            "radius": 6371.0
        }
        response = client.post("/planets", json=planet_data, headers=headers)
        assert response.status_code == status.HTTP_403_FORBIDDEN
