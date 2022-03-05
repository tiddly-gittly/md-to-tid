import type { Emphasis } from 'mdast';
import type { Context } from '../types';
import { checkItalic } from '../util/check-italic';
import { containerPhrasing } from '../util/container-phrasing';

italic.peek = italicPeek;

export function italic(node: Emphasis, _: unknown, context: Context) {
  const marker = checkItalic(context);
  const exit = context.enter('italic');
  const value = containerPhrasing(node, context, {
    before: marker,
    after: marker,
  });
  exit();
  return marker + value + marker;
}

function italicPeek(_: Emphasis, _1: unknown, context: Context) {
  return context.options.italic ?? `''`;
}
