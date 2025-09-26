/**
 * Access Denied Component
 * Shows when non-admin users try to access admin features
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AccessDenied = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-900 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Icon */}
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Message */}
          <h2 className="text-2xl font-bold text-space-900 mb-4">
            Access Denied
          </h2>
          <p className="text-space-600 mb-6">
            Sorry, <span className="font-medium">{user?.username}</span>. You don't have permission to access the admin panel.
          </p>
          <p className="text-sm text-space-500 mb-8">
            Only administrators can manage planets and access admin features.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              to="/planets"
              className="w-full btn-primary block text-center"
            >
              Go to Planets Directory
            </Link>
            <Link
              to="/login"
              className="w-full btn-secondary block text-center"
            >
              Switch Account
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-space-50 rounded-lg">
            <p className="text-xs text-space-600">
              <strong>Need admin access?</strong> Contact your system administrator or try logging in with an admin account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
