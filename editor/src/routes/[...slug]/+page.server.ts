import fs from "fs";
import path from "path";
import { generateTree } from "$utils/utils";

const contentDir = process.env.CMS_USER_CWD + "/content";

export async function load({ params }) {
  const slug = params.slug === "index" ? "" : params.slug;
  const filePath = path.join(contentDir, slug, "page.md");
  const content = fs.readFileSync(filePath, "utf-8");
  const tree = await generateTree(content);
  return { slug: params.slug, content, tree };
}
