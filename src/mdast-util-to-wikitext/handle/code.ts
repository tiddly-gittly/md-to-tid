import { longestStreak } from 'longest-streak';
import { formatCodeAsIndented } from '../util/format-code-as-indented.js';
import { checkFence } from '../util/check-fence.js';
import { Code, Parents } from 'mdast';
import { Info, Map, State } from '../types';

export function code(node: Code, _: Parents | undefined, state: State, info: Info): string {
  const marker = checkFence(state);
  const raw = node.value || '';
  const suffix = marker === '`' ? 'GraveAccent' : 'Tilde';

  if (formatCodeAsIndented(node, state)) {
    const exit = state.enter('codeIndented');
    const value = state.indentLines(raw, map);
    exit();
    return value;
  }

  const tracker = state.createTracker(info);
  // 重复次数为代码原始内容中标记字符最长连续出现次数加 1 和 3 中的较大值。
  // 例如，如果 marker 是 '`'，raw 是 被fence包裹的值，例如 a，
  // 那么 longestStreak(raw, marker) 会返回 1，加 1 后是 2，
  // 与 3 比较取较大值还是 3，所以 sequence 会是 '```'。
  const sequence = marker.repeat(Math.max(longestStreak(raw, marker) + 1, 3));
  const exit = state.enter('codeFenced');
  // sequence=```
  let value = tracker.move(sequence);

  if (node.lang) {
    const subexit = state.enter(`codeFencedLang${suffix}`);
    // sequence + lang + " "
    value += tracker.move(
      state.safe(node.lang, {
        before: value,
        after: ' ',
        encode: ['`'],
        ...tracker.current(),
      }),
    );
    subexit();
  }

  if (node.lang && node.meta) {
    const subexit = state.enter(`codeFencedMeta${suffix}`);
    // value = sequence + lang + " " + " "
    // value + node.meta + \n
    value += tracker.move(' ');
    value += tracker.move(
      state.safe(node.meta, {
        before: value,
        after: '\n',
        encode: ['`'],
        ...tracker.current(),
      }),
    );
    subexit();
  }

  value += tracker.move('\n');

  if (raw) {
    value += tracker.move(raw + '\n');
  }

  value += tracker.move(sequence);
  exit();
  return value;
}

const map: Map = function map(line, _, blank) {
  return (blank ? '' : '    ') + line
}
