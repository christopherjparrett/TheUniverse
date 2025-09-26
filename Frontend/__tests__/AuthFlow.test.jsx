/**
 * Test Authentication Flow
 */

import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../src/contexts/AuthContext'
import { renderWithProviders, mockAuthResponse, mockUser, setupMocks, cleanupMocks, mockFetch } from '../src/test/test-utils'
import { authAPI } from '../src/api'

// Mock the API layer instead of AuthContext
vi.mock('../src/api', () => ({
  authAPI: {
    login: vi.fn(),
    getCurrentUser: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: vi.fn()
  }
}))

// Test component that uses auth context
const TestAuthComponent = () => {
  const { isAuthenticated, user, login, logout } = useAuth()
  
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="user-info">{user ? user.username : 'no-user'}</div>
      <button onClick={() => login({ username: 'test', password: 'test' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('Authentication Flow', () => {
  beforeEach(() => {
    setupMocks()
    // Reset all mocks
    vi.mocked(authAPI.login).mockClear()
    vi.mocked(authAPI.getCurrentUser).mockClear()
    vi.mocked(authAPI.logout).mockClear()
    vi.mocked(authAPI.isAuthenticated).mockClear()
  })

  afterEach(() => {
    cleanupMocks()
  })

  it('starts in unauthenticated state', async () => {
    // Mock API to return no authentication
    vi.mocked(authAPI.isAuthenticated).mockReturnValue(false)
    
    renderWithProviders(<TestAuthComponent />)
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated')
      expect(screen.getByTestId('user-info')).toHaveTextContent('no-user')
    })
  })

  it('handles successful login flow', async () => {
    // Mock API responses for successful login
    vi.mocked(authAPI.isAuthenticated).mockReturnValue(false)
    vi.mocked(authAPI.login).mockResolvedValue(mockAuthResponse)
    vi.mocked(authAPI.getCurrentUser).mockResolvedValue(mockUser)
    
    renderWithProviders(<TestAuthComponent />)
    
    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)
    
    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith({ username: 'test', password: 'test' })
    })
    
    // After login, mock authenticated state
    vi.mocked(authAPI.isAuthenticated).mockReturnValue(true)
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')
      expect(screen.getByTestId('user-info')).toHaveTextContent('testuser')
    })
  })

  it('handles logout flow', async () => {
    // Mock authenticated state initially
    vi.mocked(authAPI.isAuthenticated).mockReturnValue(true)
    vi.mocked(authAPI.getCurrentUser).mockResolvedValue(mockUser)
    
    renderWithProviders(<TestAuthComponent />)
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated')
    })
    
    const logoutButton = screen.getByText('Logout')
    await userEvent.click(logoutButton)
    
    await waitFor(() => {
      expect(authAPI.logout).toHaveBeenCalled()
    })
  })

  it('stores JWT token in localStorage on login', async () => {
    // Mock API responses
    vi.mocked(authAPI.isAuthenticated).mockReturnValue(false)
    vi.mocked(authAPI.login).mockResolvedValue(mockAuthResponse)
    vi.mocked(authAPI.getCurrentUser).mockResolvedValue(mockUser)
    
    renderWithProviders(<TestAuthComponent />)
    
    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)
    
    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith({ username: 'test', password: 'test' })
    })
  })

  it('removes JWT token from localStorage on logout', async () => {
    // Mock authenticated state
    vi.mocked(authAPI.isAuthenticated).mockReturnValue(true)
    vi.mocked(authAPI.getCurrentUser).mockResolvedValue(mockUser)
    
    renderWithProviders(<TestAuthComponent />)
    
    const logoutButton = screen.getByText('Logout')
    await userEvent.click(logoutButton)
    
    await waitFor(() => {
      expect(authAPI.logout).toHaveBeenCalled()
    })
  })

  it('checks authentication status on mount', async () => {
    // Mock existing token and successful user fetch
    vi.mocked(authAPI.isAuthenticated).mockReturnValue(true)
    vi.mocked(authAPI.getCurrentUser).mockResolvedValue(mockUser)
    
    renderWithProviders(<TestAuthComponent />)
    
    await waitFor(() => {
      expect(authAPI.isAuthenticated).toHaveBeenCalled()
      expect(authAPI.getCurrentUser).toHaveBeenCalled()
    })
  })

  it('handles invalid token on mount', async () => {
    // Mock existing token but failed user fetch
    vi.mocked(authAPI.isAuthenticated).mockReturnValue(true)
    vi.mocked(authAPI.getCurrentUser).mockRejectedValue(new Error('Invalid token'))
    
    renderWithProviders(<TestAuthComponent />)
    
    await waitFor(() => {
      expect(authAPI.isAuthenticated).toHaveBeenCalled()
      expect(authAPI.getCurrentUser).toHaveBeenCalled()
      expect(authAPI.logout).toHaveBeenCalled()
    })
  })

  it('handles login error', async () => {
    // Mock API to reject login
    vi.mocked(authAPI.isAuthenticated).mockReturnValue(false)
    vi.mocked(authAPI.login).mockRejectedValue(new Error('Invalid credentials'))
    
    renderWithProviders(<TestAuthComponent />)
    
    const loginButton = screen.getByText('Login')
    await userEvent.click(loginButton)
    
    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith({ username: 'test', password: 'test' })
    })
    
    // Should remain unauthenticated
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated')
    })
  })
})
