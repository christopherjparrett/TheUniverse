# 🌍 Planetary Info Project

A full-stack web application for exploring and managing planets in our solar system. Built with modern technologies and comprehensive testing.

[![CI/CD Pipeline](https://github.com/christopherjparrett/TheUniverse/actions/workflows/ci.yml/badge.svg)](https://github.com/christopherjparrett/TheUniverse/actions/workflows/ci.yml)
[![Backend Tests](https://img.shields.io/badge/backend-tests-passing-brightgreen)](https://github.com/christopherjparrett/TheUniverse/actions)
[![Frontend Tests](https://img.shields.io/badge/frontend-tests-passing-brightgreen)](https://github.com/christopherjparrett/TheUniverse/actions)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://github.com/christopherjparrett/TheUniverse)

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### One-Command Setup
```bash
# Clone the repository
git clone https://github.com/christopherjparrett/TheUniverse.git
cd TheUniverse

# Create environment file
cp env.example .env

# Start all services
docker-compose up -d
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Database**: PostgreSQL (Docker) / SQLite (local development)

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.13
- **Database**: PostgreSQL (production) / SQLite (local development)
- **Authentication**: JWT tokens with python-jose
- **Documentation**: Auto-generated OpenAPI/Swagger
- **Testing**: pytest with comprehensive coverage

### Frontend (React)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom theme
- **Routing**: React Router with protected routes
- **State Management**: React Context API
- **Testing**: Vitest with React Testing Library

### DevOps
- **Containerization**: Multi-stage Docker builds
- **Orchestration**: Docker Compose with health checks
- **CI/CD**: GitHub Actions with automated testing
- **Security**: Vulnerability scanning with Trivy

## 🧪 Testing

### Backend Tests
```bash
cd Backend
pip install -r test-requirements.txt
pytest tests/ -v --cov=app
```

### Frontend Tests
```bash
cd Frontend
npm install
npm run test:run
```

### Run All Tests (Single Command)
```bash
# From the root TheUniverse directory
cd Backend; python -m pytest tests/ -v; cd ../Frontend; npm run test:run
```

### Integration Tests
```bash
# Start services
docker-compose up -d

# Run integration tests
curl -f http://localhost:8000/health
```

## 📊 Test Coverage

### Current Test Status
- **Backend**: 34 tests passing (100% success rate)
- **Frontend**: 39 tests passing (100% success rate)
- **Total**: 73 tests passing across the entire application

### Backend Coverage
- ✅ **API Endpoints**: All CRUD operations tested
- ✅ **Authentication**: JWT flow and protected routes
- ✅ **Database Models**: User and Planet models
- ✅ **Error Handling**: Edge cases and validation
- ✅ **Security**: Token validation and access control

### Frontend Coverage
- ✅ **Components**: All major components tested
- ✅ **Authentication Flow**: Login, logout, token storage
- ✅ **User Interactions**: Search, filtering, navigation
- ✅ **API Integration**: Error handling and loading states
- ✅ **Route Protection**: Authentication-based access control

## 🔄 CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow that runs on every push and pull request:

### Pipeline Stages
1. **Linting**: Code formatting and style checks
2. **Unit Tests**: Backend and frontend test suites
3. **Docker Build**: Multi-stage image validation
4. **Integration Tests**: End-to-end service testing
5. **Security Scan**: Vulnerability assessment
6. **Deployment**: Staging environment validation

### Quality Gates
- ✅ All tests must pass
- ✅ Code coverage thresholds met
- ✅ Docker builds successful
- ✅ Security scans clean
- ✅ Integration tests passing

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based auth
- **Route Protection**: Authentication-based access control
- **Input Validation**: Pydantic models for data validation
- **SQL Injection Protection**: SQLAlchemy ORM
- **CORS Configuration**: Proper cross-origin setup
- **Security Headers**: Nginx security headers
- **Vulnerability Scanning**: Automated security checks

## 📁 Project Structure

```
TheUniverse/
├── Backend/                 # FastAPI backend
│   ├── tests/              # Backend test suite
│   ├── Dockerfile          # Backend container
│   └── requirements.txt    # Python dependencies
├── Frontend/               # React frontend
│   ├── __tests__/         # Frontend test suite
│   ├── Dockerfile         # Frontend container
│   └── package.json       # Node dependencies
├── .github/workflows/     # CI/CD pipeline
├── docker-compose.yml     # Service orchestration
├── DOCKER_SETUP.md        # Docker documentation
└── env.example           # Environment template
```

## 🎯 Key Features

### Planet Management
- Browse all planets with search and filtering
- Detailed planet information with scientific data
- Admin panel for CRUD operations
- Responsive design for all devices

### Authentication System
- Secure JWT-based authentication
- Authentication-based route protection
- Token storage and management
- Admin role-based access control

### Developer Experience
- Comprehensive test coverage (100% pass rate)
- Automated CI/CD pipeline
- Docker containerization
- Detailed documentation
- Code quality tools
- Simplified authentication architecture

## 📚 Documentation

- [Backend API Documentation](Backend/README.md)
- [Backend Test Documentation](Backend/tests/README.md)
- [Frontend Documentation](Frontend/README.md)
- [Frontend Test Documentation](Frontend/__tests__/README.md)
- [Docker Setup Guide](DOCKER_SETUP.md)
- [Testing Guide](TESTING_GUIDE.md)
- [API Reference](http://localhost:8000/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- FastAPI for the excellent Python web framework
- React team for the powerful frontend library
- Tailwind CSS for the utility-first CSS framework
- Docker for containerization technology
- GitHub Actions for CI/CD automation
