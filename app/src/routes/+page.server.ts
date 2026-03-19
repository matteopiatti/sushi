import type { PageServerLoad } from "./$types";
import { contentDir } from "sushi:imports";
import path from "node:path";
import fs from "node:fs";

export const load: PageServerLoad = ({ params }) => {
  const normalizedPath = path.normalize(params.path);
  const folderPath = path.resolve(contentDir);

  try {
    return {
      pageContent: getPageContentFromPath(folderPath, normalizedPath),
    };
  } catch {
    return {
      pageContent: get404PageContent(folderPath),
    };
  }
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

function get404PageContent(folderPath: string): string {
  try {
    return getPageContentFromPath(folderPath, "", "404.md");
  } catch {
    return "# 404 - Page Not Found";
  }
}
