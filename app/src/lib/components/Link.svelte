<script>
  import { resolve } from "$app/paths";
  const props = $props();
  const isExternal = $derived(
    typeof props.url === "string" && /^(https?:)?\/\//.test(props.url),
  );
</script>

<a
  // eslint-disable-next-line svelte/no-navigation-without-resolve
  href={isExternal ? props.url : resolve(props.url)}
  type={props.type}
  target={props.attributes?.target || ""}
  rel={isExternal ? "external noopener noreferrer" : undefined}
  class={props.class}
>
  {@render props.children()}
</a>
