import type { ThematicBreak } from 'mdast';
import type { Context } from '../types';
import { checkSeparateLineRepetition } from '../util/check-separate-line-repetition';
import { checkSeparateLineMarker } from '../util/check-separate-line-marker';

export function separateLine(_: ThematicBreak, _1: unknown, context: Context) {
  const marker = checkSeparateLineMarker(context);
  const value = (marker + (context.options.separateLineSpaces ? ' ' : '')).repeat(checkSeparateLineRepetition(context));

  return context.options.separateLineSpaces ? value.slice(0, -1) : value;
}
