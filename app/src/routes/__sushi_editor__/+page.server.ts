import path from "path";
import { getPageContentFromPath } from "$lib/utils.js";

const contentDir = process.env.CMS_USER_CWD + "/content";

export async function load({ url }) {
  const current = url.searchParams.get("current");
  const slug = path.normalize(
    current === "index" ? "." : current === null ? "." : current,
  );
  const pageContent = getPageContentFromPath(contentDir, slug);
  const layoutContent = getPageContentFromPath(contentDir, "", "layout.md");
  return { pageContent, layoutContent };
}
