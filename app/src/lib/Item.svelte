<script lang="ts">
  import { mdastNodeToHtml, htmlToMdastChildren } from "./utils";
  import RichText from "./components/RichText.svelte";

  let { node = $bindable(), onevent } = $props();
  let html = $state(mdastNodeToHtml(node));
  let richtext = $state<HTMLElement>();

  function save() {
    const nodes = htmlToMdastChildren(html);
    node.children = nodes[0]?.children ?? [];
  }

  export function focus() {
    richtext?.focus();
  }
</script>

<RichText
  bind:this={richtext}
  onbackspace={() => onevent("remove")}
  onenter={() => onevent("add")}
  onarrowup={() => onevent("up")}
  onarrowdown={() => onevent("down")}
  bind:content={html}
  oninput={save}
/>