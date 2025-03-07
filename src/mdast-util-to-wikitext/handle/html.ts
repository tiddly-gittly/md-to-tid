import type { Html } from 'mdast';
import type { Context, SafeOptions } from '../types';

export function html(node: Html, parent: unknown, context: Context, safeOptions: SafeOptions): string {
  //    return '<';peek
  return node.value || '';
}
