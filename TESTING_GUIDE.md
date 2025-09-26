# 🧪 Testing Quick Reference Guide

This guide provides quick commands and reference information for running tests in the Planetary Info Project.

## 🚀 Quick Commands

### Backend Tests (FastAPI + Pytest)
```bash
# Navigate to backend
cd Backend

# Install test dependencies
pip install -r test-requirements.txt

# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=app --cov-report=html

# Run specific test file
pytest tests/test_endpoints.py -v
pytest tests/test_auth.py -v
pytest tests/test_models.py -v
```

### Frontend Tests (React + Vitest)
```bash
# Navigate to frontend
cd Frontend

# Install dependencies
npm install

# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test:run -- Planets.test.jsx
npm run test:run -- Login.test.jsx
```

## 📊 Test Coverage Commands

### Backend Coverage
```bash
# Generate HTML coverage report
pytest tests/ --cov=app --cov-report=html

# View coverage in terminal
pytest tests/ --cov=app --cov-report=term-missing

# Coverage threshold
pytest tests/ --cov=app --cov-fail-under=80
```

### Frontend Coverage
```bash
# Generate coverage report
npm run test:coverage

# Coverage with specific threshold
npm run test:run -- --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'
```

## 🔍 Debugging Commands

### Backend Debugging
```bash
# Maximum verbosity
pytest tests/ -vvv

# Show print statements
pytest tests/ -s

# Run specific test with debug
pytest tests/test_endpoints.py::TestPlanetsEndpoints::test_create_planet_with_auth -vvv -s

# Debug with logging
pytest tests/ -v --log-cli-level=DEBUG
```

### Frontend Debugging
```bash
# Verbose output
npm run test:run -- --verbose

# Run specific test
npm run test:run -- --grep "renders planets list" --verbose

# Debug mode
npm run test:run -- --grep "Planets" --verbose
```

## 📋 Test File Reference

### Backend Test Files
- **`conftest.py`**: Test configuration and fixtures
- **`test_endpoints.py`**: API endpoint tests (GET, POST, PUT, DELETE)
- **`test_auth.py`**: JWT authentication tests
- **`test_models.py`**: Database model tests

### Frontend Test Files
- **`Planets.test.jsx`**: Planet directory component tests
- **`PlanetDetail.test.jsx`**: Planet detail component tests
- **`Login.test.jsx`**: Login form tests
- **`AuthFlow.test.jsx`**: Authentication flow tests
- **`ProtectedRoute.test.jsx`**: Route protection tests

## 🎯 What Each Test Validates

### Backend Tests
- ✅ **API Endpoints**: All CRUD operations work correctly
- ✅ **Authentication**: JWT tokens and protected routes
- ✅ **Database**: Models and data persistence
- ✅ **Error Handling**: Proper error responses
- ✅ **Validation**: Input validation and edge cases

### Frontend Tests
- ✅ **Components**: Rendering and user interactions
- ✅ **Authentication**: Login/logout and token management
- ✅ **Navigation**: Route protection and redirects
- ✅ **API Integration**: Data fetching and error handling
- ✅ **User Experience**: Loading states and error messages

## 🚨 Common Issues & Solutions

### Backend Issues
```bash
# Module not found
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Database connection issues
# Check DATABASE_URL in .env file

# JWT token issues
# Verify JWT_SECRET_KEY configuration
```

### Frontend Issues
```bash
# Dependencies not installed
npm install

# Mock issues
# Check setup.js configuration

# Component not rendering
# Verify all providers are included
```

## 📈 Coverage Goals

- **Backend**: >85% overall coverage
- **Frontend**: >85% overall coverage
- **API Endpoints**: 100% coverage
- **Authentication**: 100% coverage
- **Components**: >90% coverage

## 🔄 CI/CD Integration

Tests run automatically on:
- Push to main/develop branches
- Pull requests
- Docker builds
- Integration testing

View results in GitHub Actions tab.

## 📚 Additional Resources

- [Backend Test Documentation](Backend/tests/README.md)
- [Frontend Test Documentation](Frontend/__tests__/README.md)
- [Pytest Documentation](https://docs.pytest.org/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
