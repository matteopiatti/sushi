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

  .block {
    display: flex;
    position: relative;
    align-items: flex-start;
    gap: 0.75rem;
    transition: border-color 0.15s;
    border: 1px solid #eee;
    border-radius: 8px;
    background: white;
    padding: 0.75rem;

    &:hover {
      border-color: #ddd;
    }

    .label {
      flex-shrink: 0;
      padding-top: 4px;
      width: 60px;
      color: #aaa;
      font-size: 10px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
  }
</style>
