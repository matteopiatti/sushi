import { env } from "$env/dynamic/private";
import { getPages } from "$lib/utils";

const contentDir = env.CMS_USER_CWD + "/content";

export function load() {
  return {
    pages: getPages(contentDir),
  };
}
