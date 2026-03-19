<script lang="ts">
  import Block from "./Block.svelte";

  import Root from "$lib/components/Root.svelte";
  import Text from "$lib/components/Text.svelte";
  import Heading from "$lib/components/Heading.svelte";
  import Frontmatter from "$lib/components/Frontmatter.svelte";
  import Paragraph from "$lib/components/Paragraph.svelte";
  import Link from "$lib/components/Link.svelte";
  import Strong from "$lib/components/Strong.svelte";
  import Emphasis from "$lib/components/Emphasis.svelte";
  import ContainerComponent from "$lib/components/ContainerComponent.svelte";
  import PlainText from "$lib/components/PlainText.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import TextComponent from "$lib/components/TextComponent.svelte";
  import Image from "$lib/components/Image.svelte";
  import List from "$lib/components/List.svelte";
  import ListItem from "$lib/components/ListItem.svelte";
  import Blockquote from "$lib/components/Blockquote.svelte";
  import InlineCode from "$lib/components/InlineCode.svelte";
  import Code from "$lib/components/Code.svelte";
  import Html from "$lib/components/Html.svelte";

  import { createRawSnippet } from "svelte";

  const { children, tree } = $props();

  const registry = {
    yaml: Frontmatter,
    heading: Heading,
    root: Root,
    text: Text,
    code: Code,
    list: List,
    html: Html,
    blockquote: Blockquote,
    plainText: PlainText,
    listItem: ListItem,
    inlineCode: InlineCode,
    paragraph: Paragraph,
    textComponent: TextComponent,
    image: Image,
    link: Link,
    strong: Strong,
    emphasis: Emphasis,
    containerComponent: ContainerComponent,
    componentContainerSection: Wrapper,
    thematicBreak: createRawSnippet(() => ({
      render: () => "<hr />",
    })),
    break: createRawSnippet(() => ({
      render: () => "<br />",
    })),
    spacer: createRawSnippet(() => ({
      render: () => `<div aria-hidden="true" style="height:1lh"></div>`,
    })),
  };

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
