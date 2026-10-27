import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RotaProtegida({ children, roleRequired }) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '16px',
        }}
      >
        <div
          className="spinner"
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #cbd5e1',
            borderTopColor: '#12849b',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <p style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
          Carregando informações...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (roleRequired === 'ADMIN') {
      return <Navigate to="/login-admin" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roleRequired === 'ADMIN' && !isAdmin) {
    return <Navigate to="/perfil" replace />;
  }

  return children;
}
