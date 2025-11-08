import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return <Navigate to="/login" replace />;
    }
  } catch {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
