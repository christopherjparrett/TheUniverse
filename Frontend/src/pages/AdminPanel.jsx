/**
 * Admin Panel Page
 * Provides CRUD operations for planets (Create, Read, Update, Delete)
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { planetsAPI } from '../api';
import { useAuth } from '../contexts/AuthContext';
import LogoutButton from '../components/LogoutButton';

const AdminPanel = () => {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    planet_type: '',
    distance_from_sun: '',
    radius: '',
    description: '',
    mass: '',
    orbital_period: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, isAdmin } = useAuth();

  // If user is not admin, show access denied (this shouldn't happen due to route protection, but good fallback)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md">
            <p className="font-medium">Access Denied</p>
            <p className="text-sm mt-1">You don't have permission to access the admin panel.</p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchPlanets();
  }, []);

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

  const resetForm = () => {
    setFormData({
      name: '',
      planet_type: '',
      distance_from_sun: '',
      radius: '',
      description: '',
      mass: '',
      orbital_period: ''
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.planet_type.trim()) errors.planet_type = 'Planet type is required';
    if (!formData.distance_from_sun || formData.distance_from_sun <= 0) {
      errors.distance_from_sun = 'Distance from sun must be greater than 0';
    }
    if (!formData.radius || formData.radius <= 0) {
      errors.radius = 'Radius must be greater than 0';
    }
    if (formData.mass && formData.mass <= 0) {
      errors.mass = 'Mass must be greater than 0';
    }
    if (formData.orbital_period && formData.orbital_period <= 0) {
      errors.orbital_period = 'Orbital period must be greater than 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const planetData = {
        ...formData,
        distance_from_sun: parseFloat(formData.distance_from_sun),
        radius: parseFloat(formData.radius),
        mass: formData.mass ? parseFloat(formData.mass) : null,
        orbital_period: formData.orbital_period ? parseFloat(formData.orbital_period) : null
      };

      await planetsAPI.create(planetData);
      setShowCreateModal(false);
      resetForm();
      fetchPlanets();
    } catch (err) {
      setFormErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const planetData = {
        ...formData,
        distance_from_sun: parseFloat(formData.distance_from_sun),
        radius: parseFloat(formData.radius),
        mass: formData.mass ? parseFloat(formData.mass) : null,
        orbital_period: formData.orbital_period ? parseFloat(formData.orbital_period) : null
      };

      await planetsAPI.update(selectedPlanet.id, planetData);
      setShowEditModal(false);
      setSelectedPlanet(null);
      resetForm();
      fetchPlanets();
    } catch (err) {
      setFormErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await planetsAPI.delete(selectedPlanet.id);
      setShowDeleteModal(false);
      setSelectedPlanet(null);
      fetchPlanets();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (planet) => {
    setSelectedPlanet(planet);
    setFormData({
      name: planet.name,
      planet_type: planet.planet_type,
      distance_from_sun: planet.distance_from_sun.toString(),
      radius: planet.radius.toString(),
      description: planet.description || '',
      mass: planet.mass ? planet.mass.toString() : '',
      orbital_period: planet.orbital_period ? planet.orbital_period.toString() : ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (planet) => {
    setSelectedPlanet(planet);
    setShowDeleteModal(true);
  };

  const getPlanetTypeColor = (type) => {
    const colors = {
      'Terrestrial': 'bg-green-100 text-green-800',
      'Gas Giant': 'bg-blue-100 text-blue-800',
      'Ice Giant': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-900 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-space-300">Loading admin panel...</p>
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
              <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
              <p className="mt-1 text-space-300">
                Manage planets
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <div className="hidden sm:block text-sm text-space-300">
                Welcome, <span className="text-white font-medium">{user?.username}</span>
              </div>
              <Link
                to="/planets"
                className="btn-secondary"
              >
                View Planets
              </Link>
              <button
                onClick={() => {
                  resetForm();
                  setShowCreateModal(true);
                }}
                className="btn-primary"
              >
                Add New Planet
              </button>
              <LogoutButton variant="danger" showConfirmation={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Planets Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-space-200">
            <h2 className="text-xl font-semibold text-space-900">Planets Management</h2>
          </div>
          
          {planets.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-space-500">No planets found. Create your first planet!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-space-200">
                <thead className="bg-space-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-space-500 uppercase tracking-wider">
                      Planet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-space-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-space-500 uppercase tracking-wider">
                      Distance (AU)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-space-500 uppercase tracking-wider">
                      Radius (km)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-space-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-space-200">
                  {planets.map((planet) => (
                    <tr key={planet.id} className="hover:bg-space-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-primary-600 font-bold">
                              {planet.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-space-900">
                              {planet.name}
                            </div>
                            <div className="text-sm text-space-500">
                              ID: {planet.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanetTypeColor(planet.planet_type)}`}>
                          {planet.planet_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-space-900">
                        {planet.distance_from_sun}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-space-900">
                        {planet.radius.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          to={`/planets/${planet.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => openEditModal(planet)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(planet)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Planet Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-space-200">
              <h3 className="text-lg font-semibold text-space-900">Create New Planet</h3>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="form-label">Planet Type *</label>
                  <select
                    name="planet_type"
                    className="form-input"
                    value={formData.planet_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Terrestrial">Terrestrial</option>
                    <option value="Gas Giant">Gas Giant</option>
                    <option value="Ice Giant">Ice Giant</option>
                  </select>
                  {formErrors.planet_type && <p className="text-red-500 text-sm mt-1">{formErrors.planet_type}</p>}
                </div>
                <div>
                  <label className="form-label">Distance from Sun (AU) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="distance_from_sun"
                    className="form-input"
                    value={formData.distance_from_sun}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.distance_from_sun && <p className="text-red-500 text-sm mt-1">{formErrors.distance_from_sun}</p>}
                </div>
                <div>
                  <label className="form-label">Radius (km) *</label>
                  <input
                    type="number"
                    step="0.1"
                    name="radius"
                    className="form-input"
                    value={formData.radius}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.radius && <p className="text-red-500 text-sm mt-1">{formErrors.radius}</p>}
                </div>
                <div>
                  <label className="form-label">Mass (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="mass"
                    className="form-input"
                    value={formData.mass}
                    onChange={handleInputChange}
                  />
                  {formErrors.mass && <p className="text-red-500 text-sm mt-1">{formErrors.mass}</p>}
                </div>
                <div>
                  <label className="form-label">Orbital Period (days)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="orbital_period"
                    className="form-input"
                    value={formData.orbital_period}
                    onChange={handleInputChange}
                  />
                  {formErrors.orbital_period && <p className="text-red-500 text-sm mt-1">{formErrors.orbital_period}</p>}
                </div>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  className="form-input"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              {formErrors.submit && <p className="text-red-500 text-sm">{formErrors.submit}</p>}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Planet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Planet Modal */}
      {showEditModal && selectedPlanet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-space-200">
              <h3 className="text-lg font-semibold text-space-900">Edit Planet: {selectedPlanet.name}</h3>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="form-label">Planet Type *</label>
                  <select
                    name="planet_type"
                    className="form-input"
                    value={formData.planet_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Terrestrial">Terrestrial</option>
                    <option value="Gas Giant">Gas Giant</option>
                    <option value="Ice Giant">Ice Giant</option>
                  </select>
                  {formErrors.planet_type && <p className="text-red-500 text-sm mt-1">{formErrors.planet_type}</p>}
                </div>
                <div>
                  <label className="form-label">Distance from Sun (AU) *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="distance_from_sun"
                    className="form-input"
                    value={formData.distance_from_sun}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.distance_from_sun && <p className="text-red-500 text-sm mt-1">{formErrors.distance_from_sun}</p>}
                </div>
                <div>
                  <label className="form-label">Radius (km) *</label>
                  <input
                    type="number"
                    step="0.1"
                    name="radius"
                    className="form-input"
                    value={formData.radius}
                    onChange={handleInputChange}
                    required
                  />
                  {formErrors.radius && <p className="text-red-500 text-sm mt-1">{formErrors.radius}</p>}
                </div>
                <div>
                  <label className="form-label">Mass (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="mass"
                    className="form-input"
                    value={formData.mass}
                    onChange={handleInputChange}
                  />
                  {formErrors.mass && <p className="text-red-500 text-sm mt-1">{formErrors.mass}</p>}
                </div>
                <div>
                  <label className="form-label">Orbital Period (days)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="orbital_period"
                    className="form-input"
                    value={formData.orbital_period}
                    onChange={handleInputChange}
                  />
                  {formErrors.orbital_period && <p className="text-red-500 text-sm mt-1">{formErrors.orbital_period}</p>}
                </div>
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  className="form-input"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              {formErrors.submit && <p className="text-red-500 text-sm">{formErrors.submit}</p>}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedPlanet(null);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Planet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPlanet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-space-200">
              <h3 className="text-lg font-semibold text-space-900">Delete Planet</h3>
            </div>
            <div className="p-6">
              <p className="text-space-600 mb-4">
                Are you sure you want to delete <strong>{selectedPlanet.name}</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedPlanet(null);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-danger"
                >
                  Delete Planet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
