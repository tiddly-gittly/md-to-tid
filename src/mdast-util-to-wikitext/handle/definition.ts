import type { Definition } from 'mdast';
import type { Context } from '../types';

import { association } from '../util/association';

export function definition(node: Definition, parent: unknown, context: Context): string {
  const exit = context.enter('definition');

  let subexit = context.enter('label');
  let value = '[' + association(node) + ']: ';
  subexit();

  if (!node.url || /[\0- \u007F]/.test(node.url)) {
    // If there’s no url, or…
    // If there are control characters or whitespace.
    subexit = context.enter('destinationLiteral');
    value += '<' + node.url + '>';
  } else {
    // No whitespace, raw is prettier.
    subexit = context.enter('destinationRaw');
    value += node.url;
  }
  subexit();

  exit();
  return value;
}
