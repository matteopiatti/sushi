<script lang="ts">
  import { page } from "$app/state";
  import EditBlock from "$lib/Editor.svelte";
  import { generateTree, serializeTree } from "$lib/utils.js";
  import { getContext } from "svelte";
  import { savePage } from "$lib/editor.remote.js";

  const { data } = $props();

  const getActivePage = getContext<() => string>("activePage");
  let tree = $state(await generateTree(data.pageContent));
  const activePage = $derived(getActivePage());
  let saving = $state(false);
  let iframe = $state<HTMLIFrameElement>();

  let saveTimeout: ReturnType<typeof setTimeout>;
  async function onChange() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      saving = true;
      const [md] = await Promise.all([
        serializeTree(tree),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);
      await savePage({ slug: activePage, content: md });
      iframe?.contentWindow?.location.reload();
      saving = false;
    }, 1500);
  }

  function addBlock(index: number, block: any) {
    tree.children.splice(index + 1, 0, block);
    onChange();
  }
</script>

<div class="editor-page">
  <div class="editor-header">
    <h1>{activePage}</h1>
    {#if saving}
      <span style="color: green;">Saving...</span>
    {/if}
  </div>
  <div class="editor-content">
    <div>
      {#key page.url.searchParams.get("current")}
        <EditBlock bind:tree save={onChange} {addBlock} />
      {/key}
    </div>
    <iframe
      src="/{activePage === 'index' ? '' : activePage}"
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
