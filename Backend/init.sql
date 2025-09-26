-- PostgreSQL initialization script for Planets API
-- This script runs when the PostgreSQL container starts for the first time

-- Create the database if it doesn't exist (this is handled by POSTGRES_DB env var)
-- But we can add any additional setup here if needed

-- Enable UUID extension if needed in the future
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Any additional database setup can be added here
-- The FastAPI app will handle table creation via SQLAlchemy
