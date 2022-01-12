/**
 * @typedef {import('mdast').HTML} HTML
 * @typedef {import('../types').Handle} Handle
 */

html.peek = htmlPeek;

/**
 * @type {Handle}
 * @param {HTML} node
 */
export function html(node) {
  return node.value || '';
}

/**
 * @type {Handle}
 */
function htmlPeek() {
  return '<';
}
