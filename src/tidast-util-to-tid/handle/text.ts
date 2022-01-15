import type { Text } from 'mdast';
import type { Context, Parent, SafeOptions } from '../types';

import { safe } from '../util/safe';

export function text(node: Text, parent: Parent | null | undefined, context: Context, safeOptions: SafeOptions): string {
  return safe(context, node.value, safeOptions);
}
