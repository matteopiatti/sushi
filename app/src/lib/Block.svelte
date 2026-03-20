<script lang="ts">
  import Block from "./Block.svelte";
  import ContainerComponent from "$lib/components/ContainerComponent.svelte";
  import TextComponent from "$lib/components/TextComponent.svelte";
  import { registry } from "$lib/components/registry";

  const { children, tree } = $props();

  const Component = $derived(registry[tree.type]);
</script>

{#if !Component}
  {#if tree.type === "layoutChildren"}
    {@render children?.()}
  {:else}
    <p>Unknown block type: {tree.type}</p>
  {/if}
{:else if Component === ContainerComponent || Component === TextComponent}
  <Component {...tree} />
{:else}
  <Component {...tree}>
    {#each tree.children as child}
      <Block tree={child} {children} />
    {/each}
  </Component>
{/if}
