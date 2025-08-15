// src/context/DefaultsContext.jsx
import axios from 'axios';
import { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE } from '@config'; // e.g. http://localhost:5000
import { useAuth } from '@/context/AuthContext';

const DefaultsContext = createContext();
export const useDefaults = () => useContext(DefaultsContext);

export function DefaultsProvider({ children }) {
  const { isAuthenticated, token } = useAuth();
  const [defaults, setDefaults] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let abort = false;

    async function load() {
      // 🚫 Don’t fetch when logged out
      if (!isAuthenticated || !token) {
        setDefaults(null);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE}/api/user/defaults`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true, // if your API also uses cookies
        });
        if (!abort) setDefaults(res.data);
      } catch (err) {
        // Only warn for non-401 errors to avoid noise on token expiry edge cases
        if (err?.response?.status !== 401) {
          console.warn('[DefaultsContext] load error:', err?.message || err);
        }
        if (!abort) setDefaults(null);
      }
    }

    load();
    return () => {
      abort = true;
    };
  }, [isAuthenticated, token]);

  // example save helper
  const save = async (section, payload) => {
    if (!isAuthenticated || !token) return;
    setSaving(true);
    try {
      const res = await axios.post(
        `${API_BASE}/api/user/defaults/${section}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setDefaults((prev) => ({
        ...(prev || {}),
        [section]: res.data[section],
      }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <DefaultsContext.Provider value={{ defaults, save, saving }}>
      {children}
    </DefaultsContext.Provider>
  );
}

// import { useAuth } from '@/context/AuthContext';
// import {
//   createContext,
//   useContext,
//   useState,
//   useCallback,
//   useEffect,
// } from 'react';

// const DefaultsContext = createContext(null);
// export const useDefaults = () => useContext(DefaultsContext);

// export function DefaultsProvider({ children }) {
//   const { user } = useAuth(); // assumes user?.token is set at login
//   const token = user?.token;

//   const [defaults, setDefaults] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [saving, setSaving] = useState(false);

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch('/api/user/defaults', {
//         credentials: 'include', // send cookie if present
//         headers: token ? { Authorization: `Bearer ${token}` } : undefined,
//       });

//       // Safely parse JSON (handles empty or non-JSON bodies)
//       const text = await res.text();
//       let data = null;
//       try {
//         data = text ? JSON.parse(text) : null;
//       } catch (parseErr) {
//         console.warn(
//           '[DefaultsContext] JSON parse failed, raw text length:',
//           text?.length ?? 0
//         );
//         data = null;
//       }

//       if (!res.ok) {
//         const msg = (data && data.error) || `GET defaults ${res.status}`;
//         throw new Error(msg);
//       }

//       setDefaults(data);
//     } catch (e) {
//       console.error('[DefaultsContext] load error:', e);
//       setError(e);
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);

//   // Kick off initial load, and re-run if token changes (login/logout)
//   useEffect(() => {
//     load();
//   }, [load]);

//   const save = useCallback(
//     async (part, patch) => {
//       setSaving(true);
//       try {
//         const res = await fetch('/api/user/defaults', {
//           method: 'PUT',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//           body: JSON.stringify({ [part]: patch }),
//         });
//         const text = await res.text();
//         let data = null;
//         try {
//           data = text ? JSON.parse(text) : null;
//         } catch {}

//         if (!res.ok) {
//           const msg = (data && data.error) || `PUT defaults ${res.status}`;
//           throw new Error(msg);
//         }

//         console.log('[DefaultsContext] saved part:', part);
//         setDefaults(data);
//         return data;
//       } finally {
//         setSaving(false);
//       }
//     },
//     [token]
//   );

//   return (
//     <DefaultsContext.Provider
//       value={{ defaults, loading, error, saving, reload: load, save }}
//     >
//       {children}
//     </DefaultsContext.Provider>
//   );
// }
