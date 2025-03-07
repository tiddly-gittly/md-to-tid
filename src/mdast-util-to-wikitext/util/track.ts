import { Tracker, TrackFields } from '../types.js';

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
   * 跳过一些生成的 Markdown 内容。
   *
   * @param {string | null | undefined} input - 要跳过的 Markdown 内容。
   * @returns {string} 返回输入的 Markdown 内容。
   * @type {TrackMove}
   */
  function move(input: string | null | undefined): string {
    // eslint-disable-next-line unicorn/prefer-default-parameters
    const value = input || '';
    // @ts-ignore
    const chunks = value.split(/\r?\n|\r/g);
    const tail = chunks[chunks.length - 1];
    line += chunks.length - 1;
    column = chunks.length === 1 ? column + tail.length : 1 + tail.length + lineShift;
    return value;
  }
}
