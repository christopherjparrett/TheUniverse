/**
 * Logout Button Component
 * Provides logout functionality with confirmation dialog
 */

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LogoutButton = ({ variant = 'text', showConfirmation = true }) => {
  const { user, logout } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleLogoutClick = () => {
    if (showConfirmation) {
      setShowConfirmDialog(true);
    } else {
      logout();
    }
  };

  const handleConfirmLogout = () => {
    logout();
    setShowConfirmDialog(false);
  };

  const handleCancelLogout = () => {
    setShowConfirmDialog(false);
  };

  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'danger':
        return 'btn-danger';
      default:
        return 'text-space-300 hover:text-white transition-colors text-sm';
    }
  };

  return (
    <>
      <button
        onClick={handleLogoutClick}
        className={`${getButtonStyles()} flex items-center space-x-2`}
        title={`Logout ${user?.username}`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Logout</span>
      </button>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-space-200">
              <h3 className="text-lg font-semibold text-space-900">Confirm Logout</h3>
            </div>
            <div className="p-6">
              <p className="text-space-600 mb-4">
                Are you sure you want to logout? You'll need to sign in again to access the admin features.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelLogout}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="btn-danger"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;
