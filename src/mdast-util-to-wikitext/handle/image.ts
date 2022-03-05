import type { Image } from 'mdast';
import type { Context } from '../types';

import { safe } from '../util/safe';

image.peek = imagePeek;

export function image(node: Image, _: unknown, context: Context) {
  const exit = context.enter('image');
  let subexit = context.enter('label');
  /**
   * Use alt as tooltip first, if no alt provided, use title instead.
   */
  let value = '[img[';
  const tooltip = safe(context, node.alt ?? node.title, { before: '[', after: '|]' });
  const separateLine = tooltip ? '|' : '';
  value += `${tooltip}${separateLine}`;

  subexit();

  if (
    // If there are control characters or whitespace.
    /[\0- \u007F]/.test(node.url)
  ) {
    subexit = context.enter('destinationLiteral');
  } else {
    // No whitespace, raw is prettier.
    subexit = context.enter('destinationRaw');
  }
  value += safe(context, node.url, {
    before: '|',
    after: ']]',
  });

  subexit();

  value += ']]';
  exit();

  return value;
}

/**
 * @type {Handle}
 */
function imagePeek() {
  return '[img[';
}
