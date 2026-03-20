# 🍣 Sushi

A file-based Markdown CMS framework built on SvelteKit. Write markdown, build svelte components.

## Getting Started

```bash
npx create-sushi my-site
cd my-site
npm install
npm run dev
```

## Project Structure

```
my-site/
content/ ← markdown pages
blocks/ ← svelte components
functions/ ← remote functions
static/ ← images, fonts, assets
```

## Content

Pages are markdown files in `content/`. Typical filebase routing without catch-alls as of now.

```
content/page.md → /
content/about/page.md → /about
content/blog/page.md → /blog/hello
```

Layouts are support in the same file based style

```
content/layout.md → layout for all pages
content/blog/layout.md → layout for all blog pages
```

A layout.md needs this specific tag to render the page content at that position:

```markdown
@CONTENT
```

## Markdown

Frontmatter is supported. Blocks are Svelte components in `blocks/`, available in your markdown pages. As a remark parser nuxt remark-mdc is used, so their syntax applies. See [their docs](https://remark-mdc.nuxt.space/) for more.

All markdown is support but following extra syntax is available:

```markdown
-> plaintext, everything in here will be stripped of the default remark paragraph wrapper and rendered as plain text. Useful for components that should always have a h1, for example.

+++ spacer to add space between blocks. Otherwise paragraphs will be rendered with nothing between them. Spacer will render as a div like this: <div aria-hidden="true" style="height:1lh"></div>
```

## Remote Functions

Newer versions of SvelteKit support remote functions, which are server functions that can be called from the client.
Server functions live in `functions/` — use them for forms, data queries and more via `$functions/example.remote`. See [SvelteKit docs](https://svelte.dev/docs/kit/remote-functions) for more.

## Roadmap

Nice thing to have would be some kind of visual editor for the markdown. Not everyone understands markdown syntax and especiallöy the mdc and custom syntax can be confusing.

## License

MIT
