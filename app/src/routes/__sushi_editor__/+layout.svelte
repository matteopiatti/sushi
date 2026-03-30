<script lang="ts">
  import { setContext } from "svelte";
  import { page } from "$app/state";

  const { data, children } = $props();

  let activePage = $derived(
    page.url.searchParams.get("current") || data.pages[0],
  );
  setContext("activePage", () => activePage);
</script>

<div class="sushi-editor">
  <aside>
    <h2>Pages</h2>
    {#each data.pages as p}
      <a
        href={`?current=${p}`}
        onclick={() => (activePage = p)}
        class:active={activePage === p}
      >
        {p || "/"}
      </a>
    {/each}
  </aside>
  <main>
    {@render children()}
  </main>
</div>

<style>
  .sushi-editor {
    display: flex;
    height: 100vh;

    aside {
      border-right: 1px solid #dddddd;
      padding: 1rem;
      width: 90px;
      overflow-y: auto;

      h2 {
        margin-bottom: 1rem;
        font-size: 14px;
      }

      a {
        display: block;
        padding: 4px 0;
        color: #333;
        font-size: 14px;
        text-decoration: none;

        &.active {
          font-weight: bold;
        }

        &:hover {
          text-decoration: underline;
        }
      }
    }

    main {
      flex: 1;
      overflow: hidden;
    }
  }
</style>
