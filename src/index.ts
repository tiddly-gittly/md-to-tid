import { unified } from 'unified';
import { Root as MdastRoot, Content as MdastContent } from 'mdast';
import { IOptions, retidStringify } from './retid-stringify';
export * from './retid-stringify';

export function toString(value: MdastRoot | MdastContent | string, options: IOptions) {
  if (typeof value === 'string') {
    value = { type: 'paragraph', children: [{ type: 'text', value }] };
  }

  if (value.type !== 'root') {
    value = { type: 'root', children: [value] };
  }

  return unified().use(retidStringify, options).stringify(value);
}
