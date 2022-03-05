import type { Context, Options } from '../types';

export function checkListItemIndent(context: Context): Exclude<Options['listItemIndent'], undefined> {
  const style = context.options.listItemIndent || 'one';

  if (style !== 'tab' && style !== 'one' && style !== 'mixed') {
    throw new Error('Cannot serialize items with `' + style + '` for `options.listItemIndent`, expected `tab`, `one`, or `mixed`');
  }

  return style;
}
