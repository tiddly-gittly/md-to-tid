import type { Context, Options } from '../types';

export function checkQuote(context: Context): Exclude<Options['quote'], undefined> {
  const marker = context.options.quote || '"';

  if (marker !== '"' && marker !== "'") {
    throw new Error('Cannot serialize title with `' + marker + '` for `options.quote`, expected `"`, or `\'`');
  }

  return marker;
}
