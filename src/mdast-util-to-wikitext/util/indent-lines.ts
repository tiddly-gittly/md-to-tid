import { Map } from '../types.js';

/**
 * 正则表达式，用于匹配换行符（支持不同操作系统的换行符格式）
 */
const eol = /\r?\n|\r/g;

/**
 * 对输入的字符串按行进行处理，并根据提供的映射函数进行转换。
 *
 * @param {string} value - 要处理的原始字符串。
 * @param {Map} map - 用于处理每一行的映射函数。
 * @returns {string} - 处理后的字符串。
 */
export function indentLines(value: string, map: Map): string {
  // 用于存储处理后的每一行和换行符
  const result: string[] = [];
  // 记录当前处理的起始位置
  let start = 0;
  // 记录当前处理的行数
  let line = 0;
  // 存储正则表达式匹配结果
  let match: RegExpExecArray | null;

  // 通过换行符分割字符串为数组然后用map处理。
  // match.index第一次出现eol的位置。
  // match[0]是分隔符，start是eol+分隔符的长度，没有之后直接one处理结尾
  while ((match = eol.exec(value))) {
    // 处理从起始位置到换行符前的部分
    one(value.slice(start, match.index));
    // 将换行符添加到结果数组
    result.push(match[0]);
    // 更新起始位置
    start = match.index + match[0].length;
    // 行数加1
    line++;
  }

  // 处理最后一行
  one(value.slice(start));

  // 将结果数组拼接成字符串
  return result.join('');

  /**
   * 对单行字符串进行处理，并将结果添加到结果数组中。
   *
   * @param {string} value - 要处理的单行字符串。
   */
  function one(value: string) {
    // 使用映射函数处理单行字符串，并将结果添加到结果数组
    result.push(map(value, line, !value));
  }
}
