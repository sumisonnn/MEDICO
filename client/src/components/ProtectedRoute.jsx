import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If a specific role is required, check if user has that role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    if (userRole === 'admin') {
      return <Navigate to="/dashboard/admin" replace />;
    } else {
      return <Navigate to="/dashboard/user" replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute; 