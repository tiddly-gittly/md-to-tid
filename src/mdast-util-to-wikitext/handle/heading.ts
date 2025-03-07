import type { Heading } from 'mdast';
import type { Context } from '../types';

import { containerPhrasing } from '../util/container-phrasing';

export function heading(node: Heading, parent: unknown, context: Context): string {
  const rank = Math.max(Math.min(6, node.depth || 1), 1);

  const sequence = '!'.repeat(rank);
  const exit = context.enter('headingAtx');
  const subexit = context.enter('phrasing');
  let value = containerPhrasing(node, context, { before: '! ', after: '\n' });
  value = value ? sequence + ' ' + value : sequence;
  /**
   * Atx-style headers may be optionally closed by adding trailing pound signs, which are ignored.
   * ==This is a level 2 header with some trailing slashes==`
   */
  if (context.options.closeAtx) value += ' ' + sequence;

  subexit();
  exit();

  return value;
}
