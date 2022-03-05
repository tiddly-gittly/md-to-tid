import type { Context, Options } from '../types';

export function checkFence(context: Context): Exclude<Options['fence'], undefined> {
  const marker = context.options.fence || '`';

  if (marker !== '`' && marker !== '~') {
    throw new Error('Cannot serialize code with `' + marker + '` for `options.fence`, expected `` ` `` or `~`');
  }

  return marker;
}
