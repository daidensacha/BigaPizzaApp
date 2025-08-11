import { useAuth } from '@/context/AuthContext';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

const DefaultsContext = createContext(null);
export const useDefaults = () => useContext(DefaultsContext);

export function DefaultsProvider({ children }) {
  const { user } = useAuth(); // assumes user?.token is set at login
  const token = user?.token;

  const [defaults, setDefaults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('[DefaultsContext] GET /api/user/defaults… token?', !!token);
      const res = await fetch('/api/user/defaults', {
        credentials: 'include', // send cookie if present
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      console.log('[DefaultsContext] status:', res.status);

      // Safely parse JSON (handles empty or non-JSON bodies)
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (parseErr) {
        console.warn(
          '[DefaultsContext] JSON parse failed, raw text length:',
          text?.length ?? 0
        );
        data = null;
      }

      if (!res.ok) {
        const msg = (data && data.error) || `GET defaults ${res.status}`;
        throw new Error(msg);
      }

      console.log(
        '[DefaultsContext] received keys:',
        data ? Object.keys(data) : []
      );
      setDefaults(data);
    } catch (e) {
      console.error('[DefaultsContext] load error:', e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Kick off initial load, and re-run if token changes (login/logout)
  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (part, patch) => {
      setSaving(true);
      try {
        const res = await fetch('/api/user/defaults', {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ [part]: patch }),
        });
        const text = await res.text();
        let data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {}

        if (!res.ok) {
          const msg = (data && data.error) || `PUT defaults ${res.status}`;
          throw new Error(msg);
        }

        console.log('[DefaultsContext] saved part:', part);
        setDefaults(data);
        return data;
      } finally {
        setSaving(false);
      }
    },
    [token]
  );

  return (
    <DefaultsContext.Provider
      value={{ defaults, loading, error, saving, reload: load, save }}
    >
      {children}
    </DefaultsContext.Provider>
  );
}
