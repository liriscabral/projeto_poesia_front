import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { usuario, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute; 