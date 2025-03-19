import { fromMarkdown } from 'mdast-util-from-markdown';

import { toTid } from './mdast-util-to-wikitext';
import { Options } from './mdast-util-to-wikitext/types';
import { gfm } from 'micromark-extension-gfm';
import { Root } from 'mdast';

export type IOptions = Omit<Options, 'extensions'>;

export function md2tid(markdownString: string): string {
  let tree: Root = fromMarkdown(markdownString, { extensions: [gfm()] });
  return toTid(tree, {});
}

export function toString(value: any, options: IOptions): string {
  if (typeof value === 'string') {
    value = { type: 'paragraph', children: [{ type: 'text', value }] };
  }

  if (value.type !== 'root') {
    value = { type: 'root', children: [value] };
  }

  return toTid(value, options);
}
