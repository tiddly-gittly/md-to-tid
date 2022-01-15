import type { Break } from 'mdast';
import type { Context, Parent, SafeOptions } from '../types';
import { patternInScope } from '../util/pattern-in-scope';

export function hardBreak(node: Break, parent: Parent | null | undefined, context: Context, safeOptions: SafeOptions) {
  let index = -1;

  while (++index < context.inConstruct.length) {
    // If we can’t put eols in this construct (setext headings, tables), use a
    // space instead.
    if (context.inConstruct[index].character === '\n' && patternInScope(context.stack, context.inConstruct[index])) {
      return /[ \t]/.test(safeOptions.before) ? '' : ' ';
    }
  }

  return '\\\n';
}
