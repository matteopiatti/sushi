<script>
  import { codeToHtml } from "shiki";
  const props = $props();

  const html = $derived(
    codeToHtml(props.value, {
      lang: props.lang || "js",
      theme: "github-light",
      defaultColor: false,
    }),
  );
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html await html}
