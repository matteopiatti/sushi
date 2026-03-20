<script>
  import { createRawSnippet, mount, unmount } from "svelte";
  import Block from "$lib/Block.svelte";
  import { blocks } from "$lib/blocks";

  const props = $props();

  const capitalName = $derived(
    props.name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(""),
  );

  let COMPONENT = $state();

  $effect(() => {
    (async () => {
      // @ts-ignore
      try {
        COMPONENT = (await blocks[capitalName]()).default;
      } catch (e) {
        console.error(`Component ${capitalName} not found in blocks.`);
      }
    })();
  });

  const children = $derived.by(() =>
    Object.fromEntries(
      props.children.map((element) => {
        const c = createRawSnippet(() => ({
          render: () => `<svelte:fragment></svelte:fragment>`,
          setup: (target) => {
            const comp = mount(Block, {
              target,
              props: {
                tree: element,
                ...element.attributes,
              },
            });
            return () => unmount(comp);
          },
        }));
        return [element.name, c];
      }),
    ),
  );
  const childrenProps = $derived.by(() =>
    Object.fromEntries(
      props.children.map((element) => [
        `${element.name}Props`,
        element.attributes,
      ]),
    ),
  );
</script>

<COMPONENT {...props.fmAttributes} {...children} {...childrenProps} />
