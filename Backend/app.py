"""
FastAPI Planets API - Single File Application
Complete FastAPI application with JWT auth, SQLAlchemy, and CRUD operations
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.sql import func
from pydantic import BaseModel, Field
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import List, Optional
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./planets.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production-make-it-long-and-random")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Database Models
class Planet(Base):
    __tablename__ = "planets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    planet_type = Column(String(50), nullable=False)
    distance_from_sun = Column(Float, nullable=False)
    radius = Column(Float, nullable=False)
    description = Column(String(1000), nullable=True)
    mass = Column(Float, nullable=True)
    orbital_period = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

# Pydantic Schemas
class PlanetBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    planet_type: str = Field(..., min_length=1, max_length=50)
    distance_from_sun: float = Field(..., gt=0)
    radius: float = Field(..., gt=0)
    description: Optional[str] = Field(None, max_length=1000)
    mass: Optional[float] = Field(None, gt=0)
    orbital_period: Optional[float] = Field(None, gt=0)

class PlanetCreate(PlanetBase):
    pass

class PlanetUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    planet_type: Optional[str] = Field(None, min_length=1, max_length=50)
    distance_from_sun: Optional[float] = Field(None, gt=0)
    radius: Optional[float] = Field(None, gt=0)
    description: Optional[str] = Field(None, max_length=1000)
    mass: Optional[float] = Field(None, gt=0)
    orbital_period: Optional[float] = Field(None, gt=0)

class PlanetResponse(PlanetBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    created_at: datetime
    
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auth functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str, credentials_exception: HTTPException) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return username
    except JWTError:
        raise credentials_exception

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    username = verify_token(token, credentials_exception)
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        if user is None:
            raise credentials_exception
        return user
    finally:
        db.close()

# Database initialization
def create_tables():
    Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(Planet).count() > 0:
            print("📋 Database already seeded, skipping...")
            return
        
        # Load planets from seed_data.json
        with open("seed_data.json", "r") as file:
            data = json.load(file)
        
        # Seed planets
        for planet_data in data["planets"]:
            planet = Planet(
                name=planet_data["name"],
                planet_type=planet_data["planet_type"],
                distance_from_sun=planet_data["distance_from_sun"],
                radius=planet_data["radius"],
                description=planet_data["description"],
                mass=planet_data.get("mass"),
                orbital_period=planet_data.get("orbital_period")
            )
            db.add(planet)
        
        # Seed users
        for user_data in data["users"]:
            user = User(
                username=user_data["username"],
                email=user_data["email"],
                hashed_password=get_password_hash(user_data["password"]),
                is_active=True
            )
            db.add(user)
        
        db.commit()
        print(f"✅ Seeded {len(data['planets'])} planets and {len(data['users'])} users")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

# FastAPI App
app = FastAPI(
    title="Planets API",
    version="1.0.0",
    description="A REST API for managing planet data with JWT authentication",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
async def startup_event():
    print("🌍 Starting Planets API...")
    print("📚 API available at: http://localhost:8000")
    print("📖 Swagger UI available at: http://localhost:8000/docs")
    print("📋 OpenAPI spec available at: http://localhost:8000/openapi.json")
    
    create_tables()
    print("✅ Database tables created")
    
    seed_database()
    print("✅ Database seeded with initial data")

# Routes
@app.get("/", summary="API Information", tags=["root"])
async def root():
    """Get API information and available endpoints."""
    return {
        "message": "Welcome to the Planets API!",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "openapi": "/openapi.json",
        "endpoints": {
            "planets": "/planets",
            "auth": "/auth"
        }
    }

@app.get("/health", summary="Health Check", tags=["health"])
async def health_check():
    """Check API health status."""
    return {
        "status": "healthy",
        "message": "Planets API is running",
        "version": "1.0.0"
    }

# Planet routes
@app.get("/planets", response_model=List[PlanetResponse], summary="List all planets", tags=["planets"])
async def get_planets(db: Session = Depends(get_db)):
    """Get all planets. No authentication required."""
    planets = db.query(Planet).all()
    return planets

@app.get("/planets/{planet_id}", response_model=PlanetResponse, summary="Get planet by ID", tags=["planets"])
async def get_planet(planet_id: int, db: Session = Depends(get_db)):
    """Get a specific planet by its ID. No authentication required."""
    planet = db.query(Planet).filter(Planet.id == planet_id).first()
    if not planet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Planet not found"
        )
    return planet

@app.post("/planets", response_model=PlanetResponse, status_code=status.HTTP_201_CREATED, summary="Create new planet", tags=["planets"])
async def create_planet(
    planet: PlanetCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new planet. Authentication required."""
    # Check if planet with same name already exists
    existing_planet = db.query(Planet).filter(Planet.name == planet.name).first()
    if existing_planet:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Planet with this name already exists"
        )
    
    # Create new planet
    db_planet = Planet(**planet.dict())
    db.add(db_planet)
    db.commit()
    db.refresh(db_planet)
    
    return db_planet

@app.put("/planets/{planet_id}", response_model=PlanetResponse, summary="Update planet", tags=["planets"])
async def update_planet(
    planet_id: int,
    planet_update: PlanetUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update an existing planet. Authentication required."""
    # Find the planet
    db_planet = db.query(Planet).filter(Planet.id == planet_id).first()
    if not db_planet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Planet not found"
        )
    
    # Update only provided fields
    update_data = planet_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_planet, field, value)
    
    db.commit()
    db.refresh(db_planet)
    
    return db_planet

@app.delete("/planets/{planet_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete planet", tags=["planets"])
async def delete_planet(
    planet_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Delete a planet. Authentication required."""
    # Find the planet
    db_planet = db.query(Planet).filter(Planet.id == planet_id).first()
    if not db_planet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Planet not found"
        )
    
    db.delete(db_planet)
    db.commit()
    
    return None

# Auth routes
@app.post("/auth/login", response_model=Token, summary="Login and get access token", tags=["authentication"])
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login with username and password to get a JWT access token."""
    user = authenticate_user(db, user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=UserResponse, summary="Get current user info", tags=["authentication"])
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Get information about the currently authenticated user."""
    return current_user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
