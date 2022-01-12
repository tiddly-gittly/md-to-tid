/**
 * @typedef {import('../types').Handle} Handle
 * @typedef {import('mdast').ThematicBreak} ThematicBreak
 */

import { checkRuleRepetition } from '../util/check-rule-repetition';
import { checkRule } from '../util/check-rule';

/**
 * @type {Handle}
 * @param {ThematicBreak} _
 */
export function thematicBreak(_, _1, context) {
  const value = (checkRule(context) + (context.options.ruleSpaces ? ' ' : '')).repeat(checkRuleRepetition(context));

  return context.options.ruleSpaces ? value.slice(0, -1) : value;
}
