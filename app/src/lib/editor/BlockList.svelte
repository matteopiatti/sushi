<script lang="ts">
  import { tick } from "svelte";
  import Item from "./EditorBlock.svelte";
  import BlockList from "./BlockList.svelte";
  import Draggable from "./Draggable.svelte";
  import EditorBlock from "./EditorBlock.svelte";

  let { children = $bindable() } = $props();
  let items = $state<Array<Item>>([]);
  let dragState = $state({
    dragIndex: null as number | null,
    dropIndex: null as number | null,
  });

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
      <Draggable
        class="block"
        index={i}
        handleName={child.type}
        {move}
        {dragState}
      >
        <EditorBlock
          bind:this={items[i]}
          node={child}
          onevent={(a) => handle(i, a)}
        />
        <!-- {#if child.type === "blockquote"}
          <BlockList bind:children={child.children} />
        {/if} -->
      </Draggable>
    {/if}
  {/each}
</div>

<style>
  .block-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
