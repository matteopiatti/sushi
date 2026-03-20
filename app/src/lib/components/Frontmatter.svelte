<script>
  import { parse as parseYaml } from "yaml";
  const { value } = $props();
  const data = $derived(parseYaml(value));
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={data.description} />
  {#each data.style as style}
    <link rel="stylesheet" href={style} />
  {/each}
</svelte:head>
