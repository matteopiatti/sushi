<script lang="ts">
  import { tick } from "svelte";
  import Item from "./Item.svelte";

  const { tree = $bindable() } = $props();
  let items = $state<Array<Item>>([]);
</script>

{#if tree.type === "root"}
  <div class="root">
    {#each tree.children as child, i (child._key)}
      {#if child.type === "paragraph" || child.type === "heading" || child.type === "blockquote"}
        <Item
          bind:this={items[i]}
          tree={child}
          onremove={() => {
            tree.children.splice(i, 1);
            items[i - 1]?.focus();
          }}
          onadd={async () => {
            tree.children.splice(i + 1, 0, {
              type: "paragraph",
              children: [],
              _key: crypto.randomUUID(),
            });
            await tick();
            items[i + 1]?.focus();
          }}
          onarrowup={() => items[i - 1]?.focus()}
          onarrowdown={() => items[i + 1]?.focus()}
          onmoveup={() => {
            if (i === 0) return;
            [tree.children[i - 1], tree.children[i]] = [
              tree.children[i],
              tree.children[i - 1],
            ];
            items[i - 1]?.focus();
          }}
          onmovedown={() => {
            if (i === tree.children.length - 1) return;
            [tree.children[i + 1], tree.children[i]] = [
              tree.children[i],
              tree.children[i + 1],
            ];
            items[i + 1]?.focus();
          }}
        />
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
