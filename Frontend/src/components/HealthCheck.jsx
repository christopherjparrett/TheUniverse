/**
 * Health Check Component
 * Tests API connection and displays status
 */

import React, { useState, useEffect } from 'react';
import { healthAPI } from '../api';

const HealthCheck = () => {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      setStatus('checking');
      setError(null);
      const response = await healthAPI.check();
      console.log('Health check response:', response);
      setStatus('healthy');
    } catch (err) {
      console.error('Health check failed:', err);
      setError(err.message);
      setStatus('unhealthy');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">API Status</h3>
        <button
          onClick={checkHealth}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          status === 'healthy' ? 'bg-green-500' : 
          status === 'unhealthy' ? 'bg-red-500' : 
          'bg-yellow-500'
        }`}></div>
        <span className="text-xs text-gray-600">
          {status === 'healthy' ? 'Connected' : 
           status === 'unhealthy' ? 'Disconnected' : 
           'Checking...'}
        </span>
      </div>
      
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default HealthCheck;
