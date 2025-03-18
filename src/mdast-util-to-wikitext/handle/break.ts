import { patternInScope } from '../util/pattern-in-scope';
import { Break, Parents } from 'mdast';
import { Info, State } from '../types';

export function hardBreak(_: Break, _1: Parents | undefined, state: State, info: Info): string {
  let index = -1;

  while (++index < state.unsafe.length) {
    // If we can’t put eols in this construct (setext headings, tables), use a
    // space instead.
    if (state.unsafe[index].character === '\n' && patternInScope(state.stack, state.unsafe[index])) {
      return /[ \t]/.test(info.before) ? '' : ' ';
    }
  }

  return '\\\n';
}
