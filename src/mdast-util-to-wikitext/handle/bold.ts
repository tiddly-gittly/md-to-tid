import { checkBold } from '../util/check-bold';
import { Parents, Strong } from 'mdast';
import { Info, State } from '../types';

bold.peek = boldPeek;
// 在 TW 中，我们使用术语 "bold" 而不是 "strong" ，因为大多数用户已经习惯了。
// ... 呈现过程将我们的 "粗体文本" 转换为 STRONG HTML 元素。
export function bold(node: Strong, _: Parents | undefined, state: State, info: Info): string {
  const marker = checkBold(state);
  const exit = state.enter('bold');
  const tracker = state.createTracker(info);
  const before = tracker.move(marker);

  let between = tracker.move(
    state.containerPhrasing(node, {
      after: marker,
      before,
      ...tracker.current(),
    }),
  );

  const after = tracker.move(marker);

  exit();
  return before + between + after;
}

/**
 * @param {Strong} _
 * @param {Parents | undefined} _1
 * @param {State} state
 * @returns {string}
 */
function boldPeek(_: Strong, _1: Parents | undefined, state: State): string {
  return state.options.bold || `''`;
}
