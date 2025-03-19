import { Image, Parents } from 'mdast';
import { Info, State } from '../types';

image.peek = imagePeek;

export function image(node: Image, _: Parents | undefined, state: State, info: Info): string {
  // [img[https://tiddlywiki.com/favicon.ico]]
  // [img[An explanatory tooltip|Motovun Jack.jpg]]
  // [img width=32 [Motovun Jack.jpg]]
  // [img width=32 class="tc-image" [Motovun Jack.jpg]]

  // const quote = checkQuote(state);
  // const suffix = quote === '"' ? 'Quote' : 'Apostrophe';
  const exit = state.enter('image');
  let subexit = state.enter('label');
  const tracker = state.createTracker(info);
  // 首先使用 alt 作为工具提示，如果没有提供 alt，则使用 title 代替。
  let value = tracker.move('[img[');
  const tooltip = state.safe(node.alt ?? node.title, { before: '[', after: '|]', ...tracker.current() });
  const separateLine = tooltip ? '|' : '';
  // [img[tooltip separateLine
  value += tracker.move(`${tooltip}${separateLine}`);

  subexit();

  if (
    // 如果没有 url 但有标题...
    (!node.url && node.title) ||
    // 如果 url 中包含控制字符或空白字符。
    /[\0- \u007F]/.test(node.url)
  ) {
    subexit = state.enter('destinationLiteral');
  } else {
    // 没有空白字符，原始格式更美观。
    subexit = state.enter('destinationRaw');
  }
  //[img[tooltip separateLine + url]]
  value += tracker.move(state.safe(node.url, { before: value, after: ']]', ...tracker.current() }));
  subexit();

  value += tracker.move(']]');
  exit();

  return value;
}

function imagePeek(): string {
  return '[img[';
}
