import fs from "fs";
import path from "path";

const contentDir = process.env.CMS_USER_CWD + "/content";

function getPages(dir: string, base = ""): string[] {
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
  return pages;
}

export function load() {
  return {
    pages: getPages(contentDir),
  };
}
