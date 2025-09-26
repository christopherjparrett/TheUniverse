/**
 * Navigation Component
 * Provides navigation bar with user info and logout functionality
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LogoutButton from './LogoutButton';

const Navigation = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <nav className="bg-space-800/50 backdrop-blur-sm border-b border-space-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/planets" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg">Planets Universe</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/planets"
              className="text-space-300 hover:text-white transition-colors"
            >
              Planets
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-space-300 hover:text-white transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm text-space-300">
              Welcome, <span className="text-white font-medium">{user?.username}</span>
            </div>
            <LogoutButton variant="text" showConfirmation={true} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
