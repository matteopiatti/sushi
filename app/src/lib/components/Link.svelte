<script>
  import { resolve } from "$app/paths";
  const props = $props();
  const url = $derived(props.url || props.href);
  const isExternal = $derived(
    typeof url === "string" && /^(https?:)?\/\//.test(url),
  );
</script>

<a
  // eslint-disable-next-line svelte/no-navigation-without-resolve
  href={isExternal ? url : resolve(url)}
  type={props.type}
  target={props.attributes?.target || ""}
  rel={isExternal ? "external noopener noreferrer" : undefined}
  class={props.class}
>
  {@render props.children()}
</a>
