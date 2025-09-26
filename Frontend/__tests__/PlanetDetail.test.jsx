/**
 * Test Planet Detail Component
 */

import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import PlanetDetail from '../src/pages/PlanetDetail'
import { renderWithProviders, mockPlanets, setupMocks, cleanupMocks, mockFetch, mockFetchError } from '../src/test/test-utils'

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

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => vi.fn(),
  }
})

describe('PlanetDetail Component', () => {
  beforeEach(() => {
    setupMocks()
  })

  afterEach(() => {
    cleanupMocks()
  })

  it('renders loading state initially', () => {
    mockFetch(mockPlanets[0])
    renderWithProviders(<PlanetDetail />)
    
    expect(screen.getByText('Loading planet details...')).toBeInTheDocument()
  })

  it('renders planet details when data is loaded', async () => {
    mockFetch(mockPlanets[0])
    renderWithProviders(<PlanetDetail />)
    
    await waitFor(() => {
      expect(screen.getAllByText('Mercury')).toHaveLength(2) // Header and card title
    })
    
    expect(screen.getByText('Planet Details')).toBeInTheDocument()
    expect(screen.getAllByText('Terrestrial')).toHaveLength(2) // Card badge and detailed section
    expect(screen.getAllByText('The smallest planet in our solar system')).toHaveLength(2) // Summary and detailed sections
    expect(screen.getAllByText('0.39 AU')).toHaveLength(2) // Summary and detailed sections
    expect(screen.getAllByText('2.4k km')).toHaveLength(2) // Summary and detailed sections
  })

  it('displays error message when planet is not found', async () => {
    mockFetchError('Planet not found')
    renderWithProviders(<PlanetDetail />)
    
    await waitFor(() => {
      expect(screen.getByText('Planet not found or failed to load.')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Back to Planets')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('displays physical characteristics section', async () => {
    mockFetch(mockPlanets[0])
    renderWithProviders(<PlanetDetail />)
    
    await waitFor(() => {
      expect(screen.getByText('Physical Characteristics')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Planet Type:')).toBeInTheDocument()
    expect(screen.getByText('Radius:')).toBeInTheDocument()
    expect(screen.getByText('Mass:')).toBeInTheDocument()
  })

  it('displays orbital characteristics section', async () => {
    mockFetch(mockPlanets[0])
    renderWithProviders(<PlanetDetail />)
    
    await waitFor(() => {
      expect(screen.getByText('Orbital Characteristics')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Distance from Sun:')).toBeInTheDocument()
    expect(screen.getByText('Orbital Period:')).toBeInTheDocument()
  })

  it('displays description section', async () => {
    mockFetch(mockPlanets[0])
    renderWithProviders(<PlanetDetail />)
    
    await waitFor(() => {
      expect(screen.getByText('Description')).toBeInTheDocument()
    })
    
    expect(screen.getAllByText('The smallest planet in our solar system')).toHaveLength(2) // Summary and detailed sections
  })

  it('displays metadata section', async () => {
    mockFetch(mockPlanets[0])
    renderWithProviders(<PlanetDetail />)
    
    await waitFor(() => {
      expect(screen.getByText('Created:')).toBeInTheDocument()
    })
    
    expect(screen.getByText('Last Updated:')).toBeInTheDocument()
  })

  it('shows admin panel link for admin users', async () => {
    mockFetch(mockPlanets[0])
    renderWithProviders(<PlanetDetail />)
    
    await waitFor(() => {
      expect(screen.getByText('Admin Panel')).toBeInTheDocument()
    })
  })

  it('formats large numbers correctly', async () => {
    mockFetch(mockPlanets[0])
    renderWithProviders(<PlanetDetail />)
    
    await waitFor(() => {
      expect(screen.getAllByText('3.30 × 10²³ kg')).toHaveLength(2) // Summary and detailed sections
    })
  })

  it('formats orbital period correctly', async () => {
    mockFetch(mockPlanets[0])
    renderWithProviders(<PlanetDetail />)
    
    await waitFor(() => {
      expect(screen.getAllByText('87.97 days')).toHaveLength(2) // Summary and detailed sections
    })
  })
})
