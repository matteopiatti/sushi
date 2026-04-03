<script lang="ts">
  import Item from "./Item.svelte";

  const { tree = $bindable() } = $props();
</script>

{#if tree.type === "root"}
  <div class="root">
    {#each tree.children as child, i (child)}
      {#if child.type === "paragraph"}
        <Item tree={child} onremove={() => tree.children.splice(i, 1)} />
      {:else if child.type === "heading"}
        <Item tree={child} onremove={() => tree.children.splice(i, 1)} />
      {:else if child.type === "blockquote"}
        <Item tree={child} onremove={() => tree.children.splice(i, 1)} />
      {/if}
    {/each}
  </div>
{/if}

<style>
  .root {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
  }
</style>
