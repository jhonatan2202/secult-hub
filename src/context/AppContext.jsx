import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initialState } from '../data/mockData';
import { api } from '../services/api';

const STORAGE_KEY = 'secult-app-state-v1';
const USERS_KEY = 'secult-users-v1';
const CURRENT_USER_KEY = 'secult-current-user-v1';
const THEME_KEY = 'secult-theme-v1';
const AUTH_TOKEN_KEY = 'secult-auth-token-v1';

const AppContext = createContext();

function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';

  const stored = readStorage(THEME_KEY, null);
  if (stored) return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function AppProvider({ children }) {
  const [state, setState] = useState(() => readStorage(STORAGE_KEY, initialState));
  const [users, setUsers] = useState(() =>
    readStorage(USERS_KEY, [
      {
        id: 1,
        name: 'Coordenador',
        email: 'coord@secult.com',
        role: 'Coordenador'
      }
    ])
  );
  const [currentUser, setCurrentUser] = useState(() => readStorage(CURRENT_USER_KEY, null));
  const [authToken, setAuthToken] = useState(() => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  });
  const [theme, setTheme] = useState(getInitialTheme);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    writeStorage(STORAGE_KEY, state);
  }, [state]);

  useEffect(() => {
    writeStorage(USERS_KEY, users);
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      writeStorage(CURRENT_USER_KEY, currentUser);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    if (authToken) {
      writeStorage(AUTH_TOKEN_KEY, authToken);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [authToken]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    writeStorage(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (!authToken) return;

    const loadDashboard = async () => {
      setIsLoading(true);
      try {
        const data = await api.get('/dashboard');
        setState(data);
        setCurrentUser(data.currentUser || currentUser);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [authToken]);

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      setAuthToken(data.token);
      setCurrentUser(data.user);
      setError('');
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const registerUser = async ({ name, email, password }) => {
    try {
      const data = await api.post('/auth/register', { name, email, password });
      setAuthToken(data.token);
      setCurrentUser(data.user);
      setError('');
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    setError('');
  };

  const updateProfile = async (updates) => {
    try {
      const updatedUser = await api.patch('/profile', updates);
      setCurrentUser(updatedUser);
      setUsers((list) => list.map((user) => (user.id === updatedUser.id ? { ...user, ...updates } : user)));
      setError('');
      return { success: true, user: updatedUser };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const requestReposition = async (itemId) => {
    try {
      const nextInventory = await api.post('/inventory/request', { itemId });
      setState((prev) => ({ ...prev, inventory: nextInventory }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const addOccurrence = async (payload) => {
    try {
      const newOccurrence = await api.post('/occurrences', payload);
      setState((prev) => ({
        ...prev,
        occurrences: [newOccurrence, ...prev.occurrences]
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const addDocument = async (payload) => {
    try {
      const newDocument = await api.post('/documents', payload);
      setState((prev) => ({
        ...prev,
        documents: [newDocument, ...prev.documents]
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const addPresence = async (payload) => {
    try {
      const newPresence = await api.post('/presences', payload);
      setState((prev) => ({
        ...prev,
        presences: [newPresence, ...prev.presences]
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const value = useMemo(
    () => ({
      state,
      currentUser,
      users,
      theme,
      isLoading,
      error,
      setTheme,
      toggleTheme,
      login,
      logout,
      registerUser,
      updateProfile,
      requestReposition,
      addOccurrence,
      addDocument,
      addPresence
    }),
    [state, currentUser, users, theme, isLoading, error]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}