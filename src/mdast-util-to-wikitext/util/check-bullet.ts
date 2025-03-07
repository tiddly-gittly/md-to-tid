import { Options, State } from '../types';

/**
 * 检查列表项的标记字符是否有效。
 *
 * 如果提供的标记字符不是 `*`、`+` 或 `-`，则抛出错误。
 *
 * @param state - 包含配置选项的状态对象。
 * @returns 有效的列表项标记字符。
 */
export function checkBullet(state: State): Exclude<Options['bullet'], null | undefined> {
  const marker = state.options.bullet || '*';

  if (marker !== '*' && marker !== '+' && marker !== '-') {
    throw new Error(
      'Cannot serialize items with `' +
      marker +
      '` for `options.bullet`, expected `*`, `+`, or `-`'
    )
  }

  return marker;
}
