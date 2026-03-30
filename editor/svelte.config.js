import adapter from "@sveltejs/adapter-auto";
import { resolve } from "path";

const userCwd = process.env.CMS_USER_CWD ?? process.cwd();
const projectRoot = process.env.PROJECT_ROOT ?? resolve(".");

export default {
  kit: {
    adapter: adapter(),
    alias: {
      $functions: resolve(userCwd, "functions"),
      $utils: resolve(projectRoot, "src/utils"),
    },
    experimental: {
      remoteFunctions: true,
    },
  },
  compilerOptions: {
    experimental: {
      async: true,
    },
  },
};
