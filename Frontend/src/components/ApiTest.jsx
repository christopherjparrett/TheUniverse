/**
 * API Test Component
 * Tests basic API connectivity
 */

import React, { useState } from 'react';
import { planetsAPI, authAPI } from '../api';

const ApiTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/health');
      const data = await response.json();
      setResults(prev => ({ ...prev, health: { success: true, data } }));
    } catch (error) {
      setResults(prev => ({ ...prev, health: { success: false, error: error.message } }));
    }
    setLoading(false);
  };

  const testPlanets = async () => {
    setLoading(true);
    try {
      const data = await planetsAPI.getAll();
      setResults(prev => ({ ...prev, planets: { success: true, data } }));
    } catch (error) {
      setResults(prev => ({ ...prev, planets: { success: false, error: error.message } }));
    }
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const data = await authAPI.login({ username: 'admin', password: 'admin123' });
      setResults(prev => ({ ...prev, login: { success: true, data } }));
    } catch (error) {
      setResults(prev => ({ ...prev, login: { success: false, error: error.message } }));
    }
    setLoading(false);
  };

  return (
    <div className="fixed top-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-md">
      <h3 className="text-sm font-medium text-gray-900 mb-3">API Tests</h3>
      
      <div className="space-y-2">
        <button
          onClick={testHealth}
          disabled={loading}
          className="w-full text-xs btn-secondary"
        >
          Test Health
        </button>
        
        <button
          onClick={testPlanets}
          disabled={loading}
          className="w-full text-xs btn-secondary"
        >
          Test Planets
        </button>
        
        <button
          onClick={testLogin}
          disabled={loading}
          className="w-full text-xs btn-primary"
        >
          Test Login
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {Object.entries(results).map(([key, result]) => (
          <div key={key} className="text-xs">
            <span className="font-medium">{key}:</span>
            <span className={`ml-1 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
              {result.success ? '✓' : '✗'}
            </span>
            {result.error && (
              <div className="text-red-500 text-xs mt-1">{result.error}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiTest;
