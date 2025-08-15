import { getContext } from 'svelte';
const THEME_CONTEXT_KEY = Symbol('theme');
export const useTheme = () => {
    const context = getContext(THEME_CONTEXT_KEY);
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
        set: context.setTheme,
    };
};
export { THEME_CONTEXT_KEY };
