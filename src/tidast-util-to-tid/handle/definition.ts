import type { Definition } from 'mdast';
import type { Context } from '../types';

import { association } from '../util/association';
import { safe } from '../util/safe';

export function definition(node: Definition, _: unknown, context: Context) {
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
