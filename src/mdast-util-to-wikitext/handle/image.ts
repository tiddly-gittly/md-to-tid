import type { Image } from 'mdast';
import type { Context } from '../types';

export function image(node: Image, parent: unknown, context: Context): string {
  //   return '[img[';peek
  const exit = context.enter('image');
  let subexit = context.enter('label');
  /**
   * Use alt as tooltip first, if no alt provided, use title instead.
   */
  let value = '[img[';
  const tooltip = node.alt ?? node.title;
  const separateLine = tooltip ? '|' : '';
  value += `${tooltip}${separateLine}`;

  subexit();

  if (/[\0- \u007F]/.test(node.url)) {
    // If there are control characters or whitespace.
    subexit = context.enter('destinationLiteral');
  } else {
    // No whitespace, raw is prettier.
    subexit = context.enter('destinationRaw');
  }
  value += node.url;
  subexit();

  value += ']]';
  exit();
  return value;
}
