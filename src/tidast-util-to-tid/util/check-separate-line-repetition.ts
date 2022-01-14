import type { Context, Options } from '../types';

export function checkSeparateLineRepetition(context: Context): Exclude<Options['separateLineRepetition'], undefined> {
  const repetition = context.options.separateLineRepetition || 3;

  if (repetition < 3) {
    throw new Error('Cannot serialize rules with repetition `' + repetition + '` for `options.separateLineRepetition`, expected `3` or more');
  }

  return repetition;
}
