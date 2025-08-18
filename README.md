# sveltekit-themes

A port of [`next-themes`](https://github.com/pacocoursey/next-themes) for SvelteKit. Many thanks to [Paco Coursey](https://x.com/pacocoursey) for his work on the original library!

An abstraction for themes in your SvelteKit app.

- ✅ Perfect dark mode in 2 lines of code
- ✅ System setting with prefers-color-scheme
- ✅ Themed browser UI with color-scheme
- ✅ No flash on load (both SSR and SSG)
- ✅ Sync theme across tabs and windows
- ✅ Disable flashing when changing themes
- ✅ Force pages to specific themes
- ✅ Class or data attribute selector
- ✅ useTheme

## Installation

```bash
$ pnpm install sveltekit-themes
```

## Usage

Import the provider and wrap your layout.

```svelte
<script lang="ts">
  import { ThemeProvider } from 'sveltekit-themes';

  const { children } = $props();
</script>

<ThemeProvider attribute="class">
    {@render children()}
</ThemeProvider>
```

## HTML & CSS
That's it, your SvelteKit app fully supports dark mode, including System preference with prefers-color-scheme. The theme is also immediately synced between tabs. By default, sveltekit-themes modifies the data-theme attribute on the html element, which you can easily use to style your app:

```css
:root {
  /* Your default theme */
  --background: white;
  --foreground: black;
}

[data-theme='dark'] {
  --background: black;
  --foreground: white;
}
```

## useTheme

In your components, you can use the `useTheme` hook to access the current theme and methods to change it.

> Note: `sveltekit-themes` is built with runes, requiring that you are running v5.0.0 or later.

```svelte
<script lang="ts">
  import { useTheme } from '$lib';

  const theme = useTheme();
</script>

<select
    onchange={(e) => theme.set(e.currentTarget.value)}
    value={theme.current}
>
    <option value="light"> Light Theme </option>
    <option value="dark"> Dark Theme </option>
    <option value="system"> System Theme </option>
</select>
```

## API

Let's dig into the details.

### ThemeProvider

All your theme configuration is passed to ThemeProvider.

- `storageKey = 'theme'`: Key used to store theme setting in localStorage
- `defaultTheme = 'system'`: Default theme name (for v0.0.12 and lower the default was `light`). If `enableSystem` is false, the default theme is `light`
- `forcedTheme`: Forced theme name for the current page (does not modify saved theme settings)
- `enableSystem = true`: Whether to switch between `dark` and `light` based on `prefers-color-scheme`
- `enableColorScheme = true`: Whether to indicate to browsers which color scheme is used (dark or light) for built-in UI like inputs and buttons
- `disableTransitionOnChange = false`: Optionally disable all CSS transitions when switching themes.
- `themes = ['light', 'dark']`: List of theme names
- `attribute = 'data-theme'`: HTML attribute modified based on the active theme
  - accepts `class` and `data-*` (meaning any data attribute, `data-mode`, `data-color`, etc.).
- `value`: Optional mapping of theme name to attribute value
  - value is an `object` where key is the theme name and value is the attribute value.
- `nonce`: Optional nonce passed to the injected `script` tag, used to allow-list the next-themes script in your CSP
- `scriptProps`: Optional props to pass to the injected `script` tag.

### useTheme

useTheme takes no parameters, but returns all the methods and properties you need to manage themes in your components. In order to maintain Svelte's reactivity with runes, you should create an instance that is not desctructured.

```svelte
<script lang="ts">
  import { useTheme } from '$lib';

  const theme = useTheme();
</script>
```

`const theme = useTheme();` will have the following properties and methods:

- `current`: Active theme name.
- `set(name)`: Function to update the theme. Pass the new theme value or use a callback to set the new theme based on the current theme.
- `forcedTheme`: Forced page theme or falsy. If `forcedTheme` is set, you should disable any theme switching UI.
- `resolvedTheme`: If `enableSystem` is true and the active theme is "system", this returns whether the system preference resolved to "dark" or "light". Otherwise, identical to `theme`.
- `systemTheme`: If `enableSystem` is true, represents the System theme preference ("dark" or "light"), regardless what the active theme is.
- `themes`: The list of themes passed to `ThemeProvider` (with "system" appended, if `enableSystem` is true).

That's it. Once again, thank you to [Paco Coursey](https://x.com/pacocoursey) for his work on the original library, which made this port possible. If you have any issues or suggestions, feel free to open an issue or PR.