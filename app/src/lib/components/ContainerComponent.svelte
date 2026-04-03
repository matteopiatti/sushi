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
      try {
        // @ts-ignore
        COMPONENT = (await blocks[capitalName]()).default;
      } catch (e) {
        if (
          e instanceof Error &&
          e.message.includes(
            "(intermediate value)[$.get(...)] is not a function",
          )
        ) {
          console.error(
            `Component ${capitalName} not found in blocks. Make sure to create it.`,
          );
        } else {
          throw e;
        }
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
