import type { Blockquote } from 'mdast';
import type { Context } from '../types';
import { indentLines, type Map } from '../util/indent-lines';
import { containerFlow } from '../util/container-flow';

export function blockquote(node: Blockquote, _: unknown, context: Context): string {
  const exit = context.enter('blockquote');

  const map: Map = function map(line, blank) {
    return '>' + (blank ? '' : ' ') + line;
  };
  const value = indentLines(containerFlow(node, context), map);

  exit();
  return value;
}
