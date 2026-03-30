import { command } from "$app/server";
import fs from "fs";
import path from "path";

const contentDir = process.env.CMS_USER_CWD + "/content";

export const savePage = command(
  "unchecked",
  async (input: { slug: string; content: string }) => {
    const { slug, content } = input;
    const filePath = path.join(
      contentDir,
      slug === "index" ? "" : slug,
      "page.md",
    );
    fs.writeFileSync(filePath, content, "utf-8");
  },
);
