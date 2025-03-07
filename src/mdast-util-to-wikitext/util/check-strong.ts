import { Options, State } from '../types';

/**
 * 检查并返回用于表示强调文本的标记。
 * 
 * @param {State} state - 包含配置选项的状态对象。
 * @returns {Exclude<Options['strong'], null | undefined>} - 用于表示强调文本的标记，必须是 `*` 或 `_`。
 */
export function checkStrong(state: State): Exclude<Options['strong'], null | undefined> {
  const marker = state.options.strong || '*';

  if (marker !== '*' && marker !== '_') {
    throw new Error(
      'Cannot serialize strong with `' +
      marker +
      '` for `options.strong`, expected `*`, or `_`'
    )
  }

  return marker;
}
