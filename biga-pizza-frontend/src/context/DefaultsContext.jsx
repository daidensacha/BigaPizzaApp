// src/context/DefaultsContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE } from '@config';
import { useAuth } from '@/context/AuthContext';

import {
  mapDoughDefaultsToForm,
  mapScheduleDefaultsToState,
} from '@/utils/mappers'; // backend ➜ UI
import {
  mapFormToDoughDefaults,
  mapStateToScheduleDefaults,
} from '@/utils/mappersInverse'; // UI ➜ backend

const DefaultsContext = createContext(undefined);

export function useDefaults() {
  const ctx = useContext(DefaultsContext);
  if (!ctx)
    throw new Error('useDefaults must be used within <DefaultsProvider>');
  return ctx;
}

export function DefaultsProvider({ children }) {
  const { isAuthenticated, token } = useAuth();

  // UI-shaped state
  const [defaults, setDefaults] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // LOAD
  useEffect(() => {
    let abort = false;

    async function load() {
      if (!isAuthenticated || !token) {
        setDefaults(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/user/defaults`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        const raw = res.data || {};
        const ui = {
          doughDefaults: mapDoughDefaultsToForm(raw.doughDefaults),
          scheduleDefaults: mapScheduleDefaultsToState(raw.scheduleDefaults),
        };
        if (!abort) setDefaults(ui);
      } catch (err) {
        if (err?.response?.status !== 401) {
          console.warn('[DefaultsContext] load error:', err?.message || err);
        }
        if (!abort) setDefaults(null);
      } finally {
        if (!abort) setLoading(false);
      }
    }

    load();
    return () => {
      abort = true;
    };
  }, [isAuthenticated, token]);

  // SAVE one section
  const save = async (section, uiPayload) => {
    if (!isAuthenticated || !token) return;
    setSaving(true);
    try {
      const body =
        section === 'doughDefaults'
          ? { doughDefaults: mapFormToDoughDefaults(uiPayload) }
          : { scheduleDefaults: mapStateToScheduleDefaults(uiPayload) };

      const res = await axios.put(`${API_BASE}/api/user/defaults`, body, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const raw = res.data || {};
      const ui = {
        doughDefaults: mapDoughDefaultsToForm(raw.doughDefaults),
        scheduleDefaults: mapScheduleDefaultsToState(raw.scheduleDefaults),
      };
      setDefaults(ui);
      return ui;
    } finally {
      setSaving(false);
    }
  };

  // RESET to server system defaults
  const reset = async () => {
    if (!isAuthenticated || !token) return;
    setSaving(true);
    try {
      const res = await axios.post(
        `${API_BASE}/api/user/defaults/reset`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      console.log('[DefaultsContext.reset] raw response:', res.data);
      const raw = res.data || {};
      const ui = {
        doughDefaults: mapDoughDefaultsToForm(raw.doughDefaults),
        scheduleDefaults: mapScheduleDefaultsToState(raw.scheduleDefaults),
      };
      setDefaults(ui);
      return ui;
    } finally {
      setSaving(false);
    }
  };

  return (
    <DefaultsContext.Provider
      value={{ defaults, loading, save, reset, saving }}
    >
      {children}
    </DefaultsContext.Provider>
  );
}
