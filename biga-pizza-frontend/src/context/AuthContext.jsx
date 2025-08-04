import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
// AuthContext.jsx
import { API_BASE } from '@config'; // or wherever it's defined

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData, token) => {
    const fullUser = { ...userData, token };
    console.log('✅ login() called with:', fullUser);
    setUser(fullUser);
    localStorage.setItem('user', JSON.stringify(fullUser));
    toast.success(`Welcome back, ${userData.name}!`);
  };

  // const logout = () => {
  //   setUser(null);
  //   localStorage.removeItem('user');
  //   setUser(null);
  //   Navigate('/');
  //   toast.success('You have been logged out.');
  // };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/api/auth/logout`); // if needed
      setUser(null);
      localStorage.removeItem('authToken'); // optional
    } catch (err) {
      console.error('Error during logout:', err);
      throw err; // allow handling in the calling component
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
