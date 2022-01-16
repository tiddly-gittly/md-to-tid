import type { Context, Options } from '../types';

export function checkItalic(context: Context): Exclude<Options['italic'], undefined> {
  const marker = context.options.italic ?? `//`;

  if (marker !== `//` && marker !== '_') {
    throw new Error(`Cannot serialize italic with ${marker} for options.italic, expected  \`''\`, or \`_\``);
  }

  return marker;
}
