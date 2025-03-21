import { Unsafe } from '../types';

/**
 * 编译一个 `Unsafe` 对象为正则表达式。
 *
 * 该函数会检查 `Unsafe` 对象是否已经编译过，如果没有，则根据 `Unsafe` 对象的属性生成一个正则表达式。
 * 生成的正则表达式会考虑到 `atBreak`、`before`、`character` 和 `after` 等属性。
 *
 * @param pattern - 一个 `Unsafe` 对象，包含生成正则表达式所需的信息。
 * @returns 一个编译好的正则表达式对象。
 */
export function compilePattern(pattern: Unsafe): RegExp {
  // 检查 pattern 是否已经编译过
  if (!pattern._compiled) {
    // 根据 atBreak 和 before 属性生成匹配字符串开始部分的正则表达式
    const before =
      (pattern.atBreak ? '[\\r\\n][\\t ]*' : '') +
      (pattern.before ? '(?:' + pattern.before + ')' : '')

    // 编译正则表达式
    pattern._compiled = new RegExp(
      // 匹配字符串开始部分
      (before ? '(' + before + ')' : '') +
      // 对特殊字符进行转义
      (/[|\\{}()[\]^$+*?.-]/.test(pattern.character) ? '\\' : '') +
      // 匹配字符
      pattern.character +
      // 匹配字符串结束部分
      (pattern.after ? '(?:' + pattern.after + ')' : ''),
      // 全局匹配
      'g'
    )
  }

  return pattern._compiled
}
