import fs from "fs";
import path from "path";
import remarkParse from "remark-parse";
import remarkMDC from "remark-mdc";
import remarkFrontmatter from "remark-frontmatter";
import remarkBreaks from "remark-breaks";
import { unified } from "unified";
import sushiDirective from "./sushiDirective";
import remarkStringify from "remark-stringify";
import rehypeParse from "rehype-parse";
import { toMdast } from "hast-util-to-mdast";
import { toHtml } from "hast-util-to-html";
import { toHast } from "mdast-util-to-hast";
import { visit } from "unist-util-visit";

export function getPageContentFromPath(
  folderPath: string,
  filePath: string,
  fileName = "page.md",
): string {
  const fullPath = path.join(folderPath, filePath, fileName);

  if (!fs.existsSync(fullPath)) {
    throw new Error("Page Not Found");
  }

  const content = fs.readFileSync(fullPath, "utf8");
  return content;
}

export function generateTree(md: string, layout = false) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkMDC)
    .use(remarkBreaks)
    .use(sushiDirective, { layout });
  return processor.runSync(processor.parse(md));
}

export async function serializeTree(
  tree: any,
  layout = false,
): Promise<string> {
  const processor = unified()
    .use(sushiDirective, { layout })
    .use(remarkMDC)
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkStringify, {
      emphasis: "_",
      strong: "*",
      handlers: {
        strong(node, parent, state, info) {
          const exit = state.enter("strong");
          const value = state.containerPhrasing(node, {
            before: "**",
            after: "**",
            ...info,
          });
          exit();
          return `**${value}**`;
        },
      },
    });

  const file = processor.stringify(tree);
  return String(file);
}

export function htmlToMdastChildren(html: string): any[] {
  const hast = unified().use(rehypeParse, { fragment: true }).parse(html);
  const mdast = toMdast(hast);
  visit(mdast, (node) => {
    if (!node._key) node._key = crypto.randomUUID();
  });
  return mdast.children ?? [];
}

export function mdastNodeToHtml(node: any): string {
  const hast = toHast(node);
  return toHtml(hast);
}

export function getPages(dir: string, base = ""): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const pages: string[] = [];
  for (const entry of entries) {
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      pages.push(...getPages(path.join(dir, entry.name), rel));
    } else if (entry.name === "page.md") {
      pages.push(base || "index");
    }
  }
  return pages.sort((a, b) => (a === "index" ? -1 : 0));
}
