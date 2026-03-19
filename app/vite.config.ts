import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { sushi } from "../src/plugin";

export default defineConfig({
  plugins: [sveltekit(), sushi(process.env.CMS_USER_CWD!)],
});
