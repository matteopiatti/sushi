import type { PageServerLoad } from "./$types";
import { contentDir } from "sushi:imports";
import { getPageContentFromPath } from "../../lib/utils";
import path from "node:path";
import fs from "node:fs";

export const load: PageServerLoad = () => {
  const folderPath = path.resolve(contentDir);

  try {
    return {
      layoutContent: getPageContentFromPath(folderPath, "", "layout.md"),
    };
  } catch {
    return {
      layoutContent: "",
    };
  }
};
