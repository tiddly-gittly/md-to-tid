import type { Code } from 'mdast';
import type { Context, Exit, Parent, SafeOptions } from '../types';

import { longestStreak } from 'longest-streak';
import { formatCodeAsIndented } from '../util/format-code-as-indented';
import { checkFence } from '../util/check-fence';
import { indentLines, Map } from '../util/indent-lines';
import { safe } from '../util/safe';

/**
 * @type {Handle}
 * @param {Code} node
 */
export function code(node: Code, parent: Parent | null | undefined, context: Context, safeOptions: SafeOptions) {
  const marker = checkFence(context);
  const raw = node.value || '';
  const suffix = marker === '`' ? 'GraveAccent' : 'Tilde';
  let value: string;
  let exit: Exit;

  if (formatCodeAsIndented(node, context)) {
    exit = context.enter('codeIndented');
    value = indentLines(raw, map);
  } else {
    const sequence = marker.repeat(Math.max(longestStreak(raw, marker) + 1, 3));
    let subexit: Exit;
    exit = context.enter('codeFenced');
    value = sequence;

    if (node.lang) {
      subexit = context.enter('codeFencedLang' + suffix);
      value += safe(context, node.lang, {
        before: '`',
        after: ' ',
        encode: ['`'],
      });
      subexit();
    }

    if (node.lang && node.meta) {
      subexit = context.enter('codeFencedMeta' + suffix);
      value +=
        ' ' +
        safe(context, node.meta, {
          before: ' ',
          after: '\n',
          encode: ['`'],
        });
      subexit();
    }

    value += '\n';

    if (raw) {
      value += raw + '\n';
    }

    value += sequence;
  }

  exit();
  return value;
}

const map: Map = function map(line, _, blank) {
  return (blank ? '' : '    ') + line;
};
