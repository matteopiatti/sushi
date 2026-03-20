import { contentDir } from "sushi:imports";
import { getPageContentFromPath } from "../../lib/utils";
import path from "node:path";

export const load = () => {
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
