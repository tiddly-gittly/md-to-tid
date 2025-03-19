import { Options, State } from '../types';

/**
 * 检查有序列表项的标记字符是否有效。
 *
 * 如果提供的标记字符不是 有序列表`#`，则抛出错误。
 *
 * @param state - 包含配置选项的状态对象。
 * @returns 有效的有序列表项标记字符。
 */
export function checkBulletOrdered(state: State): Exclude<Options['bulletOrdered'], null | undefined> {
  const marker = state.options.bulletOrdered || '#';

  if (marker !== '#') {
    throw new Error(
      'Cannot serialize items with `' +
      marker +
      '` for `options.bulletOrdered`, expected `.`'
    )
  }

  return marker
}
