import type { Image } from 'mdast';
import type { Context } from '../types';

import { checkQuote } from '../util/check-quote';
import { safe } from '../util/safe';

image.peek = imagePeek;

export function image(node: Image, _: unknown, context: Context) {
  const quote = checkQuote(context);
  const suffix = quote === '"' ? 'Quote' : 'Apostrophe';
  const exit = context.enter('image');
  let subexit = context.enter('label');
  let value = '![' + safe(context, node.alt, { before: '[', after: ']' }) + '](';

  subexit();

  if (
    // If there’s no url but there is a title…
    (!node.url && node.title) ||
    // If there are control characters or whitespace.
    /[\0- \u007F]/.test(node.url)
  ) {
    subexit = context.enter('destinationLiteral');
    value += '<' + safe(context, node.url, { before: '<', after: '>' }) + '>';
  } else {
    // No whitespace, raw is prettier.
    subexit = context.enter('destinationRaw');
    value += safe(context, node.url, {
      before: '(',
      after: node.title ? ' ' : ')',
    });
  }

  subexit();

  if (node.title) {
    subexit = context.enter('title' + suffix);
    value += ' ' + quote + safe(context, node.title, { before: quote, after: quote }) + quote;
    subexit();
  }

  value += ')';
  exit();

  return value;
}

/**
 * @type {Handle}
 */
function imagePeek() {
  return '!';
}
