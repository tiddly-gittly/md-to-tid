import type { Strong } from 'mdast';
import type { Context, SafeOptions } from '../types';

import { containerPhrasing } from '../util/container-phrasing';

export function bold(node: Strong, parent: unknown, context: Context, safeOptions: SafeOptions): string {
  const marker = context.options.strong || `''`;
  if (marker !== `''` && marker !== '_') {
    throw new Error('Cannot serialize strong with `' + marker + "` for `options.strong`, expected `''`, or `_`");
  }

  const exit = context.enter('strong');

  const value = containerPhrasing(node, context, { before: marker, after: marker });

  exit();
  return marker + value + marker;
}
