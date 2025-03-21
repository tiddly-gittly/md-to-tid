import { encodeCharacterReference } from './encode-character-reference';
import { patternInScope } from './pattern-in-scope';
import { SafeConfig, State } from '../types';

/**
 * 使字符串安全地嵌入到 Markdown 结构中。
 *
 * 在 Markdown 中，几乎所有标点符号在某些情况下都可能产生特殊效果。
 * 它们是否会产生特殊效果很大程度上取决于它们出现的位置和上下文。
 *
 * 为了解决这个问题，`mdast-util-to-markdown` 会跟踪以下信息：
 *
 * * 某些内容前后的字符；
 * * 当前所处的 “结构”。
 *
 * 此函数会使用这些信息来转义或编码特殊字符。
 *
 * @param {State} state
 *   关于当前状态的信息。
 * @param {string | null | undefined} input
 *   要处理成安全格式的原始值。
 * @param {SafeConfig} config
 *   配置信息。
 * @returns {string}
 *   序列化后的、可安全嵌入的 Markdown 字符串。
 */
export function safe(state: State, input: string | null | undefined, config: SafeConfig): string {
  const value = (config.before || '') + (input || '') + (config.after || '');
  const positions: number[] = [];
  const result: string[] = [];
  const infos: Record<number, { before: boolean; after: boolean }> = {};
  let index = -1;

  while (++index < state.unsafe.length) {
    const pattern = state.unsafe[index];

    if (!patternInScope(state.stack, pattern)) {
      continue;
    }

    const expression = state.compilePattern(pattern);
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

    // 匹配到的字符在前后部分：
    if (position < start || position >= end) {
      continue;
    }

    // 如果这个字符因为下一个字符的条件需要转义，并且下一个字符肯定会被转义，
    // 那么跳过这个转义。
    if (
      (position + 1 < end && positions[index + 1] === position + 1 && infos[position].after && !infos[position + 1].before && !infos[position + 1].after) ||
      (positions[index - 1] === position - 1 && infos[position].before && !infos[position - 1].before && !infos[position - 1].after)
    ) {
      continue;
    }

    if (start !== position) {
      // 如果我们必须使用字符引用，一个 & 符号会更合适，但由于反斜杠只处理标点符号，两者都可以达到目的
      result.push(escapeBackslashes(value.slice(start, position), '\\'));
    }

    start = position;

    if (/[!-/:-@[-`{-~]/.test(value.charAt(position)) && (!config.encode || !config.encode.includes(value.charAt(position)))) {
      // 字符转义。
      result.push('\\');
    } else {
      // 字符引用。
      result.push(encodeCharacterReference(value.charCodeAt(position)));
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
  const positions: number[] = [];
  const results: string[] = [];
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
