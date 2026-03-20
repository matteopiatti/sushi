<script>
  import remarkParse from "remark-parse";
  import remarkMDC from "remark-mdc";
  import remarkFrontmatter from "remark-frontmatter";
  import remarkBreaks from "remark-breaks";
  import { unified } from "unified";

  import plainTextSyntax from "$lib/plainTextDirective";
  import spacerSyntax from "$lib/spacerDirective.js";
  import childrenDirective from "$lib/childrenDirective.js";
  import Block from "$lib/Block.svelte";
  import { onNavigate } from "$app/navigation";

  const { data, children } = $props();

  const md = $derived(data.layoutContent);

  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkMDC)
    .use(remarkBreaks)
    .use(plainTextSyntax)
    .use(spacerSyntax)
    .use(childrenDirective);

  const tree = $derived(await processor.run(processor.parse(md)));

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

{#if data.layoutContent === ""}
  <main>
    {@render children()}
  </main>
{:else}
  <Block {tree}>
    <main>
      {@render children()}
    </main>
  </Block>
{/if}
