/**
 * Test Login Component
 */

import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../src/pages/Login'
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

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
    Navigate: ({ to, replace }) => {
      // Simulate the Navigate component behavior
      mockNavigate(to, { replace })
      return null
    }
  }
})

describe('Login Component', () => {
  beforeEach(() => {
    setupMocks()
    mockNavigate.mockClear()
    // Reset all mocks
    vi.mocked(authAPI.login).mockClear()
    vi.mocked(authAPI.getCurrentUser).mockClear()
    vi.mocked(authAPI.logout).mockClear()
    vi.mocked(authAPI.isAuthenticated).mockClear()
  })

  afterEach(() => {
    cleanupMocks()
  })

  it('renders login form', () => {
    renderWithProviders(<Login />)
    
    expect(screen.getByText('Welcome to Planets Universe')).toBeInTheDocument()
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
  })

  it('handles form input changes', async () => {
    renderWithProviders(<Login />)
    
    const usernameInput = screen.getByLabelText('Username')
    const passwordInput = screen.getByLabelText('Password')
    
    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'testpass123')
    
    expect(usernameInput).toHaveValue('testuser')
    expect(passwordInput).toHaveValue('testpass123')
  })

  it('shows loading state during login', async () => {
    // Mock API to return a delayed response
    vi.mocked(authAPI.isAuthenticated).mockReturnValue(false)
    vi.mocked(authAPI.login).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockAuthResponse), 100))
    )
    
    renderWithProviders(<Login />)
    
    const usernameInput = screen.getByLabelText('Username')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: 'Sign In' })
    
    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'testpass123')
    await userEvent.click(loginButton)
    
    // The button should be disabled during login
    expect(loginButton).toBeDisabled()
  })

  it('handles successful login', async () => {
    // Mock successful API responses
    vi.mocked(authAPI.isAuthenticated).mockReturnValue(false)
    vi.mocked(authAPI.login).mockResolvedValue(mockAuthResponse)
    vi.mocked(authAPI.getCurrentUser).mockResolvedValue(mockUser)
    
    renderWithProviders(<Login />)
    
    const usernameInput = screen.getByLabelText('Username')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: 'Sign In' })
    
    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'testpass123')
    await userEvent.click(loginButton)
    
    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith({ username: 'testuser', password: 'testpass123' })
    })
    
    // After successful login, should navigate to planets page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/planets', { replace: true })
    })
  })

  it('handles login error', async () => {
    // Mock API to reject login
    vi.mocked(authAPI.isAuthenticated).mockReturnValue(false)
    vi.mocked(authAPI.login).mockRejectedValue(new Error('Invalid credentials'))
    
    renderWithProviders(<Login />)
    
    const usernameInput = screen.getByLabelText('Username')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: 'Sign In' })
    
    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'wrongpassword')
    await userEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('clears error when user starts typing', async () => {
    // Mock API to reject login
    vi.mocked(authAPI.isAuthenticated).mockReturnValue(false)
    vi.mocked(authAPI.login).mockRejectedValue(new Error('Invalid credentials'))
    
    renderWithProviders(<Login />)
    
    const usernameInput = screen.getByLabelText('Username')
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: 'Sign In' })
    
    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'wrongpassword')
    await userEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
    
    await userEvent.type(usernameInput, 'x')
    
    expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument()
  })

  it('redirects authenticated users to planets page', async () => {
    // Mock authenticated state
    vi.mocked(authAPI.isAuthenticated).mockReturnValue(true)
    vi.mocked(authAPI.getCurrentUser).mockResolvedValue(mockUser)
    
    renderWithProviders(<Login />)
    
    // Wait for AuthContext to initialize
    await waitFor(() => {
      expect(authAPI.isAuthenticated).toHaveBeenCalled()
    })
    
    // The Navigate component should be called immediately
    expect(mockNavigate).toHaveBeenCalledWith('/planets', { replace: true })
  })

  it('validates required fields', async () => {
    // Ensure component is not authenticated so it renders the form
    vi.mocked(authAPI.isAuthenticated).mockReturnValue(false)
    
    renderWithProviders(<Login />)
    
    const loginButton = screen.getByRole('button', { name: 'Sign In' })
    await userEvent.click(loginButton)
    
    // The form uses HTML5 validation, so we check for the required attributes
    const usernameInput = screen.getByLabelText('Username')
    const passwordInput = screen.getByLabelText('Password')
    
    expect(usernameInput).toHaveAttribute('required')
    expect(passwordInput).toHaveAttribute('required')
  })

  it('shows demo credentials', () => {
    renderWithProviders(<Login />)
    
    expect(screen.getByText('Demo Credentials:')).toBeInTheDocument()
    expect(screen.getByText('admin / admin123')).toBeInTheDocument()
    expect(screen.getByText('testuser / test123')).toBeInTheDocument()
  })
})
