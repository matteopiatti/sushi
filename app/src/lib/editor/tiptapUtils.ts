import { Extension } from "@tiptap/core";
import Document from "@tiptap/extension-document";
import { Plugin, PluginKey } from "@tiptap/pm/state";

export const SingleBlockDocument = Document.extend({
  content: "block",
});

export const SushiExtension = Extension.create({
  name: "sushiExtension",

  addOptions() {
    return {
      onEnterAtEnd: () => {},
      onBackspaceAtStart: () => {},
      onArrowUpAtStart: () => {},
      onArrowDownAtEnd: () => {},
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        const { from } = this.editor.state.selection;
        const end = this.editor.state.doc.content.size;
        const blockType = this.editor.state.doc.resolve(
          this.editor.state.selection.from,
        ).parent.type.name;

        if (from >= end - 2 && blockType !== "codeBlock") {
          this.options.onEnterAtEnd();
          return true;
        }
        return false;
      },
      Backspace: () => {
        const { from } = this.editor.state.selection;
        if (from <= 2 && this.editor.isEmpty) {
          this.options.onBackspaceAtStart();
          return true;
        }
        return false;
      },
      ArrowUp: () => {
        const { from } = this.editor.state.selection;
        if (from <= 2) {
          this.options.onArrowUpAtStart();
          return true;
        }
        return false;
      },
      ArrowDown: () => {
        const { from } = this.editor.state.selection;
        const end = this.editor.state.doc.content.size;
        if (from >= end - 2) {
          this.options.onArrowDownAtEnd();
          return true;
        }
        return false;
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("sushiLinks"),
        props: {
          handleClick(view, pos, event) {
            if (!(event.metaKey || event.ctrlKey)) return false;
            const link = (event.target as HTMLElement).closest("a");
            if (!link) return false;
            window.open(link.href, "_blank");
            return true;
          },
        },
      }),
    ];
  },
});
