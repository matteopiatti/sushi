<script>
  import Block from "$lib/Block.svelte";
  import remarkParse from "remark-parse";
  import remarkMDC from "remark-mdc";
  import remarkFrontmatter from "remark-frontmatter";
  import remarkBreaks from "remark-breaks";
  import { unified } from "unified";
  import plainTextSyntax from "$lib/plainTextDirective";
  import spacerSyntax from "$lib/spacerDirective.js";
  import { page } from "$app/state";

  const { data } = $props();
  const md = $derived(data.pageContent);

  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkMDC)
    .use(remarkBreaks)
    .use(plainTextSyntax)
    .use(spacerSyntax);

  const tree = $derived(processor.runSync(processor.parse(md)));
</script>

{#key page.url.pathname}
  <Block {tree} />
{/key}
