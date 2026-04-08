import { Extension } from "@tiptap/core";
import Document from "@tiptap/extension-document";

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
        if (from >= end - 2) {
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
});
