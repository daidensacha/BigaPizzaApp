import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { registerUser, loginUser } from '../../services/authService';

export default function AuthModal({ isOpen, onClose }) {
  const [activeDisclosure, setActiveDisclosure] = useState('login');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { login, register } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(loginData);
      toast.success('Login successful!');
      console.log('Logged in user:', data);
      login(data.user, data.token); // updates context
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(registerData);
      toast.success('Registration successful!');
      console.log('Registered user:', data);
      login(data.user, data.token); // updates context
      onClose();
    } catch (error) {
      toast.error(error.message);
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

          <div className="space-y-4">
            {/* Login Accordion */}
            <div>
              <button
                onClick={() =>
                  setActiveDisclosure(
                    activeDisclosure === 'login' ? null : 'login'
                  )
                }
                className="w-full text-left font-medium px-4 py-2 rounded-lg bg-gray-100 dark:bg-stone-700 hover:bg-gray-200 dark:hover:bg-stone-600 transition"
              >
                {activeDisclosure === 'login' ? '−' : '+'} Login
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
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-stone-700 dark:border-stone-600"
                    />
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                    >
                      Login
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Register Accordion */}
            <div>
              <button
                onClick={() =>
                  setActiveDisclosure(
                    activeDisclosure === 'register' ? null : 'register'
                  )
                }
                className="w-full text-left font-medium px-4 py-2 rounded-lg bg-gray-100 dark:bg-stone-700 hover:bg-gray-200 dark:hover:bg-stone-600 transition"
              >
                {activeDisclosure === 'register' ? '−' : '+'} Register
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
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
                    >
                      Register
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
