/**
 * @typedef {import('mdast').Text} Text
 * @typedef {import('../types').Handle} Handle
 */

import { safe } from '../util/safe';

/**
 * @type {Handle}
 * @param {Text} node
 */
export function text(node, _, context, safeOptions) {
  return safe(context, node.value, safeOptions);
}
