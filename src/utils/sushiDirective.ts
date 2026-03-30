import { visit } from "unist-util-visit";
import type { Processor } from "unified";
import type { Node, Parent } from "unist";
import type { Paragraph, PhrasingContent, Text } from "mdast";

declare module "unified" {
  interface Data {
    toMarkdownExtensions?: any[];
  }
}

interface SpacerNode extends Node {
  type: "spacer";
}

interface PlainTextNode extends Parent {
  type: "plainText";
  children: PhrasingContent[];
}

interface LayoutChildrenNode extends Node {
  type: "layoutChildren";
}

type SushiNode = SpacerNode | PlainTextNode | LayoutChildrenNode;

interface ToMarkdownState {
  containerPhrasing: (
    node: Parent,
    info: { before: string; after: string },
  ) => string;
}

interface ToMarkdownInfo {
  before: string;
  after: string;
}

export default function sushiDirective(
  this: Processor,
  { layout }: { layout: boolean },
) {
  const data = this.data();
  const handlers = data.toMarkdownExtensions ?? [];
  handlers.push({
    handlers: {
      spacer: (): string => "+++",
      plainText(
        node: PlainTextNode,
        _parent: Parent,
        state: ToMarkdownState,
        info: ToMarkdownInfo,
      ): string {
        const content = state.containerPhrasing(node, {
          before: info.before,
          after: info.after,
        });
        return `-> ${content}`;
      },
      layoutChildren: (): string => "@CONTENT",
    },
  });
  data.toMarkdownExtensions = handlers;

  return (tree: Node) => {
    visit(
      tree,
      "paragraph",
      (
        node: Paragraph,
        index: number | undefined,
        parent: Parent | undefined,
      ) => {
        if (!parent || index == null) return;
        if (!node.children?.length) return;

        const text = node.children
          .filter((c): c is Text => c.type === "text")
          .map((c) => c.value)
          .join("")
          .trim();

        if (text === "+++") {
          (parent.children as SushiNode[])[index] = { type: "spacer" };
        } else if (text.startsWith("->")) {
          const children = structuredClone(node.children);
          (children[0] as Text).value = (children[0] as Text).value.slice(3);
          (parent.children as SushiNode[])[index] = {
            type: "plainText",
            children,
          };
        } else if (text.startsWith("@CONTENT") && layout) {
          (parent.children as SushiNode[])[index] = { type: "layoutChildren" };
        }
      },
    );
  };
}
