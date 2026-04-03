<script lang="ts">
  import Block from "$lib/Block.svelte";
  import { generateTree } from "$lib/utils.js";
  import { page } from "$app/state";
  import type { Root } from "mdast";

  const { data } = $props();
  let tree = $derived<Root>(await generateTree(data.pageContent));
</script>

<svelte:window
  on:message={(e) => {
    if (e.data.type === "sushi-update") {
      tree = e.data.tree;
    }
  }}
/>

{#key page.url.pathname && tree.children.length}
  <Block {tree} />
{/key}
