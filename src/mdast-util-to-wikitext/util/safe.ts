import type { Context, SafeOptions } from '../types';

import { patternCompile } from './pattern-compile';
import { patternInScope } from './pattern-in-scope';

/**
 * Escape and remove some characters from a string, based on information in the Context['conflict']
 * @param context 
 * @param input 
 * @param config 
 * @returns 
 */
export function safe(context: Context, input: string | null | undefined, config: SafeOptions & { encode?: Array<string> }): string {
  const value = (config.before || '') + (input || '') + (config.after || '');
  const positions: number[] = [];
  const result: string[] = [];
  const infos: Record<number, { before: boolean; after: boolean }> = {};
  let index = -1;

  while (++index < context.conflict.length) {
    const pattern = context.conflict[index];

    if (!patternInScope(context.stack, pattern)) {
      continue;
    }

    const expression = patternCompile(pattern);
    let match: RegExpExecArray | null;

    while ((match = expression.exec(value))) {
      const before = 'before' in pattern || Boolean(pattern.atBreak);
      const after = 'after' in pattern;
      const position = match.index + (before ? match[1].length : 0);

      if (positions.includes(position)) {
        if (infos[position].before && !before) {
          infos[position].before = false;
        }

        if (infos[position].after && !after) {
          infos[position].after = false;
        }
      } else {
        positions.push(position);
        infos[position] = { before, after };
      }
    }
  }

  positions.sort(numerical);

  let start = config.before ? config.before.length : 0;
  const end = value.length - (config.after ? config.after.length : 0);
  index = -1;

  while (++index < positions.length) {
    const position = positions[index];

    // Character before or after matched:
    if (position < start || position >= end) {
      continue;
    }

    // If this character is supposed to be escaped because it has a condition on
    // the next character, and the next character is definitly being escaped,
    // then skip this escape.
    if (
      (position + 1 < end && positions[index + 1] === position + 1 && infos[position].after && !infos[position + 1].before && !infos[position + 1].after) ||
      (positions[index - 1] === position - 1 && infos[position].before && !infos[position - 1].before && !infos[position - 1].after)
    ) {
      continue;
    }

    if (start !== position) {
      // If we have to use a character reference, an ampersand would be more
      // correct, but as backslashes only care about punctuation, either will
      // do the trick
      result.push(escapeBackslashes(value.slice(start, position), '\\'));
    }

    start = position;

    if (/[!-/:-@[-`{-~]/.test(value.charAt(position)) && (!config.encode || !config.encode.includes(value.charAt(position)))) {
      // Character escape.
      result.push('\\');
    } else {
      // Character reference.
      result.push('&#x' + value.charCodeAt(position).toString(16).toUpperCase() + ';');
      start++;
    }
  }

  result.push(escapeBackslashes(value.slice(start, end), config.after));

  return result.join('');
}

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function numerical(a: number, b: number): number {
  return a - b;
}

/**
 * @param {string} value
 * @param {string} after
 * @returns {string}
 */
function escapeBackslashes(value: string, after: string): string {
  const expression = /\\(?=[!-/:-@[-`{-~])/g;
  const positions: Array<number> = [];
  const results: Array<string> = [];
  const whole = value + after;
  let index = -1;
  let start = 0;
  let match: RegExpExecArray | null;

  while ((match = expression.exec(whole))) {
    positions.push(match.index);
  }

  while (++index < positions.length) {
    if (start !== positions[index]) {
      results.push(value.slice(start, positions[index]));
    }

    results.push('\\');
    start = positions[index];
  }

  results.push(value.slice(start));

  return results.join('');
}
