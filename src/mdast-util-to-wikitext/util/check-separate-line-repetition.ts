import type { Context, Options } from '../types';

export function checkSeparateLineRepetition(context: Context): Exclude<Options['separateLineRepetition'], undefined> {
  const minimum = 3;
  const repetition = context.options.separateLineRepetition ?? minimum;

  if (repetition < minimum) {
    throw new Error('Cannot serialize rules with repetition `' + repetition + '` for `options.separateLineRepetition`, expected `' + minimum + '` or more');
  }

  return repetition;
}
