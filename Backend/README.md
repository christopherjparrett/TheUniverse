# 🌍 Planets API

A Flask-based REST API for managing planet data with JWT authentication, built with Python 3.13 compatibility.

## ✨ Features

- **🔐 JWT Authentication**: Secure access to protected endpoints
- **🪐 Planet Management**: Full CRUD operations for planet data
- **💾 In-Memory Storage**: Fast, lightweight data storage
- **🌱 Pre-loaded Data**: Mercury through Neptune planets included
- **🚀 Python 3.13 Compatible**: Works with the latest Python version
- **🔧 Simple Setup**: Minimal dependencies and configuration

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Navigate to the Backend directory:**
   ```bash
   cd Backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application:**

   **Option A: Using the startup script (Recommended)**
   ```bash
   # From the project root directory, run:
   ./start_backend.ps1        # Windows PowerShell
   ```

   **Option B: Manual navigation**
   ```bash
   # Navigate to the Backend directory first
   cd Backend
   
   # Then run the Flask application
   python flask_app.py
   ```

   **Expected output:**
   ```
   🌍 Starting Planets API...
   📚 API available at: http://localhost:8000
   ✅ Initialized 8 planets and 2 users
   * Running on http://127.0.0.1:8000
   ```

5. **Access the API:**
   - **API Base URL**: http://localhost:8000
   - **Health Check**: http://localhost:8000/health
   - **All Planets**: http://localhost:8000/planets

## 📖 API Documentation

### Authentication

Most endpoints require JWT authentication. To get a token:

1. **Login** using the `/auth/login` endpoint:
   ```bash
   curl -X POST "http://localhost:8000/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"username": "admin", "password": "admin123"}'
   ```

2. **Use the token** in subsequent requests:
   ```bash
   curl -X GET "http://localhost:8000/planets" \
        -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

### Test Credentials

- **Username**: `admin`, **Password**: `admin123`
- **Username**: `testuser`, **Password**: `test123`

### Available Endpoints

#### Public Endpoints (No Authentication Required)

- `GET /` - API information and status
- `GET /health` - Health check
- `GET /planets` - List all planets
- `GET /planets/{id}` - Get planet by ID

#### Protected Endpoints (Authentication Required)

- `POST /planets` - Create new planet
- `PUT /planets/{id}` - Update planet
- `DELETE /planets/{id}` - Delete planet
- `POST /auth/login` - Login and get token
- `GET /auth/me` - Get current user info

## 🧪 Complete Testing Guide

### Method 1: Browser Testing (Easiest)

Open these URLs in your browser:
- **Main page**: http://localhost:8000
- **Health check**: http://localhost:8000/health
- **All planets**: http://localhost:8000/planets

### Method 2: Command Line Testing

**Open a NEW terminal window** and run these commands:

#### 1. Basic Health Check
```bash
curl http://localhost:8000/health
```
**Expected Response:**
```json
{"status": "healthy", "message": "Planets API is running"}
```

#### 2. Get API Information
```bash
curl http://localhost:8000/
```
**Expected Response:**
```json
{
  "message": "Welcome to the Planets API!",
  "version": "1.0.0",
  "endpoints": {
    "planets": "/planets",
    "auth": "/auth"
  }
}
```

#### 3. Get All Planets (No Auth Required)
```bash
curl http://localhost:8000/planets
```
**Expected Response:** Array of 8 planets (Mercury through Neptune)

#### 4. Get Specific Planet
```bash
curl http://localhost:8000/planets/1
```
**Expected Response:** Details of Mercury

#### 5. Login to Get Token
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```
**Expected Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

#### 6. Get Current User Info (Auth Required)
```bash
# Replace YOUR_TOKEN with the token from step 5
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/auth/me
```
**Expected Response:**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@planets.com",
  "is_active": true,
  "created_at": "2025-01-24T00:00:00.000000"
}
```

#### 7. Create New Planet (Auth Required)
```bash
curl -X POST http://localhost:8000/planets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pluto",
    "planet_type": "Dwarf Planet",
    "distance_from_sun": 39.5,
    "radius": 1188.3,
    "description": "A dwarf planet in the Kuiper Belt"
  }'
```
**Expected Response:** Details of the created planet

#### 8. Update Planet (Auth Required)
```bash
curl -X PUT http://localhost:8000/planets/9 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description for Pluto"
  }'
```
**Expected Response:** Updated planet details

#### 9. Delete Planet (Auth Required)
```bash
curl -X DELETE http://localhost:8000/planets/9 \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected Response:** Empty response (204 status)

### Method 3: PowerShell Testing (Windows)

If you're on Windows and prefer PowerShell:

```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:8000/health" -Method GET

# Get all planets
Invoke-WebRequest -Uri "http://localhost:8000/planets" -Method GET

# Login
$loginData = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8000/auth/login" -Method POST -Body $loginData -ContentType "application/json"
$token = ($response.Content | ConvertFrom-Json).access_token

# Use token for protected endpoint
$headers = @{
    Authorization = "Bearer $token"
}
Invoke-WebRequest -Uri "http://localhost:8000/auth/me" -Method GET -Headers $headers
```

### Method 4: Python Testing Script

Create a file called `test_api.py`:

```python
import requests
import json

BASE_URL = "http://localhost:8000"

def test_api():
    # Test health
    response = requests.get(f"{BASE_URL}/health")
    print("Health:", response.json())
    
    # Test planets
    response = requests.get(f"{BASE_URL}/planets")
    print(f"Planets count: {len(response.json())}")
    
    # Login
    response = requests.post(f"{BASE_URL}/auth/login", 
                           json={"username": "admin", "password": "admin123"})
    token = response.json()["access_token"]
    
    # Test protected endpoint
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print("User info:", response.json())

if __name__ == "__main__":
    test_api()
```

Run with: `python test_api.py`

## 🚨 Troubleshooting

### Common Issues

**Issue: "can't open file 'flask_app.py'"**
- **Solution**: Make sure you're in the Backend directory
- **Check**: Run `ls` (Linux/Mac) or `dir` (Windows) - you should see `flask_app.py`
- **Fix**: Run `cd Backend` first, then `python flask_app.py`
- **Full path**: The file should be at `C:\Users\[username]\Documents\GitHub\TheUniverse\Backend\flask_app.py`

**Issue: "ModuleNotFoundError: No module named 'flask'"**
- **Solution**: Install dependencies with `pip install -r requirements.txt`
- **Alternative**: Activate virtual environment first

**Issue: "Address already in use"**
- **Solution**: Port 8000 is already in use
- **Fix**: Stop other servers or change port in `flask_app.py`

**Issue: "Connection refused" when testing**
- **Solution**: Make sure the server is running
- **Check**: Look for "Running on http://127.0.0.1:8000" in terminal

### Verification Steps

1. **Check you're in the right directory:**
   ```bash
   pwd  # Should show .../Backend
   ls   # Should show flask_app.py
   ```

2. **Check Python version:**
   ```bash
   python --version  # Should be 3.8+
   ```

3. **Check dependencies:**
   ```bash
   pip list | grep -E "(flask|PyJWT|passlib)"
   ```

## 🗂️ Project Structure

```
Backend/
├── flask_app.py           # Flask application (main entry point)
├── seed_data.json         # Initial planet and user data
├── requirements.txt       # Python dependencies
├── env.example           # Environment variables template
└── README.md             # This file
```

## ⚙️ Configuration

### Environment Variables (Optional)

The API works out of the box with default settings. For customization, create a `.env` file:

```env
# JWT Configuration (optional - defaults work fine)
JWT_SECRET_KEY=your-secret-key-here-change-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Data Storage

The application uses in-memory storage, which means:
- **Fast**: No database overhead
- **Simple**: No setup required
- **Temporary**: Data resets when server restarts
- **Perfect for**: Development, testing, and demos

## 🔧 Development

### Adding New Features

1. **New Endpoints**: Add routes to `flask_app.py`
2. **Authentication**: Use the `@token_required` decorator
3. **Data Models**: Modify the in-memory data structures
4. **Validation**: Add request validation as needed

### Code Structure

- `flask_app.py` - Main application file with all routes and logic
- `seed_data.json` - Initial planet data
- `requirements.txt` - Python dependencies

## 🚀 Production Deployment

### Using Gunicorn (Recommended)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 flask_app:app
```

### Using Docker

Create a `Dockerfile`:

```dockerfile
FROM python:3.13-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "flask_app:app"]
```

### Production Considerations

1. **Database**: Switch to PostgreSQL/MySQL for persistent storage
2. **Environment Variables**: Use secure secrets
3. **HTTPS**: Enable SSL/TLS encryption
4. **Rate Limiting**: Implement rate limiting
5. **Logging**: Add comprehensive logging
6. **Monitoring**: Set up health checks

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Happy coding! 🚀**
