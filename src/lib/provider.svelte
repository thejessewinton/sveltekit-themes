<script lang="ts">
  import { tick } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import ThemeScript from './script.svelte';
  import type { Attribute, ThemeProviderProps } from './types';
  import { useTheme } from './state.svelte';

  const MEDIA = '(prefers-color-scheme: dark)';
  const isDarkPreferred = new MediaQuery(MEDIA);
  const isServer = typeof window === 'undefined';

  const getTheme = (key: string, fallback?: string) => {
    if (isServer) return undefined;
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  };

  const disableAnimation = (nonce?: string) => {
    const css = document.createElement('style');
    if (nonce) css.setAttribute('nonce', nonce);
    css.appendChild(
      document.createTextNode(
        `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
      )
    );
    document.head.appendChild(css);

    return async () => {
      window.getComputedStyle(document.body);
      await tick();
      document.head.removeChild(css);
    };
  };

  const getSystemTheme = $derived(() =>
    isDarkPreferred.current ? 'dark' : 'light'
  );

  const colorSchemes = ['light', 'dark'];

  const saveToLS = (storageKey: string, value: string) => {
    try {
      localStorage.setItem(storageKey, value);
    } catch (e) {
      // Unsupported
    }
  };

  const {
    forcedTheme,
    disableTransitionOnChange = false,
    enableSystem = true,
    enableColorScheme = true,
    storageKey = 'theme',
    themes = enableSystem ? [...colorSchemes, 'system'] : colorSchemes,
    defaultTheme = enableSystem ? 'system' : 'light',
    attribute = 'data-theme',
    value,
    children,
    nonce,
    scriptProps,
  }: ThemeProviderProps = $props();

  let theme = useTheme(getTheme(storageKey, defaultTheme) || defaultTheme);
  const attrs = !value ? themes : Object.values(value);

  const applyTheme = (theme?: string) => {
    let resolved = theme;
    if (!resolved) return;

    if (theme === 'system' && enableSystem) {
      resolved = getSystemTheme();
    }

    const name = value ? value[resolved] : resolved;
    const enable = disableTransitionOnChange ? disableAnimation(nonce) : null;
    const d = document.documentElement;

    const handleAttribute = (attr: Attribute) => {
      if (attr === 'class') {
        d.classList.remove(...attrs);
        if (name) d.classList.add(name);
      } else if (attr.startsWith('data-')) {
        if (name) {
          d.setAttribute(attr, name);
        } else {
          d.removeAttribute(attr);
        }
      }
    };

    if (Array.isArray(attribute)) attribute.forEach(handleAttribute);
    else handleAttribute(attribute);

    if (enableColorScheme) {
      const fallback = colorSchemes.includes(defaultTheme)
        ? defaultTheme
        : null;
      const colorScheme = colorSchemes.includes(resolved) ? resolved : fallback;
      // @ts-ignore
      d.style.colorScheme = colorScheme;
    }

    enable?.();
  };

  $effect(() => {
    if (theme.current === 'system' && enableSystem && !forcedTheme) {
      applyTheme('system');
    }
  });

  $effect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return;
      }

      if (!e.newValue) {
        theme.set(defaultTheme);
      } else {
        theme.set(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => window.removeEventListener('storage', handleStorage);
  });

  $effect(() => {
    applyTheme(forcedTheme ?? theme.current);
  });
</script>

<ThemeScript
  {...{
    forcedTheme,
    storageKey,
    attribute,
    enableSystem,
    enableColorScheme,
    defaultTheme,
    value,
    themes,
    nonce,
    scriptProps,
  }}
/>

{@render children()}
