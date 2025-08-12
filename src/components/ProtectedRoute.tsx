import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    // If user is not authenticated, redirect to the homepage
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the child route
  return <Outlet />;
};

export default ProtectedRoute;
