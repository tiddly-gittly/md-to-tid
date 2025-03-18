import { checkRuleRepetition } from '../util/check-rule-repetition.js';
import { checkRule } from '../util/check-rule.js';
import { Parents, ThematicBreak } from 'mdast';
import { State } from '../types';

export function thematicBreak(_: ThematicBreak, _1: Parents | undefined, state: State): string {
  const value = (checkRule(state) + (state.options.ruleSpaces ? ' ' : '')).repeat(checkRuleRepetition(state));

  return state.options.ruleSpaces ? value.slice(0, -1) : value;
}
