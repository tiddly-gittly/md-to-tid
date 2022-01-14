import type { ThematicBreak } from 'mdast';
import { checkSeparateLineRepetition } from '../util/check-separate-line-repetition';
import type { Context } from '../types';

export function separateLine(_: ThematicBreak, _1: unknown, context: Context) {
  const value = ((context.options.separateLineSpaces ?? '-') + (context.options.separateLineSpaces ? ' ' : '')).repeat(checkSeparateLineRepetition(context));

  return context.options.separateLineSpaces ? value.slice(0, -1) : value;
}
