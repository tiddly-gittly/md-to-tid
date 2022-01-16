import type { Break } from 'mdast';
import type { Context, Parent, SafeOptions } from '../types';
import { patternInScope } from '../util/pattern-in-scope';

export function hardBreak(node: Break, parent: Parent | null | undefined, context: Context, safeOptions: SafeOptions) {
  let index = -1;

  while (++index < context.conflict.length) {
    // If we can’t put eols in this construct (setext headings, tables), use a
    // space instead.
    if (context.conflict[index].character === '\n' && patternInScope(context.stack, context.conflict[index])) {
      return /[ \t]/.test(safeOptions.before) ? '' : ' ';
    }
  }

  return '\\\n';
}
