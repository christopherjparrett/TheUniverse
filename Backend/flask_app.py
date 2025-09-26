"""
Simple Flask Planets API - Python 3.13 Compatible
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from functools import wraps

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Simple in-memory storage
planets_db = []
users_db = []

# Auth functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        return username
    except jwt.PyJWTError:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({'message': 'Token is missing'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        username = verify_token(token)
        if not username:
            return jsonify({'message': 'Token is invalid'}), 401
        
        current_user = next((u for u in users_db if u['username'] == username), None)
        if not current_user:
            return jsonify({'message': 'User not found'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# Initialize data
def init_data():
    global planets_db, users_db
    
    # Load planets from seed data
    try:
        with open("seed_data.json", "r") as file:
            data = json.load(file)
            
        for i, planet_data in enumerate(data["planets"], 1):
            planet = {
                "id": i,
                "name": planet_data["name"],
                "planet_type": planet_data["planet_type"],
                "distance_from_sun": planet_data["distance_from_sun"],
                "radius": planet_data["radius"],
                "description": planet_data["description"],
                "mass": planet_data.get("mass"),
                "orbital_period": planet_data.get("orbital_period"),
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            planets_db.append(planet)
            
        # Create test users
        admin_user = {
            "id": 1,
            "username": "admin",
            "email": "admin@planets.com",
            "hashed_password": get_password_hash("admin123"),
            "is_active": True,
            "created_at": datetime.utcnow().isoformat()
        }
        users_db.append(admin_user)
        
        test_user = {
            "id": 2,
            "username": "testuser",
            "email": "test@planets.com",
            "hashed_password": get_password_hash("test123"),
            "is_active": True,
            "created_at": datetime.utcnow().isoformat()
        }
        users_db.append(test_user)
        
        print(f"✅ Initialized {len(planets_db)} planets and {len(users_db)} users")
        
    except Exception as e:
        print(f"❌ Error initializing data: {e}")

# Routes
@app.route('/')
def root():
    return jsonify({
        "message": "Welcome to the Planets API!",
        "version": "1.0.0",
        "endpoints": {
            "planets": "/planets",
            "auth": "/auth"
        }
    })

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "message": "Planets API is running"})

@app.route('/planets', methods=['GET'])
def get_planets():
    """Get all planets"""
    return jsonify(planets_db)

@app.route('/planets/<int:planet_id>', methods=['GET'])
def get_planet(planet_id):
    """Get planet by ID"""
    planet = next((p for p in planets_db if p['id'] == planet_id), None)
    if not planet:
        return jsonify({"detail": "Planet not found"}), 404
    return jsonify(planet)

@app.route('/planets', methods=['POST'])
@token_required
def create_planet(current_user):
    """Create new planet (requires authentication)"""
    data = request.get_json()
    
    # Check if planet with same name exists
    existing = next((p for p in planets_db if p['name'] == data['name']), None)
    if existing:
        return jsonify({"detail": "Planet with this name already exists"}), 400
    
    new_id = max([p['id'] for p in planets_db], default=0) + 1
    new_planet = {
        "id": new_id,
        "name": data['name'],
        "planet_type": data['planet_type'],
        "distance_from_sun": data['distance_from_sun'],
        "radius": data['radius'],
        "description": data.get('description'),
        "mass": data.get('mass'),
        "orbital_period": data.get('orbital_period'),
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    planets_db.append(new_planet)
    return jsonify(new_planet), 201

@app.route('/planets/<int:planet_id>', methods=['PUT'])
@token_required
def update_planet(current_user, planet_id):
    """Update planet (requires authentication)"""
    planet = next((p for p in planets_db if p['id'] == planet_id), None)
    if not planet:
        return jsonify({"detail": "Planet not found"}), 404
    
    data = request.get_json()
    
    # Update fields
    for field, value in data.items():
        if field in planet and value is not None:
            planet[field] = value
    planet['updated_at'] = datetime.utcnow().isoformat()
    
    return jsonify(planet)

@app.route('/planets/<int:planet_id>', methods=['DELETE'])
@token_required
def delete_planet(current_user, planet_id):
    """Delete planet (requires authentication)"""
    global planets_db
    planet = next((p for p in planets_db if p['id'] == planet_id), None)
    if not planet:
        return jsonify({"detail": "Planet not found"}), 404
    
    planets_db = [p for p in planets_db if p['id'] != planet_id]
    return '', 204

@app.route('/auth/login', methods=['POST'])
def login():
    """Login and get access token"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = next((u for u in users_db if u['username'] == username), None)
    if not user or not verify_password(password, user['hashed_password']):
        return jsonify({"detail": "Incorrect username or password"}), 401
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['username']}, expires_delta=access_token_expires
    )
    
    return jsonify({"access_token": access_token, "token_type": "bearer"})

@app.route('/auth/me', methods=['GET'])
@token_required
def get_current_user_info(current_user):
    """Get current user info"""
    # Remove password from response
    user_info = {k: v for k, v in current_user.items() if k != 'hashed_password'}
    return jsonify(user_info)

if __name__ == '__main__':
    print("🌍 Starting Planets API...")
    print("📚 API available at: http://localhost:8000")
    init_data()
    app.run(host='0.0.0.0', port=8000, debug=True)
