import { Options, State } from '../types';

/**
 * 检查强调标记字符是否有效。
 *
 * 如果提供的标记字符不是 `//` 或 `''`，则抛出错误。
 *
 * @param state - 包含配置选项的状态对象。
 * @returns 有效的强调标记字符。
 */
export function checkEmphasis(state: State): Exclude<Options['emphasis'], null | undefined> {
  const marker = state.options.emphasis || '//';

  if (marker !== '//' && marker !== `''`) {
    throw new Error(
      'Cannot serialize emphasis with `' +
      marker +
      '` for `options.emphasis`, expected `//`, or `\'\'`'
    )
  }

  return marker;
}
