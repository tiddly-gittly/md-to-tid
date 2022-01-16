import type { Root } from 'mdast';
import type { Context, Parent, SafeOptions } from '../types';

import { containerFlow } from '../util/container-flow';

export function root(node: Root, parent: Parent | null | undefined, context: Context, safeOptions: SafeOptions) {
  return containerFlow(node, context);
}
