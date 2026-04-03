<script lang="ts">
  import { untrack } from "svelte";
  import RichText from "./components/OldRichText.svelte";
  import EditBlock from "./Editor.svelte";
  import { htmlToMdastChildren, mdastChildrenToHtml } from "$lib/utils.js";

  const { tree = $bindable(), save, addBlock, index = 0 } = $props();

  function setHTML(node: any, html: string) {
    untrack(() => {
      const children = htmlToMdastChildren(html);
      node.children = children.length
        ? children
        : [{ type: "text", value: "" }];
    });
  }

  const blockLevelTypes = ["root", "blockquote", "listItem", "list"];
  const isBlock = blockLevelTypes.includes(tree.type);
</script>

{#if tree.type === "root"}
  <div class="root">
    {#each tree.children as child, i}
      <EditBlock tree={child} {save} {addBlock} index={i} />
    {/each}
  </div>
{:else if tree.type === "heading"}
  <div class="block">
    <span class="label">h{tree.depth}</span>
    <RichText
      content={mdastChildrenToHtml(tree.children)}
      heading={tree.depth}
      onChange={(html) => {
        setHTML(tree, html);
        save();
      }}
      onEnter={() =>
        addBlock(index, {
          type: "paragraph",
          children: [{ type: "text", value: "" }],
        })}
    />
  </div>
{:else if tree.type === "paragraph"}
  <div class="block">
    <span class="label">p</span>
    <RichText
      content={mdastChildrenToHtml(tree.children)}
      onChange={(html) => {
        setHTML(tree, html);
        save();
      }}
      onEnter={() =>
        addBlock(index, {
          type: "paragraph",
          children: [{ type: "text", value: "" }],
        })}
    />
  </div>
{:else if isBlock}
  <div class="block nested">
    <span class="label">{tree.type}</span>
    <div class="nested-children">
      {#each tree.children as child, i}
        <EditBlock tree={child} {save} {addBlock} index={i} />
      {/each}
    </div>
  </div>
{:else if tree.type === "containerComponent"}
  <div class="block component">
    <span class="label">block</span>
    <div class="component-name">:: {tree.name}</div>
    {#each Object.entries(tree.fmAttributes ?? {}) as [key, value]}
      <div class="prop-row">
        <label class="prop-key">{key}</label>
        <input
          class="prop-input"
          {value}
          oninput={(e) => {
            tree.fmAttributes[key] = e.currentTarget.value;
            save();
          }}
        />
      </div>
    {/each}
  </div>
{:else if tree.type === "spacer"}
  <div class="block spacer">
    <span class="label">spacer</span>
    <div class="spacer-line"></div>
  </div>
{:else if tree.type === "yaml"}
  <div class="block yaml">
    <span class="label">meta</span>
    <div class="yaml-hint">frontmatter</div>
  </div>
{:else}
  <div class="block unknown">
    <span class="label">{tree.type}</span>
  </div>
{/if}

<style>
  .root {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
  }

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
  }

  .label {
    flex-shrink: 0;
    padding-top: 4px;
    width: 32px;
    color: #aaa;
    font-size: 10px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .component {
    flex-direction: column;
    border-color: #e0e7ff;
    background: #fafbff;

    .component-name {
      margin-bottom: 0.5rem;
      color: #6366f1;
      font-weight: 500;
      font-size: 13px;
    }
  }

  .prop-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .prop-key {
    flex-shrink: 0;
    width: 80px;
    color: #999;
    font-size: 12px;
  }

  .prop-input {
    flex: 1;
    outline: none;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 13px;
    font-family: inherit;

    &:focus {
      border-color: #6366f1;
    }
  }

  .spacer {
    align-items: center;
    border-style: dashed;
    background: #fafafa;

    .spacer-line {
      flex: 1;
      background: #eee;
      height: 1px;
    }
  }

  .yaml {
    background: #fafafa;

    .yaml-hint {
      color: #bbb;
      font-size: 12px;
    }
  }

  .nested {
    flex-direction: column;

    .nested-children {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      border-left: 2px solid #eee;
      padding-left: 1rem;
      width: 100%;
    }
  }

  .unknown {
    border-color: #ffe4c4;
    background: #fff8f0;
  }
</style>
