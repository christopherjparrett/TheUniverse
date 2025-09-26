# Docker Setup for Planetary Info Project

This document provides instructions for running the Planetary Info Project using Docker and Docker Compose.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose v3.8 or higher

## Quick Start

1. **Clone and navigate to the project directory**
   ```bash
   cd TheUniverse
   ```

2. **Create environment file**
   Create a `.env` file in the root directory with the following content:
   ```env
   # Database Configuration
   POSTGRES_DB=planets_db
   POSTGRES_USER=planets_user
   POSTGRES_PASSWORD=your-secure-database-password-here

   # JWT Configuration
   JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production-make-it-long-and-random-at-least-32-characters
   JWT_ALGORITHM=HS256
   JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

   # Application Configuration
   NODE_ENV=production
   REACT_APP_API_URL=http://localhost:8000

   # Optional: Mock Server Configuration
   MOCK_SERVER_PORT=4010
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Database: localhost:5432

## Services

### Backend (FastAPI)
- **Port**: 8000
- **Health Check**: http://localhost:8000/health
- **Features**: JWT authentication, CRUD operations, PostgreSQL integration

### Frontend (React + Nginx)
- **Port**: 3000
- **Features**: Production build served by Nginx with client-side routing

### Database (PostgreSQL)
- **Port**: 5432
- **Features**: Persistent data storage with health checks

### Mock Server (Prism) - Optional
- **Port**: 4010
- **Usage**: `docker-compose --profile mock up -d`
- **Features**: API mocking for development/testing

## Commands

### Start all services
```bash
docker-compose up -d
```

### Start with mock server
```bash
docker-compose --profile mock up -d
```

### View logs
```bash
docker-compose logs -f
```

### Stop all services
```bash
docker-compose down
```

### Stop and remove volumes (⚠️ This will delete all data)
```bash
docker-compose down -v
```

### Rebuild services
```bash
docker-compose up --build -d
```

## Development

### Backend Development
The backend code is mounted as a volume, so changes are reflected immediately. The container will restart automatically.

### Frontend Development
For frontend development, you may want to run the development server locally:
```bash
cd Frontend
npm install
npm run dev
```

## Production Considerations

1. **Security**: Change all default passwords and secrets in production
2. **SSL/TLS**: Configure HTTPS in production
3. **Database**: Use managed database services for production
4. **Monitoring**: Add logging and monitoring solutions
5. **Scaling**: Configure multiple backend instances behind a load balancer

## Troubleshooting

### Port Conflicts
If you encounter port conflicts, modify the ports in `docker-compose.yml`:
```yaml
ports:
  - "8001:8000"  # Change 8000 to 8001
```

### Database Connection Issues
Ensure the database is healthy before the backend starts:
```bash
docker-compose logs db
```

### Permission Issues
On Linux/macOS, you might need to fix file permissions:
```bash
sudo chown -R $USER:$USER .
```

## File Structure

```
├── Backend/
│   ├── Dockerfile
│   ├── init.sql
│   └── ... (existing files)
├── Frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── ... (existing files)
├── docker-compose.yml
├── .env (create this file)
└── DOCKER_SETUP.md
```
