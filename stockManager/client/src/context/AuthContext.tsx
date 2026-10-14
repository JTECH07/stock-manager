import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, UserPayload } from '../api';

interface AuthContextType {
  user: UserPayload | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isMagasinier: boolean;
  canModify: boolean; // ADMIN ou MANAGER
  canCreateOrDelete: boolean; // ADMIN
  canManageStockMovements: boolean; // ADMIN, MANAGER ou MAGASINIER
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredUser = (): UserPayload | null => {
  const saved = localStorage.getItem('stockmanager_user');
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    localStorage.removeItem('stockmanager_user');
    localStorage.removeItem('stockmanager_token');
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserPayload | null>(() => readStoredUser());
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
  const isMagasinier = user?.role === 'MAGASINIER';
  const canModify = isAdmin || isManager;
  const canCreateOrDelete = isAdmin;
  const canManageStockMovements = isAdmin || isManager || isMagasinier;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isAdmin,
        isManager,
        isMagasinier,
        canModify,
        canCreateOrDelete,
        canManageStockMovements,
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
