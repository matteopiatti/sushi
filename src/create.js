#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";

const projectName = process.argv[2];
if (!projectName) {
  console.log("Usage: npx create-sushi <project-name>");
  process.exit(1);
}

const root = resolve(process.cwd(), projectName);

console.log(`\n🍣  creating ${projectName}...\n`);

mkdirSync(resolve(root, "content"), { recursive: true });
mkdirSync(resolve(root, "blocks"), { recursive: true });
mkdirSync(resolve(root, "functions"), { recursive: true });
mkdirSync(resolve(root, "static"), { recursive: true });
console.log("✓  project structure created");

writeFileSync(
  resolve(root, "package.json"),
  JSON.stringify(
    {
      name: projectName,
      version: "0.0.1",
      type: "module",
      scripts: { dev: "cms dev", build: "cms build" },
      dependencies: {
        "sushi-cms": "latest",
        "@sveltejs/kit": "latest",
        svelte: "latest",
      },
    },
    null,
    2,
  ),
);
console.log("✓  package.json written");

writeFileSync(
  resolve(root, "content/layout.md"),
  `---
style: ["style.css"]
---

@CONTENT

MIT License - [Github](https://github.com/matteopiatti/sushi)
`,
);

writeFileSync(
  resolve(root, "content/layout.md"),
  `# Welcome to Sushi CMS 🍣

**This is a component:**

::hello
---
testProp: "Hello World"
---

#message
Hello from Frontend
::

***

> Edit content/page.md to see changes here.
`,
);

writeFileSync(
  resolve(root, "blocks/Hello.svelte"),
  `<script>
  import { getMessage } from "$functions/example.remote";

  const { message, testProp } = $props();
  $inspect(testProp);
</script>

<p>{@render message?.()}</p>
<p>{await getMessage()}</p>
`,
);

writeFileSync(
  resolve(root, "functions/example.remote.js"),
  `import { query } from "$app/server";

export const getMessage = query(async () => {
  return "Hello from server";
});
`,
);

writeFileSync(
  resolve(root, "static/style.css"),
  `*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg: #fafaf8;
  --surface: #f3f2ee;
  --border: #e8e6e0;
  --text: #1a1a18;
  --muted: #8a8880;
  --accent: #e8624a;
  --radius: 8px;
  --font: "Georgia", serif;
  --mono: "Courier New", monospace;
}

body {
  margin: 0 auto;
  background: var(--bg);
  padding: 4rem 2rem;
  max-width: 680px;
  color: var(--text);
  font-size: 18px;
  line-height: 1.8;
  font-family: var(--font);
}

h1 {
  margin-top: 2.5rem;
  margin-bottom: 0.75rem;
  font-weight: normal;
  line-height: 1.3;
}

h1 {
  font-size: 2.2rem;
}

p {
  margin-bottom: 1.25rem;
  color: var(--text);
}

a {
  transition: border-color 0.15s;
  border-bottom: 1px solid transparent;
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  border-bottom-color: var(--accent);
}

blockquote {
  margin: 1.5rem 0;
  border-left: 3px solid var(--accent);
  padding-left: 1.25rem;
  color: var(--muted);
  font-style: italic;
}

hr {
  margin: 2.5rem 0;
  border: none;
  border-top: 1px solid var(--border);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #181816;
    --surface: #222220;
    --border: #2e2e2c;
    --text: #f0ede8;
    --muted: #6a6a68;
  }
}
`,
);

console.log("✓  example files added");

console.log(`\n  ready! now run:\n`);
console.log(`  $ cd ${projectName}`);
console.log(`  $ npm install`);
console.log(`  $ npm run dev\n`);
