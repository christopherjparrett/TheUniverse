/**
 * Test utilities and mocks for frontend tests
 */

import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { ToastProvider } from '../contexts/ToastContext'

// Mock API responses
export const mockPlanets = [
  {
    id: 1,
    name: 'Mercury',
    planet_type: 'Terrestrial',
    distance_from_sun: 0.39,
    radius: 2439.7,
    description: 'The smallest planet in our solar system',
    mass: 3.3011e23,
    orbital_period: 87.97,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Venus',
    planet_type: 'Terrestrial',
    distance_from_sun: 0.72,
    radius: 6051.8,
    description: 'The hottest planet in our solar system',
    mass: 4.8675e24,
    orbital_period: 224.7,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
]

export const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@planets.com',
  is_active: true,
  created_at: '2023-01-01T00:00:00Z'
}

export const mockAuthResponse = {
  access_token: 'mock-jwt-token',
  token_type: 'bearer'
}

// Custom render function with providers
export const renderWithProviders = (ui, { 
  initialAuthState = { isAuthenticated: false, user: null },
  ...renderOptions 
} = {}) => {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock fetch responses
export const mockFetch = (response, status = 200) => {
  global.fetch.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => response,
  })
}

// Mock fetch error
export const mockFetchError = (message = 'Network error') => {
  global.fetch.mockRejectedValueOnce(new Error(message))
}

// Mock localStorage
export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Setup mocks before each test
export const setupMocks = () => {
  global.fetch = vi.fn()
  global.localStorage = mockLocalStorage
  mockLocalStorage.getItem.mockReturnValue(null)
  mockLocalStorage.setItem.mockImplementation(() => {})
  mockLocalStorage.removeItem.mockImplementation(() => {})
  mockLocalStorage.clear.mockImplementation(() => {})
}

// Cleanup mocks after each test
export const cleanupMocks = () => {
  vi.clearAllMocks()
}
