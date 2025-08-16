import axios from 'axios';
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
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    ...defaultOptions,
    method: 'POST',
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed.');

  // ✅ Merge token into the user object
  return data;
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

// FORGOT / RESET PASSWORD
export async function requestPasswordReset(email) {
  const { data } = await axios.post(`${API_BASE}/api/auth/forgot-password`, {
    email,
  });
  return data; // { message: 'If that account exists, an email has been sent.' }
}

export async function resetPassword({ email, token, newPassword }) {
  const { data } = await axios.post(`${API_BASE}/api/auth/reset-password`, {
    email,
    token,
    newPassword,
  });
  return data; // { message: 'Password reset successful. Please log in.' }
}
