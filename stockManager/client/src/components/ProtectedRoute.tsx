import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'ADMIN' | 'MANAGER' | 'USER';
}

export const ProtectedRoute = ({ children, requireRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F8F9FA',
          color: '#64748B',
          fontSize: '1rem',
        }}
      >
        Vérification de la session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Hiérarchie des rôles : ADMIN > MANAGER > USER
  if (requireRole) {
    const hierarchy = { ADMIN: 3, MANAGER: 2, USER: 1 };
    const userLevel = hierarchy[user?.role as keyof typeof hierarchy] ?? 0;
    const requiredLevel = hierarchy[requireRole];

    if (userLevel < requiredLevel) {
      return (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: '#D90429', fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>
            Accès Refusé
          </h2>
          <p style={{ color: '#64748B', marginBottom: '6px' }}>
            Votre rôle actuel <strong>({user?.role})</strong> ne vous donne pas accès à cette section.
          </p>
          <p style={{ color: '#64748B' }}>
            Rôle requis : <strong>{requireRole}</strong>
          </p>
        </div>
      );
    }
  }

  return <>{children}</>;
};
