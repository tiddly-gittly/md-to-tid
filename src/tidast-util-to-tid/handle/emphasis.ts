import type { Emphasis } from 'mdast';
import type { Context } from '../types';
import { checkEmphasis } from '../util/check-emphasis';
import { containerPhrasing } from '../util/container-phrasing';

emphasis.peek = emphasisPeek;

export function emphasis(node: Emphasis, _: unknown, context: Context) {
  const marker = checkEmphasis(context);
  const exit = context.enter('emphasis');
  const value = containerPhrasing(node, context, {
    before: marker,
    after: marker,
  });
  exit();
  return marker + value + marker;
}

/**
 * @type {Handle}
 * @param {Emphasis} _
 */
function emphasisPeek(_: Emphasis, _1: unknown, context: Context) {
  return context.options.emphasis ?? `''`;
}
