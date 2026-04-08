import { getPageContentFromPath } from "$lib/utils";
import { contentDir } from "sushi:imports";
import path from "path";

export const load = ({ params }: { params: Record<string, string> }) => {
  const normalizedPath = path.normalize(params.slug);
  const folderPath = path.resolve(contentDir);

  // do we need 404 here?
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
