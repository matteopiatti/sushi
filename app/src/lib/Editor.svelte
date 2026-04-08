<script lang="ts">
  import BlockList from "./BlockList.svelte";

  const { tree = $bindable() } = $props();
</script>

<div class="root">
  <BlockList bind:children={tree.children} />
</div>

<style>
  .root {
    padding: 1rem;
  }
</style>
