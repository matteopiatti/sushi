<script>
  import Block from "$lib/Block.svelte";
  import { onNavigate } from "$app/navigation";
  import { generateTree } from "$lib/utils.js";

  const { data, children } = $props();
  const tree = $derived(await generateTree(data.layoutContent, true));

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
