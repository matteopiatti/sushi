<script>
  import Block from "$lib/Block.svelte";
  const props = $props();

  const DIR = "../blocks";
  const capitalName = props.name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  let COMPONENT = $state();

  $effect(() => {
    if (props.name === "span") return;
    (async () => {
      COMPONENT = (
        await import(/* @vite-ignore */ DIR + "/" + capitalName + ".svelte")
      ).default;
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
