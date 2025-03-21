import { checkRuleRepetition } from '../util/check-rule-repetition';
import { checkRule } from '../util/check-rule';
import { Parents, ThematicBreak } from 'mdast';
import { State } from '../types';

export function thematicBreak(_: ThematicBreak, _1: Parents | undefined, state: State): string {
  // 在TW中单独一行使用三个或更多个 -，生成一个水平分隔线
  return checkRule(state).repeat(checkRuleRepetition(state));
}
