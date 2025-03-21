import { Options, State } from '../types';

/**
 * 检查规则重复次数是否有效。
 *
 * 如果提供的重复次数小于 3，则抛出错误。
 *
 * @param state - 包含配置选项的状态对象。
 * @returns 有效的规则重复次数。
 */
export function checkRuleRepetition(state: State): Exclude<Options['horizontalRuleRepetition'], null | undefined> {
  const repetition = state.options.horizontalRuleRepetition || 3;

  if (repetition < 3) {
    throw new Error(
      'Cannot serialize rules with repetition `' +
      repetition +
      '` for `options.ruleRepetition`, expected `3` or more'
    )
  }

  return repetition;
}
