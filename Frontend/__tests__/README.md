# Frontend Test Suite Documentation

This directory contains comprehensive unit tests for the Planets Universe React frontend application built with Vite, Tailwind CSS, and React Testing Library.

## 📁 Test Structure

```
__tests__/
├── Planets.test.jsx           # Planet directory component tests
├── PlanetDetail.test.jsx      # Planet detail component tests
├── Login.test.jsx             # Login component tests
├── AuthFlow.test.jsx          # Authentication flow tests
└── ProtectedRoute.test.jsx    # Protected route component tests

src/test/
├── setup.js                   # Test environment setup
└── test-utils.js              # Test utilities and helpers
```

## 🚀 How to Run Tests

### Prerequisites
```bash
# Install dependencies
npm install
```

### Running All Tests
```bash
# Run tests in watch mode (development)
npm run test

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests with UI interface
npm run test:ui
```

### Running Individual Test Files
```bash
# Test specific component
npm run test:run -- Planets.test.jsx

# Test with pattern matching
npm run test:run -- --grep "Planets"

# Run tests in specific directory
npm run test:run -- __tests__/
```

### Running Specific Tests
```bash
# Run specific test suite
npm run test:run -- --grep "renders planets list"

# Run tests with specific pattern
npm run test:run -- --grep "authentication"
```

## 📋 Test Files Overview

### `src/test/setup.js` - Test Environment Setup
**Purpose**: Configures the test environment and global mocks

**Key Features**:
- ✅ **Jest DOM matchers**: Custom matchers for DOM testing
- ✅ **localStorage mock**: Mock localStorage for token storage
- ✅ **window.location mock**: Mock browser location for redirects
- ✅ **fetch mock**: Mock HTTP requests
- ✅ **console mock**: Reduce console noise in tests

**What to Look For**:
- ✅ Mocks are properly configured
- ✅ Test environment is isolated
- ✅ No side effects between tests

### `src/test/test-utils.js` - Test Utilities
**Purpose**: Provides reusable test utilities and mock data

**Key Utilities**:
- ✅ **`renderWithProviders`**: Custom render function with context providers
- ✅ **`mockPlanets`**: Sample planet data for testing
- ✅ **`mockUser`**: Sample user data for testing
- ✅ **`mockFetch`**: Helper to mock API responses
- ✅ **`setupMocks`**: Initialize mocks before each test

**What to Look For**:
- ✅ Mock data is realistic and complete
- ✅ Utilities are reusable across tests
- ✅ Proper cleanup between tests

### `Planets.test.jsx` - Planet Directory Tests
**Purpose**: Tests the main planets listing component

**Test Scenarios**:
- ✅ **Loading State**: Shows loading spinner while fetching data
- ✅ **Data Display**: Renders planets list when data loads
- ✅ **Error Handling**: Shows error message when API fails
- ✅ **Search Functionality**: Filters planets by search term
- ✅ **Filter by Type**: Filters planets by planet type
- ✅ **Empty State**: Shows "no results" when no planets match
- ✅ **Admin Access**: Shows admin panel link for admin users

**What to Look For**:
- ✅ **Component Rendering**: Planets display correctly
- ✅ **User Interactions**: Search and filter work properly
- ✅ **Loading States**: Loading spinners appear/disappear
- ✅ **Error States**: Error messages display correctly
- ✅ **Access Control**: Admin features only show for admin users
- ✅ **Responsive Design**: Component works on different screen sizes

**Example Test Output**:
```
✓ renders loading state initially
✓ renders planets list when data is loaded
✓ displays error message when API fails
✓ filters planets by search term
✓ shows admin panel link for admin users
```

### `PlanetDetail.test.jsx` - Planet Detail Tests
**Purpose**: Tests the individual planet detail view

**Test Scenarios**:
- ✅ **Loading State**: Shows loading while fetching planet data
- ✅ **Planet Display**: Renders planet information correctly
- ✅ **Error Handling**: Shows error when planet not found
- ✅ **Physical Characteristics**: Displays physical properties
- ✅ **Orbital Characteristics**: Shows orbital data
- ✅ **Description**: Renders planet description
- ✅ **Metadata**: Shows creation and update dates
- ✅ **Number Formatting**: Formats large numbers correctly

**What to Look For**:
- ✅ **Data Accuracy**: Planet information displays correctly
- ✅ **Navigation**: Back button works properly
- ✅ **Error Recovery**: Retry functionality works
- ✅ **Data Formatting**: Numbers and dates format properly
- ✅ **Accessibility**: Component is accessible

**Example Test Output**:
```
✓ renders loading state initially
✓ renders planet details when data is loaded
✓ displays error message when planet is not found
✓ displays physical characteristics section
✓ formats large numbers correctly
```

### `Login.test.jsx` - Login Component Tests
**Purpose**: Tests the authentication login form

**Test Scenarios**:
- ✅ **Form Rendering**: Login form displays correctly
- ✅ **Input Handling**: Form inputs work properly
- ✅ **Loading State**: Shows loading during login
- ✅ **Successful Login**: Handles successful authentication
- ✅ **Login Error**: Displays error messages for failed login
- ✅ **Error Clearing**: Clears errors when user types
- ✅ **Redirect Logic**: Redirects authenticated users
- ✅ **Form Validation**: Validates required fields
- ✅ **Demo Credentials**: Shows demo login information

**What to Look For**:
- ✅ **Form Validation**: Required fields are validated
- ✅ **User Experience**: Smooth login flow
- ✅ **Error Handling**: Clear error messages
- ✅ **Security**: No sensitive data exposed
- ✅ **Accessibility**: Form is accessible

**Example Test Output**:
```
✓ renders login form
✓ handles form input changes
✓ shows loading state during login
✓ handles successful login
✓ handles login error
✓ validates required fields
```

### `AuthFlow.test.jsx` - Authentication Flow Tests
**Purpose**: Tests the complete authentication system

**Test Scenarios**:
- ✅ **Initial State**: Starts in unauthenticated state
- ✅ **Login Flow**: Complete login process works
- ✅ **Logout Flow**: Logout clears authentication
- ✅ **Token Storage**: JWT tokens stored in localStorage
- ✅ **Token Removal**: Tokens removed on logout
- ✅ **Auth Check**: Checks authentication on mount
- ✅ **Invalid Token**: Handles invalid tokens gracefully
- ✅ **Login Error**: Handles login failures

**What to Look For**:
- ✅ **State Management**: Authentication state updates correctly
- ✅ **Token Handling**: JWT tokens managed properly
- ✅ **Persistence**: Authentication persists across page reloads
- ✅ **Security**: Tokens are handled securely
- ✅ **Error Recovery**: System recovers from auth errors

**Example Test Output**:
```
✓ starts in unauthenticated state
✓ handles successful login flow
✓ handles logout flow
✓ stores JWT token in localStorage on login
✓ removes JWT token from localStorage on logout
✓ checks authentication status on mount
```

### `ProtectedRoute.test.jsx` - Protected Route Tests
**Purpose**: Tests route protection and access control

**Test Scenarios**:
- ✅ **Loading State**: Shows loading while checking auth
- ✅ **Authenticated Access**: Allows access when authenticated
- ✅ **Unauthenticated Redirect**: Redirects to login when not authenticated
- ✅ **Location State**: Passes location state for redirect
- ✅ **Route Protection**: Blocks access to protected content

**What to Look For**:
- ✅ **Access Control**: Proper route protection
- ✅ **User Experience**: Smooth redirects
- ✅ **State Preservation**: Location state maintained
- ✅ **Security**: Unauthorized access blocked

**Example Test Output**:
```
✓ shows loading state while checking authentication
✓ renders protected content when authenticated
✓ redirects to login when not authenticated
✓ passes location state when redirecting
```

## 🔍 What to Look For When Running Tests

### ✅ **Success Indicators**
- All tests show `✓` (pass) status
- Coverage report shows high percentage (>80%)
- No console errors or warnings
- Tests complete in reasonable time (<10 seconds)
- Mock functions called expected number of times

### ❌ **Failure Indicators**
- Tests show `✗` (fail) status
- Import errors or missing dependencies
- Mock functions not called as expected
- Component not rendering correctly
- User interactions not working

### 🚨 **Common Issues and Solutions**

**Issue**: `Cannot find module 'react'`
- **Solution**: Run `npm install` to install dependencies

**Issue**: `localStorage is not defined`
- **Solution**: Check that setup.js is properly configured

**Issue**: `fetch is not a function`
- **Solution**: Verify fetch mock is set up in test-utils.js

**Issue**: `Component not rendering`
- **Solution**: Check that all required providers are included

**Issue**: `Mock functions not called`
- **Solution**: Verify mock setup and function calls

## 📊 Test Coverage Goals

- **Overall Coverage**: >85%
- **Component Coverage**: 100% for major components
- **User Interactions**: >90% coverage
- **Authentication Flow**: 100% coverage
- **Error Handling**: >80% coverage

## 🎯 Test Quality Metrics

- **Test Speed**: All tests complete in <10 seconds
- **Test Reliability**: Tests pass consistently
- **Test Maintainability**: Clear test structure and naming
- **Test Coverage**: Comprehensive coverage of functionality

## 🔧 Debugging Tests

### Enable Debug Output
```bash
# Run with verbose output
npm run test:run -- --verbose

# Run specific test with debugging
npm run test:run -- --grep "renders planets list" --verbose
```

### View Coverage Report
```bash
# Generate coverage report
npm run test:coverage

# Open coverage report
open coverage/index.html  # macOS
start coverage/index.html  # Windows
```

### Debug Component Rendering
```bash
# Run tests with component debugging
npm run test:run -- --grep "Planets" --verbose
```

## 📝 Adding New Tests

When adding new tests:

1. **Follow naming convention**: `test_<functionality>`
2. **Use descriptive test names**: Clear what the test validates
3. **Use test utilities**: Leverage helpers from test-utils.js
4. **Mock external dependencies**: Mock API calls and browser APIs
5. **Test user interactions**: Include user event testing
6. **Test edge cases**: Include error conditions and loading states
7. **Update this documentation**: Add new test descriptions

## 🚀 Continuous Integration

These tests run automatically in GitHub Actions on:
- Every push to main/develop branches
- Every pull request
- Frontend build validation
- Integration testing pipeline

View test results and coverage reports in the GitHub Actions tab.

## 🎨 Test Best Practices

### Component Testing
- Test component rendering and user interactions
- Mock external dependencies (API calls, localStorage)
- Test loading and error states
- Verify accessibility features

### Authentication Testing
- Test login/logout flows
- Verify token storage and retrieval
- Test protected route access
- Validate error handling

### Integration Testing
- Test component interactions
- Verify API integration
- Test navigation flows
- Validate state management

## 🔍 Test Environment

- **Test Runner**: Vitest
- **Testing Library**: React Testing Library
- **Mocking**: Vitest mocks and MSW
- **Coverage**: V8 coverage provider
- **Environment**: jsdom (browser-like environment)
