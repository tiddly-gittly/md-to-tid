import type { Blockquote } from 'mdast';
import type { Context } from '../types';
import { indentLines, Map } from '../util/indent-lines';
import { containerFlow } from '../util/container-flow';

export function blockquote(node: Blockquote, _: unknown, context: Context) {
  const exit = context.enter('blockquote');
  const value = indentLines(containerFlow(node, context), map);
  exit();
  return value;
}

const map: Map = function map(line, _, blank) {
  return '>' + (blank ? '' : ' ') + line;
}
