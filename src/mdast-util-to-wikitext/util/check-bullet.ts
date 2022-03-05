import type { Context, Options } from '../types';

export function checkBullet(context: Context): Exclude<Options['bullet'], undefined> {
  const marker = context.options.bullet || '*';

  if (marker !== '*' && marker !== '+' && marker !== '-') {
    throw new Error('Cannot serialize items with `' + marker + '` for `options.bullet`, expected `*`, `+`, or `-`');
  }

  return marker;
}
