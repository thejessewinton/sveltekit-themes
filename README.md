# sveltekit-themes

A port of `next-themes` for SvelteKit. More thorough docs coming soon.

## Installation

```bash
pnpm install sveltekit-themes
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

In your components, you can use the `useTheme` hook to access the current theme and methods to change it.

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