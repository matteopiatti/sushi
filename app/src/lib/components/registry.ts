import Default from "./Default.svelte";
import Image from "$lib/components/Image.svelte";
import Code from "$lib/components/Code.svelte";
import Text from "$lib/components/Text.svelte";
import Frontmatter from "$lib/components/Frontmatter.svelte";
import Link from "$lib/components/Link.svelte";
import ContainerComponent from "$lib/components/ContainerComponent.svelte";
import TextComponent from "$lib/components/TextComponent.svelte";

import { createRawSnippet } from "svelte";

interface Registry {
  [key: string]: any;
}

export const registry: Registry = {
  heading: Default,
  root: Default,
  list: Default,
  html: Default,
  blockquote: Default,
  plainText: Default,
  listItem: Default,
  inlineCode: Default,
  paragraph: Default,
  strong: Default,
  emphasis: Default,
  componentContainerSection: Default,
  thematicBreak: Default,
  yaml: Frontmatter,
  code: Code,
  textComponent: TextComponent,
  image: Image,
  link: Link,
  containerComponent: ContainerComponent,
  text: Text,
  break: Default,
  spacer: createRawSnippet(() => ({
    render: () => `<div aria-hidden="true" style="height:1lh"></div>`,
  })),
};
