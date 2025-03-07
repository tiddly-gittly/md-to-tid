import type { Break } from 'mdast';
import type { Context, SafeOptions } from '../types';
import { patternInScope } from '../util/pattern-in-scope';

export function hardBreak(node: Break, parent: unknown, context: Context, safeOptions: SafeOptions): string {
  let index = -1;

  while (++index < context.conflict.length) {
    // 如果我们无法在这个结构中放置换行符（设文标题、表格），则使用空格代替。
    // If we can’t put eols in this construct (setext headings, tables), use a space instead.
    if (context.conflict[index].character === '\n' && patternInScope(context.stack, context.conflict[index])) {
      return /[\t ]/.test(safeOptions.before) ? '' : ' ';
    }
  }

  return '\\\n';
}
