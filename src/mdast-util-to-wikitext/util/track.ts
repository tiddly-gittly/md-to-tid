import { Tracker, TrackFields } from '../types';

/**
 * 跟踪输出中的位置信息。
 *
 * @param {TrackFields} config - 配置对象，包含当前位置和行偏移量等信息。
 * @returns {Tracker} 返回一个跟踪器对象，包含 move、current 和 shift 方法。
 * @type {CreateTracker}
 */
export function track(config: TrackFields): Tracker {
  // 默认值用于防止旧工具以某种方式激活此代码时崩溃。
  /* c8 ignore next 5 */
  const options = config || {};
  const now = options.now || {};
  let lineShift = options.lineShift || 0;
  let line = now.line || 1;
  let column = now.column || 1;

  return { move, current, shift };

  /**
   * 获取当前跟踪的信息。
   *
   * @returns {TrackFields} 返回当前跟踪的位置信息和行偏移量。
   * @type {TrackCurrent}
   */
  function current(): TrackFields {
    return { now: { line, column }, lineShift };
  }

  /**
   * 定义增加的行偏移量（行的典型缩进）。
   *
   * @param {number} value - 要增加的行偏移量。
   * @returns {undefined} 此函数没有返回值。
   * @type {TrackShift}
   */
  function shift(value: number): undefined {
    lineShift += value;
  }


/**
 * 根据输入字符串更新跟踪的行和列位置，并返回输入字符串。
 * 
 * 此函数接收一个字符串输入，将其按换行符分割成多个块。然后根据这些块的数量和最后一个块的长度，更新跟踪的行和列位置。
 * 如果输入字符串只有一行，则列位置增加最后一个块的长度；如果有多行，则行位置增加块的数量减一，列位置重置为最后一个块的长度加上行偏移量。
 * 
 * @param {string | null | undefined} input - 要处理的输入字符串，可以为 null 或 undefined。
 * @returns {string} 返回输入字符串，如果输入为 null 或 undefined，则返回空字符串。
 * @type {TrackMove}
 */
function move(input: string | null | undefined): string {
  // 使用空字符串作为默认值，避免输入为 null 或 undefined 时出错
  // eslint-disable-next-line unicorn/prefer-default-parameters
  const value = input || '';
  // 将输入字符串按换行符分割成多个块
  // @ts-ignore
  const chunks = value.split(/\r?\n|\r/g);
  // 获取最后一个块
  const tail = chunks[chunks.length - 1];
  // 更新行位置：行数增加块的数量减一
  line += chunks.length - 1;
  // 更新列位置：如果只有一个块，则列数增加最后一个块的长度；否则，列数重置为最后一个块的长度加上行偏移量
  column = chunks.length === 1 ? column + tail.length : 1 + tail.length + lineShift;
  // 返回输入字符串
  return value;
}
}
