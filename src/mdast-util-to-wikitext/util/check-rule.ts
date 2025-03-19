import { Options, State } from '../types';

// 检查水平分隔符标记是否有效，若无效则抛出错误并返回有效的规则标记
// @param {State} state - 状态对象
// @returns {Exclude<Options['rule'], null | undefined>} - 有效的规则标记
export function checkRule(state: State): Exclude<Options['horizontalRule'], null | undefined> {
  const marker = state.options.horizontalRule || '-';

  if (marker !== '-') {
    throw new Error(
      'Cannot serialize rules with `' +
      marker +
      '` for `options.rule`, expected `-`'
    )
  }
  return marker;
}
