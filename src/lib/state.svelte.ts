import { MediaQuery } from 'svelte/reactivity';
import type { ThemeProviderProps } from './types';

const isServer = typeof window === 'undefined';
const MEDIA = '(prefers-color-scheme: dark)';
const isDarkPreferred = new MediaQuery(MEDIA);

export const useTheme = (storageKey: string, defaultTheme?: string) => {
  const getSystemTheme = $derived(() =>
    isDarkPreferred.current ? 'dark' : 'light'
  );

  const getTheme = (key: string, fallback?: string) => {
    if (isServer) return undefined;
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  };

  let theme = $state(getTheme(storageKey, defaultTheme));
  let resolvedTheme = $derived(theme === 'system' ? getSystemTheme() : theme);

  const saveToLS = (key: string, value: string) => {
    if (isServer) return;
    try {
      localStorage.setItem(key, value);
    } catch {}
  };

  const update = (value: string | ((current?: string) => string)) => {
    if (typeof value === 'function') {
      const newTheme = value(theme);
      theme = newTheme;
      saveToLS(storageKey, newTheme);
    } else {
      theme = value;
      saveToLS(storageKey, value);
    }
  };

  $effect(() => {
    if (isServer) return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      theme = e.newValue || defaultTheme;
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  });

  return {
    get current() {
      return theme;
    },
    get resolved() {
      return resolvedTheme;
    },
    set: update,
  };
};
