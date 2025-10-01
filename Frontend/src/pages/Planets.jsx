/**
 * Planets Directory Page
 * Displays all planets in a responsive grid layout with search and filter functionality
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { planetsAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';
import LogoutButton from '../components/LogoutButton';

const Planets = () => {
  const [planets, setPlanets] = useState([]);
  const [filteredPlanets, setFilteredPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    fetchPlanets();
  }, []);

  useEffect(() => {
    filterPlanets();
  }, [planets, searchTerm, filterType]);

  const fetchPlanets = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await planetsAPI.getAll();
      setPlanets(data);
    } catch (err) {
      setError('Failed to load planets. Please try again.');
      console.error('Error fetching planets:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterPlanets = () => {
    let filtered = planets;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(planet =>
        planet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        planet.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by planet type
    if (filterType !== 'all') {
      filtered = filtered.filter(planet => planet.planet_type === filterType);
    }

    setFilteredPlanets(filtered);
  };

  const getPlanetTypeColor = (type) => {
    const colors = {
      'Terrestrial': 'bg-green-100 text-green-800',
      'Gas Giant': 'bg-blue-100 text-blue-800',
      'Ice Giant': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDistance = (distance) => {
    return `${distance} AU`;
  };

  const formatRadius = (radius) => {
    if (radius >= 1000) {
      return `${(radius / 1000).toFixed(1)}k km`;
    }
    return `${radius.toFixed(1)} km`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-900 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-space-300">Loading planets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={fetchPlanets}
              className="mt-3 btn-primary text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-900">
      {/* Header */}
      <div className="bg-space-800/50 backdrop-blur-sm border-b border-space-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Planets Directory</h1>
              <p className="mt-1 text-space-300">
                Explore the planets of our solar system
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <div className="hidden sm:block text-sm text-space-300">
                Welcome, <span className="text-white font-medium">{user?.username}</span>
                {isAdmin && (
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                    Admin
                  </span>
                )}
              </div>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="btn-primary"
                >
                  Admin Panel
                </Link>
              )}
              <LogoutButton variant="secondary" showConfirmation={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="form-label">
                Search Planets
              </label>
              <input
                id="search"
                type="text"
                className="form-input"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div>
              <label htmlFor="filter" className="form-label">
                Filter by Type
              </label>
              <select
                id="filter"
                className="form-input"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="Terrestrial">Terrestrial</option>
                <option value="Gas Giant">Gas Giant</option>
                <option value="Ice Giant">Ice Giant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-space-300">
            Showing {filteredPlanets.length} of {planets.length} planets
          </p>
        </div>

        {/* Planets Grid */}
        {filteredPlanets.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-space-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-space-900">No planets found</h3>
              <p className="mt-1 text-sm text-space-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlanets.map((planet) => (
              <Link
                key={planet.id}
                to={`/planets/${planet.id}`}
                className="card-hover bg-white rounded-lg shadow-lg overflow-hidden"
              >
                {/* Planet Image Placeholder */}
                <div 
                  className="h-48 flex items-center justify-center"
                  style={{
                    backgroundColor: planet.color || '#6366f1',
                    backgroundImage: planet.color ? 'none' : 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
                    '--tw-gradient-from': '#818cf8',
                    '--tw-gradient-to': '#6366f1',
                    '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)'
                  }}
                >
                  <div className="text-white text-6xl font-bold">
                    {planet.name.charAt(0)}
                  </div>
                </div>

                {/* Planet Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-space-900">
                      {planet.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanetTypeColor(planet.planet_type)}`}>
                      {planet.planet_type}
                    </span>
                  </div>

                  <p className="text-space-600 text-sm mb-4 line-clamp-2">
                    {planet.description || 'No description available'}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-space-500">Distance from Sun:</span>
                      <span className="font-medium">{formatDistance(planet.distance_from_sun)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-space-500">Radius:</span>
                      <span className="font-medium">{formatRadius(planet.radius)}</span>
                    </div>
                    {planet.orbital_period && (
                      <div className="flex justify-between">
                        <span className="text-space-500">Orbital Period:</span>
                        <span className="font-medium">{planet.orbital_period} days</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Planets;
