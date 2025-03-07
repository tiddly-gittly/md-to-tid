import { fromMarkdown } from 'mdast-util-from-markdown';

import { type Options as IToMarkdownOptions, toTid } from './mdast-util-to-wikitext';
import { gfm } from 'micromark-extension-gfm';
import { Root } from 'mdast';

export type IOptions = Omit<IToMarkdownOptions, 'extensions'>;

export function md2tid(markdownString: string): string {
  let tree: Root = fromMarkdown(markdownString, { extensions: [gfm()] });
  return toTid(tree);
}

export function toString(value: any, options: IOptions): string {
  if (typeof value === 'string') {
    value = { type: 'paragraph', children: [{ type: 'text', value }] };
  }

  if (value.type !== 'root') {
    value = { type: 'root', children: [value] };
  }

  return toTid(value);
}
// md2tid("## Hello, *World*!")
