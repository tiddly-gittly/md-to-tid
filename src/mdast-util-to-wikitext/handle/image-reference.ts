import type { ImageReference } from 'mdast';
import type { Context } from '../types';

import { association } from '../util/association';

export function imageReference(node: ImageReference, parent: unknown, context: Context): string {
  //   return '!';peek
  const type = node.referenceType;
  const exit = context.enter('imageReference');
  let subexit = context.enter('label');
  const alt = node.alt;
  let value = '![' + alt + ']';
  subexit();

  // Hide the fact that we’re in phrasing, because escapes don’t work.
  const stack = context.stack;
  context.stack = [];
  subexit = context.enter('reference');
  const reference = association(node);
  subexit();
  context.stack = stack;
  exit();

  if (type === 'full' || !alt || alt !== reference) {
    value += '[' + reference + ']';
  } else if (type !== 'shortcut') {
    value += '[]';
  }

  return value;
}
