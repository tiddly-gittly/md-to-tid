import type { Context, Options } from '../types';

export function checkEmphasis(context: Context): Exclude<Options['emphasis'], undefined> {
  const marker = context.options.emphasis ?? `''`;

  if (marker !== `''` && marker !== '_') {
    throw new Error(`Cannot serialize emphasis with ${marker} for options.emphasis, expected  \`''\`, or \`_\``);
  }

  return marker;
}
