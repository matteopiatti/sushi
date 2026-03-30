<script lang="ts">
  const { data, children } = $props();
</script>

<div style="display: flex; height: 100vh;">
  <aside
    style="width: 240px; border-right: 1px solid #eee; padding: 1rem; overflow-y: auto;"
  >
    <h2 style="font-size: 14px; margin-bottom: 1rem;">Pages</h2>
    {#each data.pages as page}
      <a
        href={`/${page}`}
        style="display: block; padding: 4px 0; font-size: 14px;"
      >
        {page || "/"}
      </a>
    {/each}
  </aside>
  <main style="flex: 1; overflow: hidden;">
    {@render children()}
  </main>
</div>
