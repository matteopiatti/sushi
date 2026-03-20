<script lang="ts">
  const props = $props();

  interface ElementMap {
    [key: string]: string | null;
  }

  const elementMap: ElementMap = {
    blockquote: "blockquote",
    emphasis: "i",
    strong: "b",
    thematicBreak: "hr",
    break: "br",
    listItem: "li",
    paragraph: "p",
    heading: `h${props.depth}`,
    inlineCode: null,
    plainText: null,
    root: null,
    wrapper: null,
    html: null,
    list: null,
  };

  const el = $derived(elementMap[props.type]);
</script>

{#if el}
  <svelte:element this={el} {...props}>
    {@render props.children?.()}
  </svelte:element>
{:else if props.type === "inlineCode"}
  <svelte:element this={"code"} class="inline-code" {...props}>
    {props.value}
  </svelte:element>
{:else if props.type === "list"}
  <svelte:element this={props.ordered ? "ol" : "ul"}>
    {@render props.children?.()}
  </svelte:element>
{:else if props.type === "html"}
  {@render props.children?.()}
  {@html props.value}
{:else}
  {@render props.children?.()}
{/if}
