// const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
import { API_BASE } from '@config';
// DEFAULT OPTIONS
const defaultOptions = {
  credentials: 'include', // ⬅️ include cookies
  headers: {
    'Content-Type': 'application/json',
  },
};

// REGISTER USER
export const registerUser = async (userData) => {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    ...defaultOptions,
    method: 'POST',
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed.');
  return data;
};

// LOGIN USER
export const loginUser = async (userData) => {
  // console.log('API_BASE:', API_BASE); // 🔍 check value
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    ...defaultOptions,
    method: 'POST',
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed.');

  // ✅ Merge token into the user object
  return data;
  // return {
  //   ...data.user,
  //   token: data.token,
  // };
};

// LOGOUT USER
export const logoutUser = async () => {
  const res = await fetch(`${API_BASE}/api/auth/logout`, {
    ...defaultOptions,
    method: 'POST',
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Logout failed.');
  return data;
};

// CHECK SESSION
export const checkSession = async () => {
  const res = await fetch(`${API_BASE}/api/auth/check-session`, {
    ...defaultOptions,
    method: 'GET',
  });

  if (res.status === 401) return null; // not logged in
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Session check failed.');
  return data;
};
