import type { Options, State } from '../types';

/**
 * 检查斜体标记字符是否有效。
 *
 * 如果提供的标记字符不是 `//`，则抛出错误。
 *
 * @param context - 包含配置选项的上下文对象。
 * @returns 有效的斜体标记字符。
 */
export function checkItalic(context: State): Exclude<Options['italic'], undefined> {
  const marker = context.options.italic ?? `//`;

  if (marker !== `//`) {
    throw new Error(`Cannot serialize italic with ${marker} for options.italic, expected  \`''\``);
  }

  return marker;
}
