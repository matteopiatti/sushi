<script>
  import Block from "$lib/Block.svelte";
  import { generateTree } from "$lib/utils.js";
  import { page } from "$app/state";

  const { data } = $props();
  const tree = $derived(await generateTree(data.pageContent));
  $inspect(tree);
</script>

{#key page.url.pathname}
  <Block {tree} />
{/key}
