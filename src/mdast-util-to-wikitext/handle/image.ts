import { checkQuote } from '../util/check-quote.js';
import { Image, Parents } from 'mdast';
import { Info, State } from '../types';

image.peek = imagePeek;

export function image(node: Image, _: Parents | undefined, state: State, info: Info): string {
  const quote = checkQuote(state);
  const suffix = quote === '"' ? 'Quote' : 'Apostrophe';
  const exit = state.enter('image');
  let subexit = state.enter('label');
  const tracker = state.createTracker(info);
  let value = tracker.move('![');
  value += tracker.move(state.safe(node.alt, { before: value, after: ']', ...tracker.current() }));
  value += tracker.move('](');

  subexit();

  if (
    // If there’s no url but there is a title…
    (!node.url && node.title) ||
    // If there are control characters or whitespace.
    /[\0- \u007F]/.test(node.url)
  ) {
    subexit = state.enter('destinationLiteral');
    value += tracker.move('<');
    value += tracker.move(state.safe(node.url, { before: value, after: '>', ...tracker.current() }));
    value += tracker.move('>');
  } else {
    // No whitespace, raw is prettier.
    subexit = state.enter('destinationRaw');
    value += tracker.move(
      state.safe(node.url, {
        before: value,
        after: node.title ? ' ' : ')',
        ...tracker.current(),
      }),
    );
  }

  subexit();

  if (node.title) {
    subexit = state.enter(`title${suffix}`);
    value += tracker.move(' ' + quote);
    value += tracker.move(
      state.safe(node.title, {
        before: value,
        after: quote,
        ...tracker.current(),
      }),
    );
    value += tracker.move(quote);
    subexit();
  }

  value += tracker.move(')');
  exit();

  return value;
}

function imagePeek(): string {
  return '!';
}
