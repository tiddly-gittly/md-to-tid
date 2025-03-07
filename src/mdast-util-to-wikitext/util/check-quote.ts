import { Options, State } from '../types';

/**
 * 检查引号标记字符是否有效。
 *
 * 如果提供的标记字符不是 `"` 或 `'`，则抛出错误。
 *
 * @param state - 包含配置选项的状态对象。
 * @returns 有效的引号标记字符。
 */
export function checkQuote(state: State): Exclude<Options['quote'], null | undefined> {
  const marker = state.options.quote || '"';

  if (marker !== '"' && marker !== "'") {
    throw new Error(
      'Cannot serialize title with `' +
      marker +
      '` for `options.quote`, expected `"`, or `\'`'
    )
  }

  return marker;
}
