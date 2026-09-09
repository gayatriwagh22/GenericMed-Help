import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';
import { login as apiLogin, register as apiRegister } from '../api/auth';

const TOKEN_KEY = 'gmh_access_token';
const REFRESH_KEY = 'gmh_refresh_token';
const USER_KEY = 'gmh_user';

interface UseAuthReturn {
  user: UserProfile | null;
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (payload: { fullName: string; email: string; phone: string; password: string; role?: UserProfile['role'] }) => Promise<UserProfile>;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);

  const persist = (userData: UserProfile, access: string, refresh: string) => {
    setUser(userData);
    setAccessToken(access);
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  };

  const login = useCallback(async (email: string, password: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      const result = await apiLogin(email, password);
      const { user: u, accessToken: at, refreshToken: rt } = result.data;
      persist(u, at, rt);
      return u;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: { fullName: string; email: string; phone: string; password: string; role?: UserProfile['role'] }): Promise<UserProfile> => {
    setLoading(true);
    try {
      const result = await apiRegister(payload);
      const { user: u, accessToken: at, refreshToken: rt } = result.data;
      persist(u, at, rt);
      return u;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  return { user, accessToken, loading, login, register, logout };
}
