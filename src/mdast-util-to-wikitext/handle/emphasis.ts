import { checkEmphasis } from '../util/check-emphasis';
import { Info, State } from '../types';
import { Emphasis, Parents } from 'mdast';

emphasis.peek = emphasisPeek;

// Emphasis: *alpha* _bravo_ 对应 html 中的 <em>
export function emphasis(node: Emphasis, _: Parents | undefined, state: State, info: Info): string {
  const marker = checkEmphasis(state);
  const exit = state.enter('emphasis');
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

function emphasisPeek(_: Emphasis, _1: Parents | undefined, state: State): string {
  return state.options.emphasis || '//';
}
