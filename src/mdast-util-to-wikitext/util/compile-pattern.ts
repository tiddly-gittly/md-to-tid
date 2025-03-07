import { Unsafe } from '../types';

/**
 * 编译一个 Unsafe 对象为正则表达式。
 * @param pattern - 一个 Unsafe 对象，包含需要编译的模式信息。
 * @returns 编译后的正则表达式。
 */
export function compilePattern(pattern: Unsafe): RegExp {
  if (!pattern._compiled) {
    const before =
      (pattern.atBreak ? '[\\r\\n][\\t ]*' : '') +
      (pattern.before ? '(?:' + pattern.before + ')' : '')

    pattern._compiled = new RegExp(
      (before ? '(' + before + ')' : '') +
      (/[|\\{}()[\]^$+*?.-]/.test(pattern.character) ? '\\' : '') +
      pattern.character +
      (pattern.after ? '(?:' + pattern.after + ')' : ''),
      'g'
    )
  }

  return pattern._compiled
}
