import { checkStrong } from '../util/check-strong.js';
import { encodeCharacterReference } from '../util/encode-character-reference.js';
import { encodeInfo } from '../util/encode-info.js';
import { Parents, Strong } from 'mdast';
import { Info, State } from '../types';

strong.peek = strongPeek;

export function strong(node: Strong, _: Parents | undefined, state: State, info: Info): string {
  const marker = checkStrong(state);
  const exit = state.enter('strong');
  const tracker = state.createTracker(info);
  const before = tracker.move(marker + marker);

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

  const after = tracker.move(marker + marker);

  exit();

  state.attentionEncodeSurroundingInfo = {
    after: close.outside,
    before: open.outside,
  };
  return before + between + after;
}

/**
 * @param {Strong} _
 * @param {Parents | undefined} _1
 * @param {State} state
 * @returns {string}
 */
function strongPeek(_: Strong, _1: Parents | undefined, state: State): string {
  return state.options.strong || '*';
}
