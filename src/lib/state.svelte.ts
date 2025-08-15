import { MediaQuery } from 'svelte/reactivity';

const isBrowser = typeof window !== 'undefined';
const MEDIA = '(prefers-color-scheme: dark)';
const isDarkPreferred = new MediaQuery(MEDIA);

export const useTheme = (storageKey = 'theme', defaultTheme?: string) => {
  const getSystemTheme = () => (isDarkPreferred.current ? 'dark' : 'light');

  const getInitialTheme = () => {
    if (!isBrowser) return defaultTheme;
    try {
      return localStorage.getItem(storageKey) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  };

  let theme = $state<string | undefined>(getInitialTheme());
  let resolvedTheme = $derived(theme === 'system' ? getSystemTheme() : theme);

  const saveToLS = (key: string, value: string) => {
    if (!isBrowser) return;
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
    if (!isBrowser) return;

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
