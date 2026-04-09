<script lang="ts">
  import { Editor } from "@tiptap/core";
  import { StarterKit } from "@tiptap/starter-kit";
  import BubbleMenu from "@tiptap/extension-bubble-menu";
  import { onDestroy, onMount } from "svelte";
  import { SushiExtension, SingleBlockDocument } from "$lib/editor/tiptapUtils";

  let {
    content = $bindable(),
    oninput,
    onbackspace,
    onenter,
    onarrowup,
    onarrowdown,
    isCode = false,
  } = $props();

  let element = $state<HTMLDivElement | null>(null);
  let editorState = $state<{ editor: Editor | null }>({ editor: null });
  let bubbleMenu = $state();

  onMount(() => {
    editorState.editor = new Editor({
      element,
      extensions: [
        SingleBlockDocument,
        StarterKit.configure({
          document: false,
          link: {
            openOnClick: false,
            HTMLAttributes: {
              class: "editor-link",
            },
          },
        }),
        SushiExtension.configure({
          onEnterAtEnd: () => onenter(),
          onBackspaceAtStart: () => onbackspace(),
          onArrowUpAtStart: () => onarrowup(),
          onArrowDownAtEnd: () => onarrowdown(),
        }),
        BubbleMenu.configure({
          element: bubbleMenu,
          shouldShow: ({ editor, state, from, to }) => {
            if (from === to) return false;
            requestAnimationFrame(() => {
              editor.commands.setMeta("bubbleMenu", "updatePosition");
            });
            return true;
          },
        }),
      ],
      content: isCode
        ? {
            type: "doc",
            content: [
              {
                type: "codeBlock",
                content: [{ type: "text", text: content ?? "" }],
              },
            ],
          }
        : content,
      onUpdate({ editor }) {
        content = editor.getHTML();
        oninput();
      },
      onTransaction: () => {
        editorState = { editor: editorState.editor };
      },
    });
  });

  onDestroy(() => {
    editorState.editor?.destroy();
  });

  export function focus() {
    editorState.editor?.commands.focus();
  }
</script>

<div style="position: relative;">
  <div class="bubble-menu" bind:this={bubbleMenu}>
    {#if editorState.editor}
      <button
        onclick={() => editorState.editor?.chain().focus().toggleBold().run()}
        class:active={editorState.editor?.isActive("bold")}
        title="Bold (Cmd+B)"
      >
        <b>B</b>
      </button>
      <button
        onclick={() => editorState.editor?.chain().focus().toggleItalic().run()}
        class:active={editorState.editor?.isActive("italic")}
        title="Italic (Cmd+I)"
      >
        <i>I</i>
      </button>
      <button
        onclick={() => editorState.editor?.chain().focus().toggleCode().run()}
        class:active={editorState.editor?.isActive("code")}
        title="Code (Cmd+E)"
      >
        <span class="mono">&lt;/&gt;</span>
      </button>
      <span class="divider"></span>
      <button
        onclick={() => {
          if (editorState.editor?.isActive("link")) {
            editorState.editor.chain().focus().unsetLink().run();
          } else {
            const url = prompt("URL");
            if (url) {
              editorState.editor?.chain().focus().setLink({ href: url }).run();
            }
          }
        }}
        class:active={editorState.editor?.isActive("link")}
        title="Link (Cmd+K)"
      >
        🔗
      </button>
    {/if}
  </div>
  <div bind:this={element}></div>
</div>

<style>
  div {
    margin: 0;
    width: 100%;
  }

  .bubble-menu {
    display: flex;
    position: absolute;
    gap: 2px;
    visibility: hidden;
    opacity: 0;
    z-index: 50;
    transition:
      visibility 0.1s ease,
      opacity 0.1s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    background: #1e1e1e;
    padding: 4px;

    .divider {
      margin: 0 4px;
      background: #444;
      width: 1px;
      height: 16px;
    }

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.1s ease;
      cursor: pointer;
      margin: 0;
      border: none;
      border-radius: 5px;
      background: transparent;
      padding: 0 6px;
      min-width: 28px;
      height: 28px;
      color: #999;
      font-size: 13px;

      &:hover {
        background: #333;
        color: #fff;
      }

      &.active {
        background: #4a9eff;
        color: #fff;
      }

      .mono {
        font-size: 11px;
        font-family: monospace;
      }
    }
  }
</style>
