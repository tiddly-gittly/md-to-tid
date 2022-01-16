import type { HTML } from 'mdast';
import type { Context, Exit, Parent, SafeOptions } from '../types';

html.peek = htmlPeek;

export function html(node: HTML, parent: Parent | null | undefined, context: Context, safeOptions: SafeOptions) {
  return node.value || '';
}

function htmlPeek(node: HTML, parent: Parent | null | undefined, context: Context, safeOptions: SafeOptions) {
  return '<';
}
