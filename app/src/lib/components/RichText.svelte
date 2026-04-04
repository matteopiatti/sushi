<script lang="ts">
  import { Editor } from "@tiptap/core";
  import { StarterKit } from "@tiptap/starter-kit";
  import BubbleMenu from "@tiptap/extension-bubble-menu";
  import { onDestroy, onMount } from "svelte";
  import { SushiExtension, SingleBlockDocument } from "$lib/tiptapUtils";

  let {
    content = $bindable(),
    oninput,
    onbackspace,
    onenter,
    onarrowup,
    onarrowdown,
  } = $props();

  let element = $state<HTMLDivElement | null>(null);
  let editor = $state<Editor | null>(null);

  onMount(() => {
    editor = new Editor({
      element,
      extensions: [
        SingleBlockDocument,
        StarterKit.configure({
          document: false,
        }),
        SushiExtension.configure({
          onEnterAtEnd: () => onenter(),
          onBackspaceAtStart: () => onbackspace(),
          onArrowUpAtStart: () => onarrowup(),
          onArrowDownAtEnd: () => onarrowdown(),
        }),
      ],
      content,
      onUpdate({ editor }) {
        content = editor.getHTML();
        oninput();
      },
    });
  });

  onDestroy(() => {
    editor?.destroy();
  });

  export function focus() {
    editor?.commands.focus();
  }
</script>

<div bind:this={element}></div>

<style>
  div {
    margin: 0;
    width: 100%;
  }
</style>
