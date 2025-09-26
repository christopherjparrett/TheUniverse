/**
 * Auth Debug Component
 * Shows current authentication state for debugging
 */

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthDebug = () => {
  const { user, isAuthenticated, loading, isAdmin } = useAuth();

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Auth Debug</h3>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Loading:</span>
          <span className={loading ? 'text-yellow-600' : 'text-green-600'}>
            {loading ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Authenticated:</span>
          <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
            {isAuthenticated ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Username:</span>
          <span className="text-gray-900">{user?.username || 'None'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Is Admin:</span>
          <span className={isAdmin ? 'text-green-600' : 'text-red-600'}>
            {isAdmin ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Token:</span>
          <span className="text-gray-900">
            {localStorage.getItem('authToken') ? 'Present' : 'Missing'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;
