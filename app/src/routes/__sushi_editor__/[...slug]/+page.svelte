<script lang="ts">
  import "$lib/tiptap.css";
  import { page } from "$app/state";
  import Editor from "$lib/Editor.svelte";
  import { generateTreeSync } from "$lib/utils.js";
  import { saveTree } from "$lib/editor.remote.js";
  import { untrack } from "svelte";

  const { data } = $props();

  const editorSlug = "/__sushi_editor__";
  const activePage = $derived(
    page.url.pathname.replace(`${editorSlug}`, "") || "index",
  );

  let saving = $state<Boolean>(false);
  let iframe = $state<HTMLIFrameElement>();
  let tree = $derived.by(() => {
    const state = $state(generateTreeSync(data.pageContent));
    return state;
  });
  let saveTimeout: ReturnType<typeof setTimeout>;

  $effect(() => {
    saving = true;
    iframe?.contentWindow?.postMessage(
      { type: "sushi-update", tree: $state.snapshot(tree) },
      "*",
    );

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      untrack(() => {
        saveTree({ slug: activePage, tree });
      });
      saving = false;
    }, 1500);
  });

  $inspect(saving);
</script>

<svelte:window
  onbeforeunload={(e) => {
    if (saving) {
      e.preventDefault();
    }
  }}
/>

<div class="editor-page">
  <div class="editor-header">
    <h1>{activePage}</h1>
    {#if saving}
      <span style="color: green;">Saving...</span>
    {/if}
  </div>
  <div class="editor-content">
    <div>
      {#key activePage}
        <Editor bind:tree />
      {/key}
    </div>
    <iframe
      src={activePage === "index" ? "/" : activePage}
      style="width: 100%; height: 100%; border: none;"
      title="preview"
      bind:this={iframe}
    ></iframe>
  </div>
</div>

<style>
  .editor-page {
    padding: 1rem;

    h1 {
      margin: 0;
    }

    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .editor-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 100%;
      height: calc(100vh - 3rem);
    }
  }
</style>
