import fs from "fs";
import path from "path";
import remarkParse from "remark-parse";
import remarkMDC from "remark-mdc";
import remarkFrontmatter from "remark-frontmatter";
import remarkBreaks from "remark-breaks";
import { unified } from "unified";
import sushiDirective from "./sushiDirective";

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

export async function generateTree(md: string, layout = false) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkMDC)
    .use(remarkBreaks)
    .use(sushiDirective, { layout });
  return await processor.run(processor.parse(md));
}
