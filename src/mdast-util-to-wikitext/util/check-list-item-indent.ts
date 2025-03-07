import { Options, State } from '../types';

/**
 * 检查列表项缩进样式是否有效。
 *
 * 如果提供的缩进样式不是 `tab`、`one` 或 `mixed`，则抛出错误。
 *
 * @param state - 包含配置选项的状态对象。
 * @returns 有效的列表项缩进样式。
 */
export function checkListItemIndent(state: State): Exclude<Options['listItemIndent'], null | undefined> {
  const style = state.options.listItemIndent || 'one';

  if (style !== 'tab' && style !== 'one' && style !== 'mixed') {
    throw new Error(
      'Cannot serialize items with `' +
      style +
      '` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`'
    )
  }

  return style;
}
