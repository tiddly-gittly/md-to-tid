import type { Context, Options } from '../types';

export function checkStrong(context: Context): Exclude<Options['strong'], undefined> {
  const marker = context.options.strong || `''`;

  if (marker !== `''` && marker !== '_') {
    throw new Error('Cannot serialize strong with `' + marker + '` for `options.strong`, expected `\'\'`, or `_`');
  }

  return marker;
}
