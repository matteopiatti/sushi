import { command } from "$app/server";
import fs from "fs";
import path from "path";
import { serializeTree } from "$lib/utils";

const contentDir = process.env.CMS_USER_CWD + "/content";

export const saveTree = command(
  "unchecked",
  async (input: { slug: string; tree: any }) => {
    const { slug, tree } = input;
    const filePath = path.join(
      contentDir,
      slug === "index" ? "" : slug,
      "page.md",
    );
    fs.writeFileSync(filePath, await serializeTree(tree), "utf-8");
  },
);
