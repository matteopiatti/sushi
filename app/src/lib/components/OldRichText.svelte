<script lang="ts">
  import { Editor, Extension } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import BubbleMenu from "@tiptap/extension-bubble-menu";

  let {
    content,
    onChange = () => {},
    onEnter = () => {},
    heading = 0,
  } = $props();
  let element = $state<HTMLElement>();
  let bubbleMenuEl = $state<HTMLElement>();
  let editor = $state<Editor>();
  let isVisible = $state(false);

  $effect(() => {
    if (!element || !bubbleMenuEl) return;

    const instance = new Editor({
      element,
      extensions: [
        StarterKit.configure({ trailingNode: false }),
        Extension.create({
          addKeyboardShortcuts() {
            return {
              Enter: () => {
                onEnter();
                return true;
              },
            };
          },
        }),
        BubbleMenu.configure({
          element: bubbleMenuEl,
          options: {
            placement: "top",
            offset: 8,
            onShow: () => {
              isVisible = true;
            },
            onHide: () => {
              isVisible = false;
            },
          },
          shouldShow: ({ state }) => {
            const { from, to } = state.selection;
            return from < to;
          },
        }),
      ],
      content: heading
        ? `<h${heading}>${content}</h${heading}>`
        : `<p>${content}</p>`,
      onUpdate({ editor }) {
        onChange(editor.getHTML());
      },
    });

    editor = instance;
    return () => instance.destroy();
  });
</script>

<div bind:this={bubbleMenuEl} class="bubble-menu" class:visible={isVisible}>
  <button
    onclick={() => editor?.chain().focus().toggleBold().run()}
    class:active={editor?.isActive("bold")}
  >
    <strong>B</strong>
  </button>
  <button
    onclick={() => editor?.chain().focus().toggleItalic().run()}
    class:active={editor?.isActive("italic")}
  >
    <em>I</em>
  </button>
  <button
    onclick={() => editor?.chain().focus().toggleCode().run()}
    class:active={editor?.isActive("code")}
  >
    <code>`</code>
  </button>
</div>

<div bind:this={element} class="editor-content"></div>

<style>
  :global(.bubble-menu) {
    display: flex;
    position: fixed;
    gap: 4px;
    opacity: 0;
    z-index: 9999;
    transition: opacity 0.1s;
    border-radius: 6px;
    background: #1a1a18;
    padding: 4px;
    pointer-events: none;
  }

  :global(.bubble-menu.visible) {
    opacity: 1;
    pointer-events: auto;
  }

  :global(.bubble-menu button) {
    cursor: pointer;
    border: none;
    border-radius: 4px;
    background: none;
    padding: 4px 8px;
    color: white;
    font-size: 13px;
  }

  :global(.bubble-menu button:hover) {
    background: rgba(255, 255, 255, 0.1);
  }

  :global(.bubble-menu button.active) {
    background: rgba(255, 255, 255, 0.2);
  }

  .editor-content :global(.ProseMirror) {
    flex: 1;
    outline: none;
    width: 100%;
    line-height: 1.6;
    font-family: inherit;
  }

  .editor-content :global(h1) {
    font-weight: 600;
    font-size: 1.4rem;
  }
  .editor-content :global(h2) {
    font-weight: 600;
    font-size: 1.2rem;
  }
  .editor-content :global(h3) {
    font-weight: 600;
    font-size: 1rem;
  }
  .editor-content :global(p) {
    margin: 0;
    font-size: 0.95rem;
  }
</style>


<script>
  onMount(() => {
    editorState.editor = new Editor({
      element: element,
      extensions: [
        StarterKit,
        BubbleMenu.configure({
          element: bubbleMenu,
        }),
      ],
      content: `
        <h1>Hello Svelte! 🌍️ </h1>
        <p>This editor is running in Svelte.</p>
        <p>Select some text to see the bubble menu popping up.</p>
      `,
      onTransaction: ({ editor }) => {
        // Update the state signal to force a re-render
        editorState = { editor };
      },
    });
  });

  onDestroy(() => {
    editorState.editor?.destroy();
  });
</script>