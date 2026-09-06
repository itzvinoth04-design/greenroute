import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (email: string, name?: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('greenroute_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const res = await api.auth.getProfile();
      if (res.data?.success) {
        setUser(res.data.user);
      }
    } catch {
      localStorage.removeItem('greenroute_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login({ email, password });
    if (res.data?.success) {
      const newToken = res.data.token;
      localStorage.setItem('greenroute_token', newToken);
      setToken(newToken);
      setUser(res.data.user);
    }
  };

  const googleLogin = async (email: string, name?: string) => {
    const res = await api.auth.googleLogin({ email, name });
    if (res.data?.success) {
      const newToken = res.data.token;
      localStorage.setItem('greenroute_token', newToken);
      setToken(newToken);
      setUser(res.data.user);
    }
  };

  const register = async (data: any) => {
    const res = await api.auth.register(data);
    if (res.data?.success) {
      const newToken = res.data.token;
      localStorage.setItem('greenroute_token', newToken);
      setToken(newToken);
      setUser(res.data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('greenroute_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, googleLogin, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
