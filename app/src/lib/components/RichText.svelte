<script lang="ts">
  import { Editor, Extension } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import BubbleMenu from "@tiptap/extension-bubble-menu";

  let {
    content,
    heading = 0,
    onEnter = () => {},
    html = $bindable(""),
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
        StarterKit.configure({
          trailingNode: false,
        }),
        BubbleMenu.configure({
          element: bubbleMenuEl,
          appendTo: () => document.body,
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
        Extension.create({
          addKeyboardShortcuts() {
            return {
              Enter: () => {
                onEnter();
                return true; // prevent Tiptap's default enter behavior
              },
            };
          },
        }),
      ],
      content: heading
        ? `<h${heading}>${content}</h${heading}>`
        : `<p>${content}</p>`,
      onUpdate({ editor }) {
        html = editor.getHTML();
      },
    });

    editor = instance;
    return () => instance.destroy();
  });

  $effect(() => {
    if (editor) {
      html = editor.getHTML();
    }
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
  .bubble-menu {
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

    &.visible {
      opacity: 1;
      pointer-events: auto;
    }

    button {
      cursor: pointer;
      border: none;
      border-radius: 4px;
      background: none;
      padding: 4px 8px;
      color: white;
      font-size: 13px;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      &.active {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }

  .editor-content {
    width: 100%;
  }

  .editor-content :global(.ProseMirror) {
    flex: 1;
    outline: none;
    width: 100%;
    line-height: 1.6;
    font-family: inherit;
  }

  .editor-content :global(h1) {
    width: 100%;
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

  .editor-content :global(.ProseMirror > *:last-child:empty) {
    display: none;
  }
</style>
