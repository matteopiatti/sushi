<script>
  import Block from "$lib/Block.svelte";
  import { blocks } from "$lib/blocks";

  const props = $props();

  let COMPONENT = $state();

  $effect(() => {
    if (props.name === "span") return;
    const capitalName = props.name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
    (async () => {
      // @ts-ignore
      COMPONENT = (await blocks[capitalName]()).default;
    })();
  });
</script>

{#if props.name === "span"}
  <span
    class={props.attributes?.class}
    id={props.attributes?.id}
    style={props.attributes?.style}
  >
    {#each props.children as child}
      <Block tree={child} />
    {/each}
  </span>
{:else}
  <COMPONENT {...props.attributes}>
    {#each props.children as child}
      <Block tree={child} />
    {/each}
  </COMPONENT>
{/if}
