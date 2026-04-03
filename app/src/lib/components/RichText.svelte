<script lang="ts">
  import { Editor } from "@tiptap/core";
  import { StarterKit } from "@tiptap/starter-kit";
  import BubbleMenu from "@tiptap/extension-bubble-menu";
  import { onDestroy, onMount } from "svelte";
  import Document from "@tiptap/extension-document";

  let { content = $bindable(), oninput } = $props();

  let element = $state<HTMLDivElement | null>(null);
  let editor = $state<Editor | null>(null);

  const SingleBlockDocument = Document.extend({
    content: "block",
  });

  onMount(() => {
    editor = new Editor({
      element,
      extensions: [
        SingleBlockDocument,
        StarterKit.configure({
          document: false,
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
