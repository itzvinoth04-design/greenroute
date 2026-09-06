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

const DEMO_USERS: Record<string, User> = {
  'alex@greenroute.eco': {
    id: 'demo-alex',
    name: 'Alex Green',
    email: 'alex@greenroute.eco',
    city: 'Chennai',
    preferredTransport: 'Metro',
    role: 'user',
    points: 450,
    stats: {
      totalTrips: 18,
      totalRedemptions: 2,
      totalCarbonSavedKg: 42.6,
      totalDistanceKm: 230.5,
    },
  },
  'admin@greenroute.eco': {
    id: 'demo-admin',
    name: 'Sustainability Officer',
    email: 'admin@greenroute.eco',
    city: 'Chennai',
    preferredTransport: 'EV',
    role: 'admin',
    points: 1200,
    stats: {
      totalTrips: 45,
      totalRedemptions: 5,
      totalCarbonSavedKg: 115.4,
      totalDistanceKm: 680.0,
    },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('greenroute_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('greenroute_token'));
  const [loading, setLoading] = useState<boolean>(false);

  const refreshUser = async () => {
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const res = await api.auth.getProfile();
      if (res.data?.success) {
        setUser(res.data.user);
        localStorage.setItem('greenroute_user', JSON.stringify(res.data.user));
      }
    } catch {
      // Retain local session if token is demo
      const saved = localStorage.getItem('greenroute_user');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const res = await api.auth.login({ email: normalizedEmail, password });
      if (res.data?.success) {
        const newToken = res.data.token;
        localStorage.setItem('greenroute_token', newToken);
        localStorage.setItem('greenroute_user', JSON.stringify(res.data.user));
        setToken(newToken);
        setUser(res.data.user);
        return;
      }
    } catch (err: any) {
      console.warn('API authentication unavailable. Checking demo and local fallback accounts...');
    }

    // Resilient Demo / Local fallback
    const demoUser = DEMO_USERS[normalizedEmail] || {
      id: `local-${Date.now()}`,
      name: normalizedEmail.split('@')[0],
      email: normalizedEmail,
      city: 'Chennai',
      preferredTransport: 'Metro',
      role: normalizedEmail.includes('admin') ? 'admin' : 'user',
      points: 100,
      stats: {
        totalTrips: 3,
        totalRedemptions: 0,
        totalCarbonSavedKg: 7.2,
        totalDistanceKm: 38.0,
      },
    };

    const mockToken = `demo_jwt_${Date.now()}`;
    localStorage.setItem('greenroute_token', mockToken);
    localStorage.setItem('greenroute_user', JSON.stringify(demoUser));
    setToken(mockToken);
    setUser(demoUser);
  };

  const googleLogin = async (email: string, name?: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const res = await api.auth.googleLogin({ email: normalizedEmail, name });
      if (res.data?.success) {
        const newToken = res.data.token;
        localStorage.setItem('greenroute_token', newToken);
        localStorage.setItem('greenroute_user', JSON.stringify(res.data.user));
        setToken(newToken);
        setUser(res.data.user);
        return;
      }
    } catch {
      console.warn('Google API unavailable, using demo Google commuter.');
    }

    const googleUser: User = {
      id: 'demo-google-user',
      name: name || 'Google Eco Commuter',
      email: normalizedEmail,
      city: 'Chennai',
      preferredTransport: 'Bicycle',
      role: 'user',
      points: 200,
      stats: {
        totalTrips: 8,
        totalRedemptions: 1,
        totalCarbonSavedKg: 19.4,
        totalDistanceKm: 98.0,
      },
    };

    const mockToken = `demo_google_jwt_${Date.now()}`;
    localStorage.setItem('greenroute_token', mockToken);
    localStorage.setItem('greenroute_user', JSON.stringify(googleUser));
    setToken(mockToken);
    setUser(googleUser);
  };

  const register = async (data: any) => {
    try {
      const res = await api.auth.register(data);
      if (res.data?.success) {
        const newToken = res.data.token;
        localStorage.setItem('greenroute_token', newToken);
        localStorage.setItem('greenroute_user', JSON.stringify(res.data.user));
        setToken(newToken);
        setUser(res.data.user);
        return;
      }
    } catch {
      console.warn('Backend unavailable, creating local profile with 50 bonus points.');
    }

    const newUser: User = {
      id: `local-${Date.now()}`,
      name: data.name,
      email: data.email,
      city: data.city || 'Chennai',
      preferredTransport: data.preferredTransport || 'Metro',
      role: 'user',
      points: 50, // Welcome bonus
      stats: {
        totalTrips: 0,
        totalRedemptions: 0,
        totalCarbonSavedKg: 0,
        totalDistanceKm: 0,
      },
    };

    const mockToken = `demo_reg_jwt_${Date.now()}`;
    localStorage.setItem('greenroute_token', mockToken);
    localStorage.setItem('greenroute_user', JSON.stringify(newUser));
    setToken(mockToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('greenroute_token');
    localStorage.removeItem('greenroute_user');
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
