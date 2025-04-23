import { fromMarkdown } from 'mdast-util-from-markdown';

import { toTid } from './mdast-util-to-wikitext';
import { Options } from './mdast-util-to-wikitext/types';
import { gfmTableFromMarkdown } from 'mdast-util-gfm-table';
import { gfmTable } from 'micromark-extension-gfm-table';
import { frontmatter } from 'micromark-extension-frontmatter';
import { Root } from 'mdast';
import { gfmFootnote } from 'micromark-extension-gfm-footnote';
import { gfmFootnoteFromMarkdown } from 'mdast-util-gfm-footnote';
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter';

export type IOptions = Omit<Options, 'extensions'>;

export function md2tid(markdownString: string): string {
  let tree: Root = fromMarkdown(markdownString, {
    extensions: [gfmTable(), gfmFootnote(), frontmatter(['yaml', 'toml'])],
    mdastExtensions: [gfmTableFromMarkdown(), gfmFootnoteFromMarkdown(), frontmatterFromMarkdown(['yaml', 'toml'])],
  });
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
