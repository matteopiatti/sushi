<script lang="ts">
  import { tick } from "svelte";
  import BlockList from "./BlockList.svelte";
  import Draggable from "./Draggable.svelte";
  import EditorBlock from "./EditorBlock.svelte";
  import PropertyBlock from "./PropertyBlock.svelte";
  import ValueBlock from "./ValueBlock.svelte";
  import ComponentBlock from "./ComponentBlock.svelte";

  let { children = $bindable(), draggable = true } = $props();
  let items = $state<
    Array<EditorBlock | ComponentBlock | PropertyBlock | ValueBlock>
  >([]);
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
  <!-- svelte-ignore binding_property_non_reactive -->
  {#each children as child, i (child._key)}
    {#if child.type === "yaml"}
      <PropertyBlock bind:node={children[i]} />
    {:else if child.type === "containerComponent"}
      <Draggable
        class="block component-block"
        index={i}
        handleName={child.name}
        {move}
        {dragState}
        disabled={!draggable}
      >
        <ComponentBlock bind:node={children[i]} />
      </Draggable>
    {:else if child.type === "paragraph" || child.type === "heading" || child.type === "blockquote" || child.type === "list"}
      <Draggable
        class="block"
        index={i}
        handleName={child.type}
        {move}
        {dragState}
        disabled={!draggable}
      >
        <EditorBlock
          bind:this={items[i]}
          bind:node={children[i]}
          onevent={(a) => handle(i, a)}
        />
        <!-- {#if child.type === "blockquote"}
          <BlockList bind:children={child.children} />
        {/if} -->
      </Draggable>
    {:else if child.type === "code"}
      <Draggable
        class="block"
        index={i}
        handleName={child.type}
        {move}
        {dragState}
        disabled={!draggable}
      >
        <ValueBlock
          bind:this={items[i]}
          bind:value={child.value}
          onevent={(a) => handle(i, a)}
        />
      </Draggable>
    {:else if child.type === "thematicBreak"}
      <Draggable
        class="block"
        index={i}
        handleName={child.type}
        {move}
        {dragState}
        disabled={!draggable}
      >
        <hr style="width: 100%;" />
      </Draggable>
    {:else if child.type === "componentContainerSection"}
      <BlockList bind:children={child.children} />
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
