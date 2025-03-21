import { patternInScope } from '../util/pattern-in-scope';
import { Break, Parents } from 'mdast';
import { Info, State } from '../types';

// Break: (2个空格) or ··，一行的换行，它不像 \n，这个换行还是在之前的 Paragraph 内的
export function hardBreak(_: Break, _1: Parents | undefined, state: State, info: Info): string {
  let index = -1;

  while (++index < state.unsafe.length) {
    // 如果在当前结构（如 Setext 标题、表格）中不能使用换行符，则使用空格代替。
    if (state.unsafe[index].character === '\n' && patternInScope(state.stack, state.unsafe[index])) {
      return /[ \t]/.test(info.before) ? '' : ' ';
    }
  }

  return '\\\n';
}
