import type { Text } from 'mdast';
import type { Context, Parent, SafeOptions } from '../types';

export function text(node: Text, parent: unknown, context: Context, safeOptions: SafeOptions): string {
  return node.value;
}
