import type { Snippet } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';
export interface ThemeContextProps {
    themes: string[];
    forcedTheme?: string | undefined;
    setTheme: (theme: string) => void;
    theme?: string;
    resolvedTheme?: string | undefined;
    systemTheme?: 'dark' | 'light' | undefined;
}
interface ValueObject {
    [themeName: string]: string;
}
type DataAttribute = `data-${string}`;
interface ScriptProps extends NonNullable<SvelteHTMLElements['script']> {
    [dataAttribute: DataAttribute]: unknown;
}
export type Attribute = DataAttribute | 'class';
export interface ThemeProviderProps {
    themes?: string[];
    forcedTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    enableColorScheme?: boolean;
    storageKey?: string;
    defaultTheme?: string;
    attribute?: Attribute | Attribute[] | undefined;
    value?: ValueObject;
    nonce?: string;
    scriptProps?: ScriptProps;
    children: Snippet;
}
export {};
