import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, UserPayload } from '../api';

interface AuthContextType {
  user: UserPayload | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  canModify: boolean; // ADMIN ou MANAGER
  canCreateOrDelete: boolean; // ADMIN
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserPayload | null>(() => {
    const saved = localStorage.getItem('stockmanager_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('stockmanager_token');
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      api.auth
        .getProfile()
        .then((profile) => {
          setUser(profile);
          localStorage.setItem('stockmanager_user', JSON.stringify(profile));
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    const handleUnauthorized = () => logout();
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [token]);

  const login = async (email: string, pass: string) => {
    const data = await api.auth.login(email, pass);
    localStorage.setItem('stockmanager_token', data.accessToken);
    localStorage.setItem('stockmanager_user', JSON.stringify(data.user));
    setToken(data.accessToken);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('stockmanager_token');
    localStorage.removeItem('stockmanager_user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isManager = user?.role === 'MANAGER';
  const canModify = isAdmin || isManager;
  const canCreateOrDelete = isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isAdmin,
        isManager,
        canModify,
        canCreateOrDelete,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé au sein de AuthProvider');
  }
  return context;
};

