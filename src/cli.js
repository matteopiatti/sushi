#!/usr/bin/env node
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createServer, build } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, "../app");
const userCwd = process.cwd();
process.env.CMS_USER_CWD = userCwd;

const command = process.argv[2];

if (command === "dev") {
  process.chdir(appDir);
  const server = await createServer({
    root: appDir,
    configFile: resolve(appDir, "vite.config.ts"),
  });
  await server.listen();
  server.printUrls();
} else if (command === "build") {
  process.chdir(appDir);
  await build({
    root: appDir,
    configFile: resolve(appDir, "vite.config.ts"),
  });
} else {
  console.log("Usage: sushi dev | sushi build");
}
