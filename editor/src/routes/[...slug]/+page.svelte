<script lang="ts">
  import { savePage } from "$lib/editor.remote";
  import { serializeTree } from "$utils/utils";

  const { data } = $props();
  let blocks = $state(data.tree.children);
  let saving = $state(false);
  let selected = $state<number | null>(null);
  let iframe = $state<HTMLIFrameElement>();

  async function save() {
    saving = true;
    const tree = { ...data.tree, children: blocks };
    const md = await serializeTree(tree);
    await savePage({ slug: data.slug, content: md });
    saving = false;
    iframe?.contentWindow?.location.reload();
  }
</script>

<div style="display: flex; height: 100%; overflow: hidden;">
  <div
    style="width: 400px; flex-shrink: 0; overflow-y: auto; padding: 2rem; border-right: 1px solid #eee;"
  >
    <div
      style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;"
    >
      <h1 style="font-size: 14px; color: #999;">
        {data.slug === "index" ? "/" : data.slug}
      </h1>
      <button
        onclick={save}
        style="padding: 6px 16px; background: #1a1a18; color: white; border: none; border-radius: 6px; cursor: pointer;"
      >
        {saving ? "saving..." : "save"}
      </button>
    </div>

    {#each blocks as block, i}
      <div
        onclick={() => (selected = i)}
        style="border: 1px solid {selected === i
          ? '#6366f1'
          : '#eee'}; border-radius: 8px; padding: 1rem; margin-bottom: 0.75rem; cursor: pointer;"
      >
        <div style="font-size: 11px; color: #999; margin-bottom: 0.5rem;">
          {block.type}
        </div>

        {#if block.type === "heading"}
          <input
            value={block.children?.[0]?.value}
            oninput={(e) => (block.children[0].value = e.currentTarget.value)}
            style="width: 100%; font-size: {block.depth === 1
              ? '1.4rem'
              : '1.1rem'}; font-weight: bold; border: none; outline: none; background: transparent;"
          />
        {:else if block.type === "paragraph"}
          <textarea
            value={block.children?.[0]?.value}
            oninput={(e) => (block.children[0].value = e.currentTarget.value)}
            style="width: 100%; border: none; outline: none; background: transparent; resize: none; font-size: 1rem; font-family: inherit;"
            rows="3"
          ></textarea>
        {:else if block.type === "spacer"}
          <div style="color: #999; font-size: 12px; text-align: center;">
            — spacer —
          </div>
        {:else if block.type === "containerComponent"}
          <div style="color: #6366f1; font-weight: 500; margin-bottom: 0.5rem;">
            :: {block.name}
          </div>
          {#each Object.entries(block.fmAttributes ?? {}) as [key, value]}
            <div
              style="display: flex; gap: 0.5rem; align-items: center; margin-top: 0.25rem;"
            >
              <label style="font-size: 12px; color: #999; width: 80px;"
                >{key}</label
              >
              <input
                {value}
                oninput={(e) =>
                  (block.fmAttributes[key] = e.currentTarget.value)}
                style="flex: 1; border: 1px solid #eee; border-radius: 4px; padding: 4px 8px; font-size: 13px;"
              />
            </div>
          {/each}
        {:else if block.type === "yaml"}
          <div style="color: #999; font-size: 12px;">frontmatter</div>
        {:else}
          <div style="color: #999; font-size: 12px;">{block.type}</div>
        {/if}
      </div>
    {/each}
  </div>

  <iframe
    bind:this={iframe}
    src="http://localhost:5274/{data.slug === 'index' ? '' : data.slug}"
    style="flex: 1; border: none;"
    title="preview"
  ></iframe>
</div>
