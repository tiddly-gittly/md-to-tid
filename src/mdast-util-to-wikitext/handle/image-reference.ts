import type { ImageReference } from 'mdast';
import type { Context } from '../types';

import { association } from '../util/association';
import { safe } from '../util/safe';

imageReference.peek = imageReferencePeek;

export function imageReference(node: ImageReference, _: unknown, context: Context) {
  const type = node.referenceType;
  const exit = context.enter('imageReference');
  let subexit = context.enter('label');
  const alt = safe(context, node.alt, { before: '[', after: ']' });
  let value = '![' + alt + ']';

  subexit();
  // Hide the fact that we’re in phrasing, because escapes don’t work.
  const stack = context.stack;
  context.stack = [];
  subexit = context.enter('reference');
  const reference = safe(context, association(node), { before: '[', after: ']' });
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

/**
 * @type {Handle}
 */
function imageReferencePeek() {
  return '!';
}
