<script lang="ts">
  import { mdastNodeToHtml, htmlToMdastChildren } from "$lib/utils";
  import RichText from "$lib/components/RichText.svelte";

  let { node = $bindable(), onevent } = $props();
  let html = $state(mdastNodeToHtml(node));
  let richtext = $state<HTMLElement>();

  function save() {
    const nodes = htmlToMdastChildren(html);
    const parsed = nodes[0];
    if (!parsed) return;

    node.children = parsed.children ?? [];

    if (parsed.type !== node.type) node.type = parsed.type;
    if (parsed.ordered !== node.ordered) node.ordered = parsed.ordered;
    if (parsed.depth !== node.depth) node.depth = parsed.depth;
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
