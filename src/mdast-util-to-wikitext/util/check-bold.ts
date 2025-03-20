import { Options, State } from '../types';

/**
 * 检查并返回用于表示强调文本的标记。
 *
 * @param {State} state - 包含配置选项的状态对象。
 * @returns {Exclude<Options['bold'], null | undefined>} - 用于表示强调文本的标记，必须是 `''`。
 */
export function checkBold(state: State): Exclude<Options['bold'], null | undefined> {
  const marker = state.options.bold || `''`;

  if (marker !== `''`) {
    throw new Error(
      'Cannot serialize bold with `' +
      marker +
      '` for `options.bold`, expected `\'\'`'
    )
  }

  return marker;
}
