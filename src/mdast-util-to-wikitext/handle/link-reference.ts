import type { LinkReference } from 'mdast';
import type { Context, SafeOptions } from '../types';

import { association } from '../util/association';
import { containerPhrasing } from '../util/container-phrasing';

export function linkReference(node: LinkReference, parent: unknown, context: Context, safeOptions: SafeOptions): string {
  // return '[';peek
  const type = node.referenceType;
  const exit = context.enter('linkReference');
  let subexit = context.enter('label');
  const text = containerPhrasing(node, context, { before: '[', after: ']' });
  let value = '[' + text + ']';

  subexit();
  // Hide the fact that we’re in phrasing, because escapes don’t work.
  const stack = context.stack;
  context.stack = [];
  subexit = context.enter('reference');
  const reference = association(node);
  subexit();
  context.stack = stack;
  exit();

  if (type === 'full' || !text || text !== reference) {
    value += '[' + reference + ']';
  } else if (type !== 'shortcut') {
    value += '[]';
  }

  return value;
}
