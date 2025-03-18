import { Blockquote, Parents } from 'mdast';
import { Info, Map, State } from '../types';

export function blockquote(node: Blockquote, _: Parents | undefined, state: State, info: Info): string {
  const exit = state.enter('blockquote');
  const tracker = state.createTracker(info);
  tracker.move('> ');
  tracker.shift(2);
  const value = state.indentLines(state.containerFlow(node, tracker.current()), map);
  exit();
  return value;
}

const map: Map = function map(line, _, blank) {
  return '>' + (blank ? '' : ' ') + line;
};
