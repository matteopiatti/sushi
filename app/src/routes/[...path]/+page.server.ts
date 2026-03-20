import type { PageServerLoad } from "./$types";
import { contentDir } from "sushi:imports";
import path from "path";
import { getPageContentFromPath } from "$lib/utils";

export const load: PageServerLoad = ({ params }) => {
  const normalizedPath = path.normalize(params.path);
  const folderPath = path.resolve(contentDir);

  try {
    return {
      pageContent: getPageContentFromPath(folderPath, normalizedPath),
    };
  } catch {
    try {
      return {
        pageContent: getPageContentFromPath(folderPath, "", "error.md"),
      };
    } catch {
      return {
        pageContent: "# 404 - Page Not Found",
      };
    }
  }
};
