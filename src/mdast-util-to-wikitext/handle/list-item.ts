import type { ListItem } from 'mdast';
import type { Handle } from '../types';
import { containerFlow } from '../util/container-flow';
import { indentLines, type Map } from '../util/indent-lines';

export const listItem: Handle = function listItem(node: ListItem, parent, context) {
  const exit = context.enter('listItem');

  const bullet = context.bullet;
  const map: Map = function map(line, blank) {
    // in tw, there is no indent for list item. blank考虑了只有列表无内容的情况
    if (line.startsWith(bullet)) return (blank ? '' : bullet) + line;
    return (blank ? bullet : bullet + ' ') + line;
  };
  // TODO：等待分类处理
  const value = indentLines(containerFlow(node, context), map);

  exit();
  return value;
};
