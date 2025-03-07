import type { Emphasis } from 'mdast';
import type { Context } from '../types';
import { containerPhrasing } from '../util/container-phrasing';

export function italic(node: Emphasis, parent: unknown, context: Context): string {
  // return context.options.italic ?? `''`;peek
  const marker = context.options.italic ?? `//`;
  if (marker !== `//` && marker !== '_') throw new Error(`Cannot serialize italic with ${marker} for options.italic, expected  \`''\`, or \`_\``);

  const exit = context.enter('italic');
  const value = containerPhrasing(node, context, {
    before: marker,
    after: marker,
  });
  exit();
  return marker + value + marker;
}
