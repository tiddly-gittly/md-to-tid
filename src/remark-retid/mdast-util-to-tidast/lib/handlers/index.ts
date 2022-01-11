import type { MdastNode, TidastNode } from '..';

// Return nothing for nodes that are ignored.
function ignore(node: MdastNode): undefined {}
const passthrough: Handler = (item: MdastNode): TidastNode => {
  return item;
};
export type Handler = (node: MdastNode) => TidastNode | undefined;

export const handlers = {
  blockquote: passthrough,
  break: passthrough,
  code: passthrough,
  delete: passthrough,
  emphasis: passthrough,
  footnoteReference: passthrough,
  footnote: passthrough,
  heading: passthrough,
  html: passthrough,
  imageReference: passthrough,
  image: passthrough,
  inlineCode: passthrough,
  linkReference: passthrough,
  link: passthrough,
  listItem: passthrough,
  list: passthrough,
  paragraph: passthrough,
  root: passthrough,
  strong: passthrough,
  table: passthrough,
  text: passthrough,
  thematicBreak: passthrough,
  toml: ignore,
  yaml: ignore,
  definition: ignore,
  footnoteDefinition: ignore,
};
