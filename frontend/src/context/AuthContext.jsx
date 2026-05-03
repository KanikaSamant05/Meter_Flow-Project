import { createContext, useContext, useState, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mf_user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('mf_token'));

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user, token } = res.data.data;
    localStorage.setItem('mf_token', token);
    localStorage.setItem('mf_user', JSON.stringify(user));
    setUser(user);
    setToken(token);
    return user;
  }, []);

  const signup = useCallback(async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password });
    const { user, token } = res.data.data;
    localStorage.setItem('mf_token', token);
    localStorage.setItem('mf_user', JSON.stringify(user));
    setUser(user);
    setToken(token);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mf_token');
    localStorage.removeItem('mf_user');
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};