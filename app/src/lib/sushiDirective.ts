import { visit } from "unist-util-visit";

export default function sushiDirective({ layout }: { layout: Boolean }) {
  return (tree) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (!parent || index == null) return;
      if (!node.children?.length) return;

      const text = node.children
        .filter((c) => c.type === "text")
        .map((c) => c.value)
        .join("")
        .trim();

      if (text === "+++") {
        parent.children[index] = {
          type: "spacer",
        };
        return;
      } else if (text.startsWith("->")) {
        const children = structuredClone(node.children);
        children[0].value = children[0].value.slice(3);
        parent.children[index] = {
          type: "plainText",
          children,
        };
        return;
      } else if (text.startsWith("@CONTENT") && layout) {
        parent.children[index] = {
          type: "layoutChildren",
        };
      } else {
        return;
      }
    });
  };
}
