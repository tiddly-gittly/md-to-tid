/**
 * @typedef {import('mdast').Definition} Definition
 * @typedef {import('../types').Handle} Handle
 */

import { association } from '../util/association';
import { checkQuote } from '../util/check-quote';
import { safe } from '../util/safe';

/**
 * @type {Handle}
 * @param {Definition} node
 */
export function definition(node, _, context) {
  const marker = checkQuote(context);
  const suffix = marker === '"' ? 'Quote' : 'Apostrophe';
  const exit = context.enter('definition');
  let subexit = context.enter('label');
  let value = '[' + safe(context, association(node), { before: '[', after: ']' }) + ']: ';

  subexit();

  if (
    // If there’s no url, or…
    !node.url ||
    // If there are control characters or whitespace.
    /[\0- \u007F]/.test(node.url)
  ) {
    subexit = context.enter('destinationLiteral');
    value += '<' + safe(context, node.url, { before: '<', after: '>' }) + '>';
  } else {
    // No whitespace, raw is prettier.
    subexit = context.enter('destinationRaw');
    value += safe(context, node.url, { before: ' ', after: ' ' });
  }

  subexit();

  if (node.title) {
    subexit = context.enter('title' + suffix);
    value += ' ' + marker + safe(context, node.title, { before: marker, after: marker }) + marker;
    subexit();
  }

  exit();

  return value;
}
