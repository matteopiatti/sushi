<script lang="ts">
  import { mdastNodeToHtml, htmlToMdastChildren } from "./utils";
  import RichText from "./components/RichText.svelte";

  let { tree = $bindable(), onremove } = $props();
  let html = $state(mdastNodeToHtml(tree));
  let richtext = $state<HTMLElement>();
  const type = $state(tree.type);

  function save() {
    const nodes = htmlToMdastChildren(html);
    tree.children = nodes[0]?.children ?? [];
  }
</script>

<div
  class="block"
  role="textbox"
  tabindex="-1"
  onclick={() => richtext?.focus()}
  onkeydown={(e) => {
    if (e.key === "Enter" || e.key === " ") richtext?.focus();
  }}
>
  <span class="label">{type}</span>
  <button onclick={onremove}>remove</button>
  <RichText bind:this={richtext} bind:content={html} oninput={save} />
</div>

<style>
  .block {
    display: flex;
    position: relative;
    align-items: flex-start;
    gap: 0.75rem;
    transition: border-color 0.15s;
    border: 1px solid #eee;
    border-radius: 8px;
    background: white;
    padding: 0.75rem;

    &:hover {
      border-color: #ddd;
    }

    &:focus-within {
      border-color: #4a9eff;
    }

    .label {
      flex-shrink: 0;
      padding-top: 4px;
      width: 60px;
      color: #aaa;
      font-size: 10px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    :last-child {
      margin: 0;
      width: 100%;

      &:focus {
        outline: none;
      }
    }
  }
</style>
