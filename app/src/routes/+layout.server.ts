import type { PageServerLoad } from "./$types";

import { contentDir } from "sushi:imports";
import path from "node:path";
import fs from "node:fs";

export const load: PageServerLoad = () => {
  const folderPath = path.resolve(contentDir);

  return {
    layoutContent: getLayoutContent(folderPath),
  };
};

function getPageContentFromPath(
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

function getLayoutContent(folderPath: string): string {
  try {
    return getPageContentFromPath(folderPath, "", "layout.md");
  } catch {
    return "";
  }
}
