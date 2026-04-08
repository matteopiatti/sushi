<script lang="ts">
  import { tick } from "svelte";
  import Item from "./Item.svelte";
  import BlockList from "./BlockList.svelte";

  let { children = $bindable() } = $props();
  let items = $state<Array<Item>>([]);
  let dragIndex = $state<number | null>(null);
  let dropIndex = $state<number | null>(null);
  let canDrag = $state(false);

  function move(from: number, to: number) {
    if (from === to) return;
    const [block] = children.splice(from, 1);
    children.splice(to > from ? to - 1 : to, 0, block);
  }

  function handle(i: number, action: string) {
    switch (action) {
      case "add":
        children.splice(i + 1, 0, {
          type: "paragraph",
          children: [],
          _key: crypto.randomUUID(),
        });
        tick().then(() => items[i + 1]?.focus());
        break;
      case "remove":
        children.splice(i, 1);
        items[i - 1]?.focus();
        break;
      case "up":
        items[i - 1]?.focus();
        break;
      case "down":
        items[i + 1]?.focus();
        break;
    }
  }
</script>

<div class="block-list">
  {#each children as child, i (child._key)}
    {#if child.type === "paragraph" || child.type === "heading" || child.type === "blockquote"}
      <div
        class="block"
        role="application"
        class:dragging={dragIndex === i}
        class:drop-target={dropIndex === i}
        draggable={canDrag}
        ondragstart={() => (dragIndex = i)}
        ondragend={() => {
          dragIndex = null;
          dropIndex = null;
          canDrag = false;
        }}
        ondragover={(e) => {
          e.preventDefault();
          dropIndex = i;
        }}
        ondrop={(e) => {
          e.preventDefault();
          if (dragIndex !== null) move(dragIndex, i);
          dragIndex = null;
          dropIndex = null;
        }}
      >
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <span
          class="drag-handle"
          onmousedown={() => (canDrag = true)}
          onmouseup={() => (canDrag = false)}
        >
          {child.type}
        </span>
        <Item bind:this={items[i]} node={child} onevent={(a) => handle(i, a)} />
        <!-- {#if child.type === "blockquote"}
          <BlockList bind:children={child.children} />
        {/if} -->
      </div>
    {/if}
  {/each}
</div>

<style>
  .block-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &:has(.dragging) :global(.ProseMirror) {
      pointer-events: none;
    }

    .block {
      display: flex;
      position: relative;
      flex-direction: column;
      align-items: flex-start;
      transition: border-color 0.15s;
      border: 1px solid #eee;
      border-radius: 8px;
      background: white;
      padding: 0.75rem;

      &:hover {
        border-color: #ddd;
      }

      &:focus-within {
        border-color: #4a9eff;
      }

      &.dragging {
        opacity: 0.3;

        .drag-handle {
          cursor: grabbing;
        }
      }

      &.drop-target {
        border-color: #4a9eff;
      }

      .drag-handle {
        flex-shrink: 0;
        cursor: grab;
        padding-top: 4px;
        width: 60px;
        color: #aaa;
        font-size: 10px;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
    }
  }
</style>
