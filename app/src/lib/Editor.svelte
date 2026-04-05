<script lang="ts">
  import { tick } from "svelte";
  import Item from "./Item.svelte";
  import Draggable from "./Draggable.svelte";

  const { tree = $bindable() } = $props();
  let items = $state<Array<Item>>([]);
  let dragIndex = $state<number | null>(null);
  let dropIndex = $state<number | null>(null);

  function move(from: number, to: number) {
    if (from === to) return;
    const [block] = tree.children.splice(from, 1);
    tree.children.splice(to > from ? to - 1 : to, 0, block);
  }

  function focus(index: number) {
    items[index]?.focus();
  }
</script>

{#if tree.type === "root"}
  <div class="root">
    {#each tree.children as child, i (child._key)}
      {#if child.type === "paragraph" || child.type === "heading" || child.type === "blockquote"}
        <div
          onclick={() => focus(i)}
          role="button"
          tabindex="0"
          onkeydown={(e) =>
            e.key === "Enter" || e.key === " " ? focus(i) : null}
        >
          <Draggable
            dragging={dragIndex === i}
            dropTarget={dropIndex === i}
            ondragstart={() => {
              dragIndex = i;
            }}
            ondragover={() => {
              dropIndex = i;
            }}
            ondrop={() => {
              if (dragIndex !== null) move(dragIndex, i);
              dragIndex = null;
              dropIndex = null;
            }}
            ondragend={() => {
              dragIndex = null;
              dropIndex = null;
            }}
          >
            {#snippet handle()}
              {child.type}
            {/snippet}

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
            />
          </Draggable>
        </div>
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
