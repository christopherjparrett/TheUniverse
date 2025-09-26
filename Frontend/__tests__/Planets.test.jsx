/**
 * Test Planets Directory Component
 */

import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Planets from '../src/pages/Planets'
import { renderWithProviders, mockPlanets, mockUser, setupMocks, cleanupMocks, mockFetch, mockFetchError } from '../src/test/test-utils'

// Mock useAuth hook for admin panel test
vi.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { username: 'admin', id: 1 },
    isAdmin: true,
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
    loading: false
  }),
  AuthProvider: ({ children }) => children
}))

describe('Planets Component', () => {
  beforeEach(() => {
    setupMocks()
  })

  afterEach(() => {
    cleanupMocks()
  })

  it('renders loading state initially', () => {
    mockFetch([])
    renderWithProviders(<Planets />)
    
    expect(screen.getByText('Loading planets...')).toBeInTheDocument()
  })

  it('renders planets list when data is loaded', async () => {
    mockFetch(mockPlanets)
    renderWithProviders(<Planets />)
    
    await waitFor(() => {
      expect(screen.getByText('Mercury')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Venus')).toBeInTheDocument()
    expect(screen.getAllByText('Terrestrial')).toHaveLength(3) // One in filter dropdown, two in planet cards
  })

  it('displays error message when API fails', async () => {
    mockFetchError('Failed to load planets')
    renderWithProviders(<Planets />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load planets. Please try again.')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('filters planets by search term', async () => {
    mockFetch(mockPlanets)
    renderWithProviders(<Planets />)
    
    await waitFor(() => {
      expect(screen.getByText('Mercury')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Search by name or description...')
    await userEvent.type(searchInput, 'Mercury')
    
    expect(screen.getByText('Mercury')).toBeInTheDocument()
    expect(screen.queryByText('Venus')).not.toBeInTheDocument()
  })

  it('filters planets by type', async () => {
    mockFetch(mockPlanets)
    renderWithProviders(<Planets />)
    
    await waitFor(() => {
      expect(screen.getByText('Mercury')).toBeInTheDocument()
    })
    
    const filterSelect = screen.getByDisplayValue('All Types')
    await userEvent.selectOptions(filterSelect, 'Terrestrial')
    
    expect(screen.getByText('Mercury')).toBeInTheDocument()
    expect(screen.getByText('Venus')).toBeInTheDocument()
  })

  it('shows no results message when no planets match filter', async () => {
    mockFetch(mockPlanets)
    renderWithProviders(<Planets />)
    
    await waitFor(() => {
      expect(screen.getByText('Mercury')).toBeInTheDocument()
    })
    
    const searchInput = screen.getByPlaceholderText('Search by name or description...')
    await userEvent.type(searchInput, 'NonExistentPlanet')
    
    expect(screen.getByText('No planets found')).toBeInTheDocument()
  })

  it('displays planet count correctly', async () => {
    mockFetch(mockPlanets)
    renderWithProviders(<Planets />)
    
    await waitFor(() => {
      expect(screen.getByText('Showing 2 of 2 planets')).toBeInTheDocument()
    })
  })

  it('shows admin panel link for admin users', async () => {
    mockFetch(mockPlanets)
    renderWithProviders(<Planets />)
    
    await waitFor(() => {
      expect(screen.getByText('Admin Panel')).toBeInTheDocument()
    })
  })

  it('does not show admin panel link for non-admin users', async () => {
    mockFetch(mockPlanets)
    renderWithProviders(<Planets />, { 
      initialAuthState: { isAuthenticated: true, user: mockUser, isAdmin: false }
    })
    
    await waitFor(() => {
      expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument()
    })
  })
})
