import { checkQuote } from '../util/check-quote.js';
import { formatLinkAsAutolink } from '../util/format-link-as-autolink.js';
import { Link, Parents } from 'mdast';
import { Info, State } from '../types';

link.peek = linkPeek;

export function link(node: Link, _: Parents | undefined, state: State, info: Info): string {
  const quote = checkQuote(state);
  const suffix = quote === '"' ? 'Quote' : 'Apostrophe';
  const tracker = state.createTracker(info);
  /** @type {Exit} */
  let exit;
  /** @type {Exit} */
  let subexit;

  if (formatLinkAsAutolink(node, state)) {
    // Hide the fact that we’re in phrasing, because escapes don’t work.
    const stack = state.stack;
    state.stack = [];
    exit = state.enter('autolink');
    let value = tracker.move('<');
    value += tracker.move(
      state.containerPhrasing(node, {
        before: value,
        after: '>',
        ...tracker.current(),
      }),
    );
    value += tracker.move('>');
    exit();
    state.stack = stack;
    return value;
  }

  exit = state.enter('link');
  subexit = state.enter('label');
  let value = tracker.move('[');
  value += tracker.move(
    state.containerPhrasing(node, {
      before: value,
      after: '](',
      ...tracker.current(),
    }),
  );
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

function linkPeek(node: Link, _: Parents | undefined, state: State): string {
  return formatLinkAsAutolink(node, state) ? '<' : '[';
}
