<script lang="ts">
  import BlockList from "./BlockList.svelte";

  let { node = $bindable() } = $props();
  let plainSlots = $derived.by(() => {
    const slots = [];
    for (const child of node.children) {
      if (child.type === "componentContainerSection") continue;
      slots.push(child);
    }
    return slots;
  });

  function remove(key) {
    delete node.fmAttributes[key];
  }
</script>

<div class="component">
  {#each Object.keys(node.fmAttributes) as key}
    <div class="property">
      <span class="label" onclick={() => remove(key)}>{key}</span>
      <input type="text" bind:value={node.fmAttributes[key]} />
    </div>
  {/each}
  <button
    onclick={() => {
      const newKey = prompt("Enter property name");
      if (newKey) {
        node.fmAttributes = { ...node.fmAttributes, [newKey]: "" };
      }
    }}>+</button
  >
  <div class="children">
    <div class="child">
      <label class="child-label">plainslots</label>
      <BlockList bind:children={plainSlots} draggable={false} />
    </div>
    {#each node.children as child, i}
      <div class="child">
        {#if child.type === "componentContainerSection"}
          <label class="child-label">{child.name}</label>
          <BlockList bind:children={child.children} draggable={false} />
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .component {
    width: 100%;

    .children {
      display: flex;
      flex-direction: column;
      padding: 0.3rem 0;
    }
  }
</style>
