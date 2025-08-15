import { MediaQuery } from 'svelte/reactivity';
const isBrowser = typeof window !== 'undefined';
const MEDIA = '(prefers-color-scheme: dark)';
const isDarkPreferred = new MediaQuery(MEDIA);
export const useTheme = (storageKey = 'theme', defaultTheme) => {
    const getSystemTheme = () => (isDarkPreferred.current ? 'dark' : 'light');
    const getInitialTheme = () => {
        if (!isBrowser)
            return defaultTheme;
        try {
            return localStorage.getItem(storageKey) || defaultTheme;
        }
        catch {
            return defaultTheme;
        }
    };
    let theme = $state(getInitialTheme());
    let resolvedTheme = $derived(theme === 'system' ? getSystemTheme() : theme);
    const saveToLS = (key, value) => {
        if (!isBrowser)
            return;
        try {
            localStorage.setItem(key, value);
        }
        catch { }
    };
    const update = (value) => {
        if (typeof value === 'function') {
            const newTheme = value(theme);
            theme = newTheme;
            saveToLS(storageKey, newTheme);
        }
        else {
            theme = value;
            saveToLS(storageKey, value);
        }
    };
    $effect(() => {
        if (!isBrowser)
            return;
        const handleStorage = (e) => {
            if (e.key !== storageKey)
                return;
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
