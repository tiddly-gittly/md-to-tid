import { blockquote } from './blockquote';
import { hardBreak } from './break';
import { code } from './code';
import { definition } from './definition';
import { emphasis } from './emphasis';
import { heading } from './heading';
import { html } from './html';
import { image } from './image';
import { imageReference } from './image-reference';
import { inlineCode } from './inline-code';
import { link } from './link';
import { linkReference } from './link-reference';
import { list } from './list';
import { listItem } from './list-item';
import { paragraph } from './paragraph';
import { root } from './root';
import { bold } from './bold';
import { text } from './text';
import { thematicBreak } from './thematic-break';

/**
 * Default (CommonMark) handlers.
 */
export const handle = {
  blockquote,
  break: hardBreak,
  code,
  definition,
  emphasis,
  hardBreak,
  heading,
  html,
  image,
  imageReference,
  inlineCode,
  link,
  linkReference,
  list,
  listItem,
  paragraph,
  root,
  strong: bold,
  text,
  thematicBreak
}
