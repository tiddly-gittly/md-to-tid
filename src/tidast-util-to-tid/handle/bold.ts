import type { Strong } from 'mdast';
import type { Context, Parent, SafeOptions } from '../types';

import { checkStrong } from '../util/check-strong';
import { containerPhrasing } from '../util/container-phrasing';

bold.peek = boldPeek;

export function bold(node: Strong, parent: Parent | null | undefined, context: Context, safeOptions: SafeOptions) {
  const marker = checkStrong(context);
  const exit = context.enter('strong');
  const value = containerPhrasing(node, context, {
    before: marker,
    after: marker,
  });
  exit();
  return marker + value + marker;
}

/**
 * @type {Handle}
 * @param {Strong} _
 */
function boldPeek(_: Strong, parent: Parent | null | undefined, context: Context, safeOptions: SafeOptions) {
  return context.options.strong || `''`;
}
