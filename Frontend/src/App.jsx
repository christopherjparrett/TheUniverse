/**
 * Main App Component
 * Sets up routing and authentication context
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import AccessDenied from './components/AccessDenied';
import HealthCheck from './components/HealthCheck';
import ApiTest from './components/ApiTest';
import AuthDebug from './components/AuthDebug';
import Login from './pages/Login';
import Planets from './pages/Planets';
import PlanetDetail from './pages/PlanetDetail';
import AdminPanel from './pages/AdminPanel';

// Component to handle initial route redirect
const AppRoutes = () => {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-space-900">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-space-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/planets" replace /> : <Login />
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/planets" 
          element={
            isAuthenticated ? <Planets /> : <Navigate to="/login" state={{ from: { pathname: '/planets' } }} replace />
          } 
        />
        
        <Route 
          path="/planets/:id" 
          element={
            isAuthenticated ? <PlanetDetail /> : <Navigate to="/login" state={{ from: { pathname: '/planets' } }} replace />
          } 
        />
        
        <Route 
          path="/admin" 
          element={
            isAuthenticated ? (isAdmin ? <AdminPanel /> : <AccessDenied />) : <Navigate to="/login" state={{ from: { pathname: '/admin' } }} replace />
          } 
        />
        
        {/* Default redirect */}
        <Route 
          path="/" 
          element={<Navigate to="/planets" replace />} 
        />
        
        {/* Catch all - redirect to planets */}
        <Route 
          path="*" 
          element={<Navigate to="/planets" replace />} 
        />
      </Routes>
      {/* Debug Components - Hidden but kept for future debugging */}
      {/* <HealthCheck /> */}
      {/* <ApiTest /> */}
      {/* <AuthDebug /> */}
    </>
  );
};

// Main App component
const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
