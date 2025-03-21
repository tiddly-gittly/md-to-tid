import type { Emphasis } from 'mdast';
import { Info, State } from '../types';
import { checkItalic } from '../util/check-italic';
import { containerPhrasing } from '../util/container-phrasing';

italic.peek = italicPeek;

export function italic(node: Emphasis, _: unknown, state: State, info: Info) {
  const marker = checkItalic(state);
  const exit = state.enter('italic');
  const value = containerPhrasing(node, state, info);
  exit();
  return marker + value + marker;
}

function italicPeek(_: Emphasis, _1: unknown, state: State): string {
  return state.options.italic ?? `//`;
}
