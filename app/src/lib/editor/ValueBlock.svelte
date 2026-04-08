<script lang="ts">
  import RichText from "$lib/components/RichText.svelte";

  let { value = $bindable(), onevent } = $props();
  let richtext = $state<HTMLElement>();

  function save(v) {
    value = v.replace(/<[^>]*>/g, "");
  }

  $inspect(value);

  export function focus() {
    richtext?.focus();
  }
</script>

<RichText
  bind:this={richtext}
  isCode={true}
  onbackspace={() => onevent("remove")}
  onenter={() => {}}
  onarrowup={() => onevent("up")}
  onarrowdown={() => onevent("down")}
  bind:content={() => value, save}
  oninput={() => {}}
/>
