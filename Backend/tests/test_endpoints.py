"""
Test API Endpoints
"""

import pytest
from fastapi import status

class TestHealthEndpoint:
    """Test health check endpoint"""
    
    def test_health_check(self, client):
        """Test health check returns healthy status"""
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["status"] == "healthy"
        assert "Planets API is running" in data["message"]

class TestRootEndpoint:
    """Test root endpoint"""
    
    def test_root_endpoint(self, client):
        """Test root endpoint returns API information"""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "Welcome to the Planets API!" in data["message"]
        assert data["version"] == "1.0.0"
        assert "docs" in data
        assert "endpoints" in data

class TestPlanetsEndpoints:
    """Test planets CRUD endpoints"""
    
    def test_get_planets_empty(self, client):
        """Test getting planets when none exist"""
        response = client.get("/planets")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0
    
    def test_get_planets_with_data(self, client, test_planets):
        """Test getting planets when data exists"""
        response = client.get("/planets")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 2
        assert data[0]["name"] == "Test Planet 1"
        assert data[1]["name"] == "Test Planet 2"
    
    def test_get_planet_by_id(self, client, test_planets):
        """Test getting a specific planet by ID"""
        planet_id = test_planets[0].id
        response = client.get(f"/planets/{planet_id}")
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == "Test Planet 1"
        assert data["planet_type"] == "Terrestrial"
        assert data["distance_from_sun"] == 1.0
    
    def test_get_planet_not_found(self, client):
        """Test getting a planet that doesn't exist"""
        response = client.get("/planets/999")
        assert response.status_code == status.HTTP_404_NOT_FOUND
        data = response.json()
        assert "Planet not found" in data["detail"]
    
    def test_create_planet_without_auth(self, client):
        """Test creating a planet without authentication"""
        planet_data = {
            "name": "New Planet",
            "planet_type": "Terrestrial",
            "distance_from_sun": 1.5,
            "radius": 5000.0,
            "description": "A new test planet"
        }
        response = client.post("/planets", json=planet_data)
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_create_planet_with_auth(self, client, auth_headers):
        """Test creating a planet with authentication"""
        planet_data = {
            "name": "New Planet",
            "planet_type": "Terrestrial",
            "distance_from_sun": 1.5,
            "radius": 5000.0,
            "description": "A new test planet"
        }
        response = client.post("/planets", json=planet_data, headers=auth_headers)
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == "New Planet"
        assert data["planet_type"] == "Terrestrial"
        assert data["distance_from_sun"] == 1.5
        assert "id" in data
        
        # Clean up - delete the planet we just created
        delete_response = client.delete(f"/planets/{data['id']}", headers=auth_headers)
        assert delete_response.status_code == status.HTTP_204_NO_CONTENT
    
    def test_create_planet_duplicate_name(self, client, auth_headers, test_planets):
        """Test creating a planet with duplicate name"""
        planet_data = {
            "name": "Test Planet 1",  # Same name as existing planet
            "planet_type": "Terrestrial",
            "distance_from_sun": 1.5,
            "radius": 5000.0,
            "description": "A duplicate planet"
        }
        response = client.post("/planets", json=planet_data, headers=auth_headers)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        data = response.json()
        assert "already exists" in data["detail"]
    
    def test_update_planet_without_auth(self, client, test_planets):
        """Test updating a planet without authentication"""
        planet_id = test_planets[0].id
        update_data = {"description": "Updated description"}
        response = client.put(f"/planets/{planet_id}", json=update_data)
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_update_planet_with_auth(self, client, auth_headers, test_planets):
        """Test updating a planet with authentication"""
        planet_id = test_planets[0].id
        update_data = {"description": "Updated description"}
        response = client.put(f"/planets/{planet_id}", json=update_data, headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["description"] == "Updated description"
        assert data["name"] == "Test Planet 1"  # Other fields unchanged
        
        # Clean up - restore original description
        restore_data = {"description": "A test planet"}
        restore_response = client.put(f"/planets/{planet_id}", json=restore_data, headers=auth_headers)
        assert restore_response.status_code == status.HTTP_200_OK
    
    def test_update_planet_not_found(self, client, auth_headers):
        """Test updating a planet that doesn't exist"""
        update_data = {"description": "Updated description"}
        response = client.put("/planets/999", json=update_data, headers=auth_headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND
        data = response.json()
        assert "Planet not found" in data["detail"]
    
    def test_delete_planet_without_auth(self, client, test_planets):
        """Test deleting a planet without authentication"""
        planet_id = test_planets[0].id
        response = client.delete(f"/planets/{planet_id}")
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_delete_planet_with_auth(self, client, auth_headers):
        """Test deleting a planet with authentication"""
        # First create a planet to delete
        planet_data = {
            "name": "Planet to Delete",
            "planet_type": "Terrestrial",
            "distance_from_sun": 1.0,
            "radius": 5000.0,
            "description": "This planet will be deleted"
        }
        create_response = client.post("/planets", json=planet_data, headers=auth_headers)
        assert create_response.status_code == status.HTTP_201_CREATED
        created_planet = create_response.json()
        planet_id = created_planet["id"]
        
        # Now delete the planet
        response = client.delete(f"/planets/{planet_id}", headers=auth_headers)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify the planet is actually deleted
        get_response = client.get(f"/planets/{planet_id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_planet_not_found(self, client, auth_headers):
        """Test deleting a planet that doesn't exist"""
        response = client.delete("/planets/999", headers=auth_headers)
        assert response.status_code == status.HTTP_404_NOT_FOUND
        data = response.json()
        assert "Planet not found" in data["detail"]
