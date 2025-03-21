import { Options, State } from '../types';

/**
 * 检查代码围栏的标记字符是否有效。
 *
 * 如果提供的标记字符不是 `` ` `` 或 `<` 或 `$`，则抛出错误。
 *
 * @param state - 包含配置选项的状态对象。
 * @returns 有效的代码围栏标记字符。
 */
export function checkFence(state: State): Exclude<Options['fence'], null | undefined> {
  const marker = state.options.fence || '`';

  if (marker !== '`' && marker !== '<' && marker !== '$') {
    throw new Error(
      'Cannot serialize code with `' +
      marker +
      '` for `options.fence`, expected `` ` `` or `<` or `$`'
    )
  }

  return marker;
}
