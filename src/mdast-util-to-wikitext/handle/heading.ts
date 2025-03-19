import { encodeCharacterReference } from '../util/encode-character-reference.js';
import { Heading, Parents } from 'mdast';
import { Info, State } from '../types';

export function heading(node: Heading, _: Parents | undefined, state: State, info: Info): string {
  const marker = '!';
  const rank = Math.max(Math.min(6, node.depth || 1), 1);
  const tracker = state.createTracker(info);
  const sequence = marker.repeat(rank);
  const exit = state.enter('headingAtx');
  const subexit = state.enter('phrasing');

  // 注意：为了实现正确的跟踪，当没有内容返回时，我们应该重置输出位置，
  // 因为此时空格不会被输出。
  // 实际上，在这种情况下，没有内容，所以多跟踪了一个字符也无关紧要。
  tracker.move(sequence + ' ');

  let value = state.containerPhrasing(node, {
    before: `${marker} `,
    after: '\n',
    ...tracker.current(),
  });

  if (/^[\t ]/.test(value)) {
    // To do: what effect has the character reference on tracking?
    value = encodeCharacterReference(value.charCodeAt(0)) + value.slice(1);
  }

  value = value ? sequence + ' ' + value : sequence;

  subexit();
  exit();

  return value;
}
