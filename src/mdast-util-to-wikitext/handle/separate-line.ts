import type { ThematicBreak } from 'mdast';
import type { Context } from '../types';

export function separateLine(node: ThematicBreak, parent: unknown, context: Context): string {
  const marker = context.options.separateLineMarker || '-';
  if (marker !== '*' && marker !== '-' && marker !== '_') {
    throw new Error('Cannot serialize rules with `' + marker + '` for `options.rule`, expected `*`, `-`, or `_`');
  }
  const minimum = 3;
  const repetition = context.options.separateLineRepetition ?? minimum;
  if (repetition < minimum) {
    throw new Error('Cannot serialize rules with repetition `' + repetition + '` for `options.separateLineRepetition`, expected `' + minimum + '` or more');
  }
  const value = (marker + (context.options.separateLineSpaces ? ' ' : '')).repeat(repetition);
  return context.options.separateLineSpaces ? value.slice(0, -1) : value;
}
