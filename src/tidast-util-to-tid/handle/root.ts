/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('../types').Handle} Handle
 */

import { containerFlow } from '../util/container-flow';

/**
 * @type {Handle}
 * @param {Root} node
 */
export function root(node, _, context) {
  return containerFlow(node, context);
}
