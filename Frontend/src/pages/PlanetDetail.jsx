/**
 * Planet Detail Page
 * Displays detailed information about a specific planet
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { planetsAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';
import LogoutButton from '../components/LogoutButton';

const PlanetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [planet, setPlanet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (id) {
      fetchPlanet();
    }
  }, [id]);

  const fetchPlanet = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await planetsAPI.getById(id);
      setPlanet(data);
    } catch (err) {
      setError('Planet not found or failed to load.');
      console.error('Error fetching planet:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPlanetTypeColor = (type) => {
    const colors = {
      'Terrestrial': 'bg-green-100 text-green-800',
      'Gas Giant': 'bg-blue-100 text-blue-800',
      'Ice Giant': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatNumber = (num) => {
    if (num >= 1e24) {
      return `${(num / 1e24).toFixed(2)} × 10²⁴ kg`;
    } else if (num >= 1e23) {
      return `${(num / 1e23).toFixed(2)} × 10²³ kg`;
    }
    return `${num.toLocaleString()} kg`;
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

  const formatPeriod = (period) => {
    if (period >= 365) {
      const years = (period / 365).toFixed(1);
      return `${period} days (${years} years)`;
    }
    return `${period} days`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-900 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-space-300">Loading planet details...</p>
        </div>
      </div>
    );
  }

  if (error || !planet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => navigate('/planets')}
                className="btn-primary text-sm"
              >
                Back to Planets
              </button>
              <button
                onClick={fetchPlanet}
                className="btn-secondary text-sm"
              >
                Try Again
              </button>
            </div>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/planets"
                className="text-space-300 hover:text-white transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">{planet.name}</h1>
                <p className="text-space-300">Planet Details</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Planet Image and Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Planet Image */}
              {planet.image_url ? (
                <div className="h-64 overflow-hidden">
                  <img 
                    src={planet.image_url} 
                    alt={planet.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="h-64 hidden items-center justify-center"
                    style={{
                      backgroundColor: planet.color || '#6366f1'
                    }}
                  >
                    <div className="text-white text-8xl font-bold">
                      {planet.name.charAt(0)}
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className="h-64 flex items-center justify-center"
                  style={{
                    backgroundColor: planet.color || '#6366f1'
                  }}
                >
                  <div className="text-white text-8xl font-bold">
                    {planet.name.charAt(0)}
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-space-900">{planet.name}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanetTypeColor(planet.planet_type)}`}>
                    {planet.planet_type}
                  </span>
                </div>

                {planet.description && (
                  <p className="text-space-600 mb-6">{planet.description}</p>
                )}

                {/* Quick Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-space-200">
                    <span className="text-space-500 font-medium">Distance from Sun</span>
                    <span className="text-space-900 font-bold">{formatDistance(planet.distance_from_sun)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-space-200">
                    <span className="text-space-500 font-medium">Radius</span>
                    <span className="text-space-900 font-bold">{formatRadius(planet.radius)}</span>
                  </div>
                  {planet.mass && (
                    <div className="flex justify-between items-center py-2 border-b border-space-200">
                      <span className="text-space-500 font-medium">Mass</span>
                      <span className="text-space-900 font-bold">{formatNumber(planet.mass)}</span>
                    </div>
                  )}
                  {planet.orbital_period && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-space-500 font-medium">Orbital Period</span>
                      <span className="text-space-900 font-bold">{formatPeriod(planet.orbital_period)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-space-900 mb-6">Detailed Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Physical Characteristics */}
                <div>
                  <h4 className="text-lg font-semibold text-space-800 mb-4">Physical Characteristics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-space-600">Planet Type:</span>
                      <span className="font-medium">{planet.planet_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-space-600">Radius:</span>
                      <span className="font-medium">{formatRadius(planet.radius)}</span>
                    </div>
                    {planet.mass && (
                      <div className="flex justify-between">
                        <span className="text-space-600">Mass:</span>
                        <span className="font-medium">{formatNumber(planet.mass)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Orbital Characteristics */}
                <div>
                  <h4 className="text-lg font-semibold text-space-800 mb-4">Orbital Characteristics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-space-600">Distance from Sun:</span>
                      <span className="font-medium">{formatDistance(planet.distance_from_sun)}</span>
                    </div>
                    {planet.orbital_period && (
                      <div className="flex justify-between">
                        <span className="text-space-600">Orbital Period:</span>
                        <span className="font-medium">{formatPeriod(planet.orbital_period)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {planet.description && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-space-800 mb-4">Description</h4>
                  <p className="text-space-600 leading-relaxed">{planet.description}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="mt-8 pt-6 border-t border-space-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-space-500">
                  <div>
                    <span className="font-medium">Created:</span> {new Date(planet.created_at).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span> {new Date(planet.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanetDetail;
