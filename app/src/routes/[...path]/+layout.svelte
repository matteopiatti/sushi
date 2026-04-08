<script lang="ts">
  import Block from "$lib/Block.svelte";
  import { onNavigate } from "$app/navigation";
  import { generateTree } from "$lib/utils.js";
  import { invalidateAll } from "$app/navigation";

  const { data, children } = $props();
  const tree = $derived(generateTree(data.layoutContent, true));

  // invalidate ensures that sveltekit can update content,
  // without full page reload being neccessary
  if (import.meta.hot) {
    import.meta.hot.on("sushi:content-change", () => {
      invalidateAll();
    });
  }

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

{#if data.layoutContent === ""}
  <main>
    {@render children()}
  </main>
{:else}
  <Block {tree}>
    <main>
      {@render children()}
    </main>
  </Block>
{/if}
