import type { Root } from 'mdast';
import type { Context, SafeOptions } from '../types';

import { containerFlow } from '../util/container-flow';

export function root(node: Root, parent: unknown, context: Context, safeOptions: SafeOptions): string {
  return containerFlow(node, context);
}
