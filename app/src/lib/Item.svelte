<script lang="ts">
  import { mdastNodeToHtml, htmlToMdastChildren } from "./utils";
  import RichText from "./components/RichText.svelte";

  let {
    tree = $bindable(),
    onremove,
    onadd,
    onarrowup,
    onarrowdown,
  } = $props();

  let html = $state(mdastNodeToHtml(tree));
  let richtext = $state<HTMLElement>();

  function save() {
    const nodes = htmlToMdastChildren(html);
    tree.children = nodes[0]?.children ?? [];
  }

  export function focus() {
    richtext?.focus();
  }
</script>

<RichText
  bind:this={richtext}
  onbackspace={onremove}
  onenter={onadd}
  {onarrowup}
  {onarrowdown}
  bind:content={html}
  oninput={save}
/>
