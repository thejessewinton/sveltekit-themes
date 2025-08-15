<script lang="ts">
  import '../app.css';
  import { ThemeProvider } from '$lib';

  let { children } = $props();
</script>

<ThemeProvider attribute="class" storageKey="the-theme">
  {@render children?.()}
</ThemeProvider>
