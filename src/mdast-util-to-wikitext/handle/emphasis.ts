import { checkEmphasis } from '../util/check-emphasis';
import { encodeCharacterReference } from '../util/encode-character-reference';
import { encodeInfo } from '../util/encode-info';
import { Info, State } from '../types';
import { Emphasis, Parents } from 'mdast';

emphasis.peek = emphasisPeek;

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
  const betweenHead = between.charCodeAt(0);
  const open = encodeInfo(info.before.charCodeAt(info.before.length - 1), betweenHead, marker);

  if (open.inside) {
    between = encodeCharacterReference(betweenHead) + between.slice(1);
  }

  const betweenTail = between.charCodeAt(between.length - 1);
  const close = encodeInfo(info.after.charCodeAt(0), betweenTail, marker);

  if (close.inside) {
    between = between.slice(0, -1) + encodeCharacterReference(betweenTail);
  }

  const after = tracker.move(marker);

  exit();

  state.attentionEncodeSurroundingInfo = {
    after: close.outside,
    before: open.outside,
  };
  return before + between + after;
}

function emphasisPeek(_: Emphasis, _1: Parents | undefined, state: State): string {
  return state.options.emphasis || '*';
}
