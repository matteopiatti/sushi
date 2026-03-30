#!/usr/bin/env node
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createServer, build } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, "../app");
const userCwd = process.cwd();
process.env.CMS_USER_CWD = userCwd;
process.env.PROJECT_ROOT = resolve(__dirname, "../");
process.env.SUSHI_EDITOR = false;

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
} else if (command === "editor") {
  process.chdir(appDir);
  process.env.SUSHI_EDITOR = true;
  const server = await createServer({
    root: appDir,
    configFile: resolve(appDir, "vite.config.ts"),
  });
  await server.listen();
  server.printUrls();
  printEditorUrl(server);
} else {
  console.log("Usage: sushi dev | sushi build | sushi editor");
}

function printEditorUrl(server) {
  // TODO: Update to also reflect if host is not localhost
  const port = server.httpServer?.address()?.port ?? 5173;
  const url = `http://localhost:${port}/__sushi_editor__`;
  console.log(`\n  🍣 sushi editor → \x1b[1m\x1b[36m${url}\x1b[0m\n`);
}
