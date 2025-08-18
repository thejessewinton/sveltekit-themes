import { getContext } from 'svelte';
import type { ThemeContextProps } from './types';

const THEME_CONTEXT_KEY = Symbol('theme');

export const useTheme = () => {
  const context = getContext<ThemeContextProps>(THEME_CONTEXT_KEY);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return {
    get current() {
      return context.theme;
    },
    get resolved() {
      return context.resolvedTheme;
    },
    themes: context.themes,
    forcedTheme: context.forcedTheme,
    systemTheme: context.systemTheme,
    set: context.setTheme,
  };
};

export { THEME_CONTEXT_KEY };
