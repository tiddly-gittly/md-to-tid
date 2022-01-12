/**
 * @typedef {import('mdast').Blockquote} Blockquote
 * @typedef {import('../types').Handle} Handle
 * @typedef {import('../util/indent-lines').Map} Map
 */

import { containerFlow } from '../util/container-flow';
import { indentLines } from '../util/indent-lines';

/**
 * @type {Handle}
 * @param {Blockquote} node
 */
export function blockquote(node, _, context) {
  const exit = context.enter('blockquote');
  const value = indentLines(containerFlow(node, context), map);
  exit();
  return value;
}

/** @type {Map} */
function map(line, _, blank) {
  return '>' + (blank ? '' : ' ') + line;
}
