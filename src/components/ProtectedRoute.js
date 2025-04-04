// ProtectedRoute.js
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './components/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, logout } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();  // Çıkış işlemi yapılır
    }
  }, [isAuthenticated, logout]);

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return children;
};

export default ProtectedRoute;
