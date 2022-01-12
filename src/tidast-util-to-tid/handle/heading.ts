import type { Heading } from 'mdast';
import type { Context } from '../types';

import { formatHeadingAsSetext } from '../util/format-heading-as-setext';
import { containerPhrasing } from '../util/container-phrasing';

export function heading(node: Heading, _: unknown, context: Context) {
  const rank = Math.max(Math.min(6, node.depth || 1), 1);

  if (formatHeadingAsSetext(node, context)) {
    const exit = context.enter('headingSetext');
    const subexit = context.enter('phrasing');
    const value = containerPhrasing(node, context, { before: '\n', after: '\n' });
    subexit();
    exit();

    return (
      value +
      '\n' +
      (rank === 1 ? '=' : '-').repeat(
        // The whole size…
        value.length -
          // Minus the position of the character after the last EOL (or
          // 0 if there is none)…
          (Math.max(value.lastIndexOf('\r'), value.lastIndexOf('\n')) + 1),
      )
    );
  }

  const sequence = '!'.repeat(rank);
  const exit = context.enter('headingAtx');
  const subexit = context.enter('phrasing');
  let value = containerPhrasing(node, context, { before: '! ', after: '\n' });

  if (/^[\t ]/.test(value)) {
    value = '&!x' + value.charCodeAt(0).toString(16).toUpperCase() + ';' + value.slice(1);
  }

  value = value ? sequence + ' ' + value : sequence;

  if (context.options.closeAtx) {
    value += ' ' + sequence;
  }

  subexit();
  exit();

  return value;
}
