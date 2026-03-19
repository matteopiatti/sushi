<script>
  import "$lib/assets/reset.css";
  import "$lib/assets/style.css";
  import Block from "$lib/admin/Block.svelte";
  import remarkParse from "remark-parse";
  import remarkMDC from "remark-mdc";
  import remarkFrontmatter from "remark-frontmatter";
  import { unified } from "unified";
  import plainTextSyntax from "$lib/admin/plainTextDirective";
  import spacerSyntax from "$lib/admin/spacerDirective.js";
  import childrenDirective from "$lib/admin/childrenDirective.js";
  import remarkBreaks from "remark-breaks";
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

<Block {tree}>
  <main>
    {@render children()}
  </main>
</Block>
