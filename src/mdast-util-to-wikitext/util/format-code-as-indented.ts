import { type Code } from 'mdast';
import type { State } from '../types';

/**
 * 检查是否应将代码节点格式化为缩进代码。
 * 
 * @param node - 要格式化的代码节点。
 * @param context - 转换的当前状态。
 * @returns 如果应将代码格式化为缩进代码，则返回 true；否则返回 false。
 */
export function formatCodeAsIndented(node: Code, context: State): boolean {
  return Boolean(
    // 如果没有启用代码围栏
    !context.options.fences &&
    // 代码节点有值
    node.value &&
    // 如果没有指定代码语言
    !node.lang &&
    // 并且代码值中包含非空白字符
    /[^ \r\n]/.test(node.value) &&
    // 并且代码值的开头和结尾都不是空白行
    !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(node.value),
  );
}
