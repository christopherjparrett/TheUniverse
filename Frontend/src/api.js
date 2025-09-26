/**
 * Centralized API client for Planets Universe
 * Handles JWT authentication, error handling, and API communication
 */

const API_BASE_URL = 'http://localhost:8000';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Get the stored JWT token from localStorage
   */
  getToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Store JWT token in localStorage
   */
  setToken(token) {
    localStorage.setItem('authToken', token);
  }

  /**
   * Remove JWT token from localStorage
   */
  removeToken() {
    localStorage.removeItem('authToken');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }

  /**
   * Handle 401 Unauthorized responses
   */
  handleUnauthorized() {
    this.removeToken();
    // Redirect to login page
    window.location.href = '/login';
  }

  /**
   * Make HTTP request with automatic JWT handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.handleUnauthorized();
        throw new Error('Unauthorized');
      }

      // Handle other HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle 204 No Content (for DELETE requests)
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();

// Authentication API methods
export const authAPI = {
  /**
   * Login with username and password
   */
  async login(credentials) {
    const response = await apiClient.post('/auth/login', credentials);
    apiClient.setToken(response.access_token);
    return response;
  },

  /**
   * Get current user information
   */
  async getCurrentUser() {
    return apiClient.get('/auth/me');
  },

  /**
   * Logout (remove token)
   */
  logout() {
    apiClient.removeToken();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return apiClient.isAuthenticated();
  }
};

// Planets API methods
export const planetsAPI = {
  /**
   * Get all planets
   */
  async getAll() {
    return apiClient.get('/planets');
  },

  /**
   * Get planet by ID
   */
  async getById(id) {
    return apiClient.get(`/planets/${id}`);
  },

  /**
   * Create new planet (requires authentication)
   */
  async create(planetData) {
    return apiClient.post('/planets', planetData);
  },

  /**
   * Update planet (requires authentication)
   */
  async update(id, planetData) {
    return apiClient.put(`/planets/${id}`, planetData);
  },

  /**
   * Delete planet (requires authentication)
   */
  async delete(id) {
    return apiClient.delete(`/planets/${id}`);
  }
};

// Health check API
export const healthAPI = {
  /**
   * Check API health
   */
  async check() {
    return apiClient.get('/health');
  }
};

export default apiClient;
