<script lang="ts">
  import type { ThemeProviderProps } from './types';

  const {
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
  }: Omit<ThemeProviderProps, 'children'> & { defaultTheme: string } = $props();
</script>

<svelte:head>
  {@html `<script${nonce ? ` nonce="${nonce}"` : ''}${
    scriptProps
      ? Object.entries(scriptProps)
          .map(([k, v]) => ` ${k}="${v}"`)
          .join('')
      : ''
  }>
    (function() {
      try {
        const forcedTheme = ${JSON.stringify(forcedTheme)};
        const storageKey = ${JSON.stringify(storageKey)};
        const enableSystem = ${enableSystem};
        const attribute = ${JSON.stringify(attribute)};
        const value = ${JSON.stringify(value)};
        const themes = ${JSON.stringify(themes)};
        const defaultTheme = ${JSON.stringify(defaultTheme)};
        const enableColorScheme = ${enableColorScheme};

        let theme;
        if (forcedTheme) {
          theme = forcedTheme;
        } else {
          theme = localStorage.getItem(storageKey) || defaultTheme;
          if (theme === 'system' && enableSystem) {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          }
        }
  
        const name = value ? value[theme] : theme;
        const d = document.documentElement;

        const handleAttribute = function(attr) {
          if (attr === 'class') {
            if (!value) {
              themes.forEach(function(t) { d.classList.remove(t); });
            } else {
              Object.values(value).forEach(function(cls) { d.classList.remove(cls); });
            }
            if (name) d.classList.add(name);
          } else if (attr && attr.startsWith('data-')) {
            if (name) {
              d.setAttribute(attr, name);
            } else {
              d.removeAttribute(attr);
            }
          }
        };

        if (Array.isArray(attribute)) {
          attribute.forEach(handleAttribute);
        } else {
          handleAttribute(attribute);
        }

        if (enableColorScheme) {
          const colorScheme = (theme === 'dark' || theme === 'light') ? theme : null;
          if (colorScheme) d.style.colorScheme = colorScheme;
        }

      } catch (e) {}
    })();
  </script>`}
</svelte:head>
