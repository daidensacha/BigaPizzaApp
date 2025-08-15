// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_BASE } from '@config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, email, role, avatarStyle, avatarSeed, token? }
  const [token, setToken] = useState(null); // keep separate so we can validate presence

  // Bootstrap from localStorage
  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (!raw) {
      setUser(null);
      setToken(null);
      delete axios.defaults.headers.common.Authorization;
      return;
    }
    try {
      const stored = JSON.parse(raw);
      if (stored?.token) {
        setUser(stored);
        setToken(stored.token);
        axios.defaults.headers.common.Authorization = `Bearer ${stored.token}`;
      } else {
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        delete axios.defaults.headers.common.Authorization;
      }
    } catch {
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
      delete axios.defaults.headers.common.Authorization;
    }
  }, []);

  // Login
  const login = (userData, tokenFromServer) => {
    const fullUser = { ...userData, token: tokenFromServer };
    setUser(fullUser);
    setToken(tokenFromServer);
    localStorage.setItem('user', JSON.stringify(fullUser));
    axios.defaults.headers.common.Authorization = `Bearer ${tokenFromServer}`;
    toast.success(`Welcome back, ${userData.name}!`);
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.warn('Logout API error (ignored):', err?.message || err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      delete axios.defaults.headers.common.Authorization;
      toast('Logged out');
    }
  };

  // ✅ Safely patch user & persist
  const updateUser = (patch) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...(patch || {}) };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  const isAuthenticated = useMemo(() => Boolean(user && token), [user, token]);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
