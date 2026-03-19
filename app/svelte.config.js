import adapter from "@sveltejs/adapter-auto";
import { resolve } from "path";

const userCwd = process.env.CMS_USER_CWD;

export default {
  kit: {
    adapter: adapter(),
    files: {
      assets: resolve(userCwd, "static"),
    },
    alias: {
      $functions: resolve(userCwd, "functions"),
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
