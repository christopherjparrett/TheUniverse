# Backend Test Suite Documentation

This directory contains comprehensive unit tests for the Planets API backend built with FastAPI, SQLAlchemy, and JWT authentication.

## 📁 Test Structure

```
tests/
├── conftest.py          # Test configuration and fixtures
├── test_endpoints.py    # API endpoint tests
├── test_auth.py         # Authentication and JWT tests
└── test_models.py       # Database model tests
```

## 🚀 How to Run Tests

### Prerequisites
```bash
# Install test dependencies
pip install -r test-requirements.txt
```

### Running All Tests
```bash
# Run all tests with verbose output
pytest tests/ -v

# Run with coverage report
pytest tests/ -v --cov=app --cov-report=html

# Run specific test file
pytest tests/test_endpoints.py -v
```

### Running Individual Test Files
```bash
# Test API endpoints
pytest tests/test_endpoints.py -v

# Test authentication
pytest tests/test_auth.py -v

# Test database models
pytest tests/test_models.py -v
```

### Running Specific Tests
```bash
# Run specific test class
pytest tests/test_endpoints.py::TestPlanetsEndpoints -v

# Run specific test method
pytest tests/test_endpoints.py::TestPlanetsEndpoints::test_get_planets_with_data -v

# Run tests with specific markers
pytest tests/ -m auth -v
```

## 📋 Test Files Overview

### `conftest.py` - Test Configuration
**Purpose**: Contains shared test fixtures and configuration

**Key Fixtures**:
- `test_db`: Creates fresh database for each test
- `client`: FastAPI test client
- `test_user`: Creates test user for authentication
- `test_admin`: Creates admin user for testing
- `test_planets`: Creates sample planet data
- `auth_token`: JWT token for authenticated requests
- `auth_headers`: Authorization headers for API calls

**What to Look For**:
- ✅ Database isolation (each test gets clean database)
- ✅ Proper fixture setup and teardown
- ✅ Test data consistency

### `test_endpoints.py` - API Endpoint Tests
**Purpose**: Tests all REST API endpoints for planet management

**Test Classes**:
- `TestHealthEndpoint`: Health check functionality
- `TestRootEndpoint`: API information endpoint
- `TestPlanetsEndpoints`: CRUD operations for planets

**Key Test Scenarios**:
- ✅ **GET /planets**: Returns list of planets
- ✅ **GET /planets/{id}**: Returns specific planet details
- ✅ **POST /planets**: Creates new planet (requires auth)
- ✅ **PUT /planets/{id}**: Updates planet (requires auth)
- ✅ **DELETE /planets/{id}**: Deletes planet (requires auth)

**What to Look For**:
- ✅ **Status Codes**: Correct HTTP status codes (200, 201, 404, 401)
- ✅ **Data Validation**: Proper request/response data structure
- ✅ **Authentication**: Protected endpoints require valid JWT
- ✅ **Error Handling**: Proper error messages for invalid requests
- ✅ **Edge Cases**: Non-existent planets, duplicate names, validation errors

**Example Test Output**:
```
test_get_planets_empty PASSED           # Empty database returns empty list
test_get_planets_with_data PASSED       # Returns planets when data exists
test_create_planet_without_auth FAILED  # Should return 401 Unauthorized
test_create_planet_with_auth PASSED    # Creates planet with valid token
```

### `test_auth.py` - Authentication Tests
**Purpose**: Tests JWT authentication system and protected routes

**Test Classes**:
- `TestAuthentication`: Login/logout functionality
- `TestJWTTokenGeneration`: Token creation and validation
- `TestProtectedRoutes`: Access control for protected endpoints

**Key Test Scenarios**:
- ✅ **Login Success**: Valid credentials return JWT token
- ✅ **Login Failure**: Invalid credentials return 401
- ✅ **Token Validation**: Valid tokens allow access
- ✅ **Token Expiration**: Expired tokens are rejected
- ✅ **Protected Routes**: Require valid authentication

**What to Look For**:
- ✅ **Token Generation**: JWT tokens contain correct user data
- ✅ **Token Expiration**: Tokens expire after configured time
- ✅ **Access Control**: Protected routes block unauthorized access
- ✅ **Error Messages**: Clear error messages for auth failures
- ✅ **Security**: Invalid/malformed tokens are rejected

**Example Test Output**:
```
test_login_success PASSED              # Valid login returns token
test_login_invalid_username FAILED     # Invalid username returns 401
test_get_current_user_success PASSED  # Valid token returns user info
test_protected_route_without_token FAILED  # No token returns 401
```

### `test_models.py` - Database Model Tests
**Purpose**: Tests database models and utility functions

**Test Classes**:
- `TestUserModel`: User model functionality
- `TestPlanetModel`: Planet model functionality
- `TestJWTUtilities`: JWT helper functions

**Key Test Scenarios**:
- ✅ **User Creation**: Users can be created with proper data
- ✅ **Password Hashing**: Passwords are properly hashed
- ✅ **Planet Creation**: Planets can be created with required fields
- ✅ **JWT Utilities**: Token creation and validation functions work

**What to Look For**:
- ✅ **Data Integrity**: Models store data correctly
- ✅ **Password Security**: Passwords are hashed, not stored plain
- ✅ **Validation**: Required fields are enforced
- ✅ **Relationships**: Database relationships work correctly
- ✅ **Utility Functions**: Helper functions work as expected

**Example Test Output**:
```
test_create_user PASSED                # User created with correct data
test_user_password_hashing PASSED      # Password properly hashed
test_create_planet PASSED              # Planet created successfully
test_create_access_token PASSED        # JWT token generated correctly
```

## 🔍 What to Look For When Running Tests

### ✅ **Success Indicators**
- All tests show `PASSED` status
- Coverage report shows high percentage (>80%)
- No warnings or errors in output
- Tests complete in reasonable time (<30 seconds)

### ❌ **Failure Indicators**
- Tests show `FAILED` status
- Import errors or missing dependencies
- Database connection issues
- Authentication token problems
- Coverage below acceptable threshold

### 🚨 **Common Issues and Solutions**

**Issue**: `ModuleNotFoundError: No module named 'app'`
- **Solution**: Run tests from Backend directory or set PYTHONPATH

**Issue**: `Database connection failed`
- **Solution**: Check if test database is accessible, verify DATABASE_URL

**Issue**: `JWT token validation failed`
- **Solution**: Check JWT_SECRET_KEY and ALGORITHM configuration

**Issue**: `Test data not found`
- **Solution**: Verify test fixtures are properly set up in conftest.py

## 📊 Test Coverage Goals

- **Overall Coverage**: >80% ✅ (Currently 84%)
- **API Endpoints**: 100% coverage ✅
- **Authentication**: 100% coverage ✅
- **Database Models**: >90% coverage ✅
- **Error Handling**: >80% coverage ✅

## 🎯 Test Quality Metrics

- **Test Speed**: All tests complete in <30 seconds
- **Test Reliability**: Tests pass consistently (no flaky tests)
- **Test Maintainability**: Clear test names and structure
- **Test Coverage**: Comprehensive coverage of all functionality

## 🔧 Debugging Tests

### Enable Debug Output
```bash
# Run with maximum verbosity
pytest tests/ -vvv

# Run with print statements visible
pytest tests/ -s

# Run specific test with debugging
pytest tests/test_endpoints.py::TestPlanetsEndpoints::test_create_planet_with_auth -vvv -s
```

### View Coverage Report
```bash
# Generate HTML coverage report
pytest tests/ --cov=app --cov-report=html

# Open coverage report
open htmlcov/index.html  # macOS
start htmlcov/index.html  # Windows
```

### Test Database Inspection
```bash
# Run tests with database logging
pytest tests/ -v --log-cli-level=DEBUG
```

## 📝 Adding New Tests

When adding new tests:

1. **Follow naming convention**: `test_<functionality>`
2. **Use descriptive test names**: Clear what the test validates
3. **Add proper docstrings**: Explain test purpose
4. **Use fixtures**: Leverage existing fixtures from conftest.py
5. **Test edge cases**: Include error conditions and boundary cases
6. **Update this documentation**: Add new test descriptions
7. **🔄 Clean up after yourself**: Use API endpoints to create and delete test data

### 🔄 Test Cleanup Strategy

**Self-Cleaning Tests**: Tests use the actual API endpoints to create and delete test data, ensuring:
- ✅ **No Database Pollution**: Tests clean up after themselves
- ✅ **Real API Testing**: Tests use actual endpoints instead of direct database operations
- ✅ **Isolation**: Each test is independent and doesn't affect others
- ✅ **Consistency**: Tests verify the full API workflow (create → verify → delete)

**Example Test Pattern:**
```python
def test_create_planet_with_auth(self, client, auth_headers):
    # 1. Create planet via API
    response = client.post("/planets", json=planet_data, headers=auth_headers)
    assert response.status_code == 201
    
    # 2. Verify planet was created correctly
    data = response.json()
    assert data["name"] == "Test Planet"
    
    # 3. Clean up - delete the planet via API
    delete_response = client.delete(f"/planets/{data['id']}", headers=auth_headers)
    assert delete_response.status_code == 204
```

**Benefits:**
- **Database Hygiene**: No leftover test data
- **Realistic Testing**: Tests actual API behavior
- **Maintainability**: Tests are self-contained
- **Reliability**: Tests don't interfere with each other

## 🚀 Continuous Integration

These tests run automatically in GitHub Actions on:
- Every push to main/develop branches
- Every pull request
- Docker build validation
- Integration testing pipeline

View test results and coverage reports in the GitHub Actions tab.
