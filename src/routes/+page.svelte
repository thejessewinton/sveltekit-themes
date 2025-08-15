<script lang="ts">
  import { useTheme } from '$lib';

  const theme = useTheme();

  $inspect('theme', theme.current);
</script>

<div
  class="min-h-screen grid place-items-center bg-white dark:bg-black text-black dark:text-white"
>
  <div class="grid gap-4 text-center">
    <h1 class="text-2xl md:text-3xl">SvelteKit Themes</h1>

    <select
      onchange={(e) => theme.set(e.currentTarget.value)}
      class="p-2 rounded"
    >
      <option value="light"> Light Theme </option>
      <option value="dark"> Dark Theme </option>
      <option value="system"> System Theme </option>
    </select>
  </div>
</div>
