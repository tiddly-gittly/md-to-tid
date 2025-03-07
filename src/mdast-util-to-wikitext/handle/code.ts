import type { Code } from 'mdast';
import type { Context, Exit, SafeOptions } from '../types';

import { longestStreak } from 'longest-streak';
import { formatCodeAsIndented } from '../util/format-code-as-indented';
import { indentLines, type Map } from '../util/indent-lines';

export function code(node: Code, parent: unknown, context: Context, safeOptions: SafeOptions): string {
  const marker = context.options.fence || '`';
  if (marker !== '`' && marker !== '~') throw new Error('Cannot serialize code with `' + marker + '` for `options.fence`, expected `` ` `` or `~`');

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
      value += node.lang;
      subexit();
    }

    if (node.lang && node.meta) {
      subexit = context.enter('codeFencedMeta' + suffix);
      value += ' ' + node.meta;
      subexit();
    }

    value += '\n';
    if (raw !== '') value += raw + '\n';
    value += sequence;
  }

  exit();
  return value;
}

const map: Map = function map(line, blank) {
  return (blank ? '' : '    ') + line;
};
