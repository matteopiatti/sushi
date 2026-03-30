import type { Plugin } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

export function sushi(userCwd: string): Plugin {
  const virtualModuleId = "sushi:imports";
  const resolvedVirtualModuleId = "\0" + virtualModuleId;
  const userDir = resolve(userCwd);

  return {
    name: "sushi-cms-plugin",

    configureServer(server) {
      // tell vite to watch the user's dirs
      server.watcher.add(resolve(userCwd, "content"));
      server.watcher.add(resolve(userCwd, "blocks"));
      server.watcher.add(resolve(userCwd, "functions"));

      // react to changes in those dirs
      server.watcher.on("change", (file) => {
        if (file.startsWith(userDir)) {
          if (process.env.SUSHI_EDITOR !== "true") {
            server.ws.send({ type: "full-reload" });
          }
        }
      });
    },

    config() {
      return {
        resolve: {
          alias: {
            "sushi:blocks": resolve(userCwd, "blocks"),
          },
        },
        server: {
          fs: {
            allow: [
              resolve(userCwd),
              resolve(userCwd, "node_modules"),
              resolve(__dirname, ".."),
            ],
          },
        },
      };
    },

    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },

    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `
          export const contentDir = ${JSON.stringify(resolve(userCwd, "content"))}
          export const blocksDir = ${JSON.stringify(resolve(userCwd, "blocks"))}
        `;
      }
    },
  };
}
