// src/components/auth/AuthModal.jsx
import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';
// import axios from 'axios';

import { useAuth } from '@context/AuthContext';
import { registerUser, loginUser } from '@services/authService';
// import { API_BASE } from '@config';
import { requestPasswordReset } from '@services/authService';

export default function AuthModal({ isOpen, onClose }) {
  // "auth" shows the Login/Register accordions, "forgot" shows the one-field reset form
  const [view, setView] = useState('auth'); // 'auth' | 'forgot'
  const [activeDisclosure, setActiveDisclosure] = useState('login'); // which accordion is open when in 'auth' view

  // login/register state
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();

  useEffect(() => {
    if (isOpen) {
      // reset modal state each time it opens
      setView('auth');
      setActiveDisclosure('login');
      setLoginData({ email: '', password: '' });
      setRegisterData({ name: '', email: '', password: '' });
      setForgotEmail('');
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = await loginUser(loginData);
      toast.success('Login successful!');
      login(data.user, data.token);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const data = await registerUser(registerData);
      toast.success('Registration successful!');
      login(data.user, data.token);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    const email = forgotEmail.trim() || loginData.email.trim();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    try {
      setSubmitting(true);
      // await axios.post(`${API_BASE}/api/auth/forgot-password`, { email });
      await requestPasswordReset(email);
      toast.success('Reset link sent. Check your email.');
      // go back to login view with the email prefilled
      setView('auth');
      setActiveDisclosure('login');
      setLoginData((prev) => ({ ...prev, email }));
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to send reset email';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-stone-800 dark:text-white">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Welcome to Biga Pizza
          </Dialog.Title>

          {/* ===== View: AUTH (Login & Register accordions) ===== */}
          {view === 'auth' && (
            <div className="space-y-4">
              {/* Login Accordion */}
              <div>
                <button
                  onClick={() =>
                    setActiveDisclosure((v) => (v === 'login' ? null : 'login'))
                  }
                  className={`w-full text-left font-medium px-4 py-2 rounded-lg transition
                    ${
                      activeDisclosure === 'login'
                        ? 'bg-gray-400 dark:bg-orange-800 text-white shadow-sm'
                        : 'bg-gray-200 dark:bg-orange-900 hover:bg-gray-300 dark:hover:bg-orange-800'
                    }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="transition-transform">
                      {activeDisclosure === 'login' ? '−' : '+'}
                    </span>
                    Login
                  </span>
                </button>

                {activeDisclosure === 'login' && (
                  <div className="p-4 pt-2 space-y-3">
                    <form onSubmit={handleLogin} className="space-y-3">
                      <input
                        type="email"
                        placeholder="Email"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-md bg-white dark:bg-stone-700 dark:border-stone-600"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md bg-white dark:bg-stone-700 dark:border-stone-600"
                      />

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-2 rounded-md"
                      >
                        {submitting ? 'Logging in…' : 'Login'}
                      </button>

                      {/* Link-style control: switches to forgot view */}
                      <div className="text-right mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setView('forgot');
                            setForgotEmail(loginData.email);
                          }}
                          className="text-sm text-emerald-600 hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Register Accordion */}
              <div>
                <button
                  onClick={() =>
                    setActiveDisclosure((v) =>
                      v === 'register' ? null : 'register'
                    )
                  }
                  className={`w-full text-left font-medium px-4 py-2 rounded-lg transition
                    ${
                      activeDisclosure === 'register'
                        ? 'bg-gray-400 dark:bg-orange-800 text-white shadow-sm'
                        : 'bg-gray-200 dark:bg-orange-900 hover:bg-gray-300 dark:hover:bg-orange-800'
                    }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="transition-transform">
                      {activeDisclosure === 'register' ? '−' : '+'}
                    </span>
                    Register
                  </span>
                </button>

                {activeDisclosure === 'register' && (
                  <div className="p-4 pt-2 space-y-3">
                    <form onSubmit={handleRegister} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Name"
                        value={registerData.name}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md bg-white dark:bg-stone-700 dark:border-stone-600"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md bg-white dark:bg-stone-700 dark:border-stone-600"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md bg-white dark:bg-stone-700 dark:border-stone-600"
                      />

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-2 rounded-md"
                      >
                        {submitting ? 'Registering…' : 'Register'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== View: FORGOT (single-field form) ===== */}
          {view === 'forgot' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Reset your password</h3>
              <p className="text-sm text-stone-600 dark:text-stone-300">
                Enter the email you used to create your account. We’ll send a
                reset link.
              </p>
              <form onSubmit={handleForgot} className="space-y-3">
                <input
                  autoFocus
                  type="email"
                  placeholder="Email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-stone-700 dark:border-stone-600"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setView('auth')}
                    className="px-3 py-2 rounded-md border border-stone-300 dark:border-stone-600 hover:bg-stone-100 dark:hover:bg-stone-700"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="ml-auto px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white"
                  >
                    {submitting ? 'Sending…' : 'Send reset link'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
