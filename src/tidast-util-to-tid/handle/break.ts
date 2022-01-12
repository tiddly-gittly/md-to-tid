/**
 * @typedef {import('../types').Handle} Handle
 * @typedef {import('mdast').Break} Break
 */

import { patternInScope } from '../util/pattern-in-scope';

/**
 * @type {Handle}
 * @param {Break} _
 */
export function hardBreak(_, _1, context, safe) {
  let index = -1;

  while (++index < context.inConstruct.length) {
    // If we can’t put eols in this construct (setext headings, tables), use a
    // space instead.
    if (context.inConstruct[index].character === '\n' && patternInScope(context.stack, context.inConstruct[index])) {
      return /[ \t]/.test(safe.before) ? '' : ' ';
    }
  }

  return '\\\n';
}
