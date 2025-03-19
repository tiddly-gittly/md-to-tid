import { formatLinkAsAutolink } from '../util/format-link-as-autolink.js';
import { Link, Parents } from 'mdast';
import { Exit, Info, State } from '../types';

link.peek = linkPeek;

export function link(node: Link, _: Parents | undefined, state: State, info: Info): string {
  // [[Tiddler Title]]
  // [[Displayed Link Title|Tiddler Title]]
  // 驼峰式链接: HelloThere
  // 自动链接：[ext[Title|https://tiddlywiki.com/]]
  // [[TW5|https://tiddlywiki.com/]]

  // const quote = checkQuote(state);
  // const suffix = quote === '"' ? 'Quote' : 'Apostrophe';

  const tracker = state.createTracker(info);
  let exit: Exit;
  let subexit: Exit;

  // 若是自动链接`[ext[https://example.com]]`
  if (formatLinkAsAutolink(node, state)) {
    // Hide the fact that we’re in phrasing, because escapes don’t work.
    const stack = state.stack;
    state.stack = [];
    exit = state.enter('autolink');
    // [ext[
    let value = tracker.move('[ext[');
    // [ext[ + node
    value += tracker.move(
      state.containerPhrasing(node, {
        before: value,
        after: ']]',
        ...tracker.current(),
      }),
    );
    // [ext[ + node + ]]
    value += tracker.move(']]');
    exit();
    state.stack = stack;
    return value;
  }

  exit = state.enter('link');
  subexit = state.enter('label');
  // [[
  let value = tracker.move('[[');
  // linkText = tel:123
  let linkText = tracker.move(
    state.containerPhrasing(node, {
      before: value,
      after: ']]',
      ...tracker.current(),
    }),
  );
  // [[ linkText
  value += linkText;
  const separateLine = linkText ? '|' : '';
  subexit();

  // @image.ts
  if (
    // 如果没有 url 但有标题...
    (!node.url && node.title) ||
    // 如果 url 中包含控制字符或空白字符。
    /[\0- \u007F]/.test(node.url)
  ) {
    subexit = state.enter('destinationLiteral');
    // [[ linkText |
    value += tracker.move(separateLine);
    // [[ linkText | url
    value += tracker.move(state.safe(node.url, { before: '[[', after: ']]', ...tracker.current() }));
  } else {
    // 没有空白字符，原始格式更美观。
    subexit = state.enter('destinationRaw');
    // [[ linkText |
    value += tracker.move(separateLine);
    // [[ linkText | url
    value += tracker.move(state.safe(node.url, { before: '[[', after: node.title ? ' ' : ']]', ...tracker.current() }));
  }

  subexit();
  // [[ linkText | url ]]
  value += tracker.move(']]');

  exit();
  return value;
}

function linkPeek(node: Link, _: Parents | undefined, state: State): string {
  return formatLinkAsAutolink(node, state) ? '[ext[' : '[[';
}
