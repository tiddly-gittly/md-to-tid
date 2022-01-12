import type { ListItem } from 'mdast';
import type { Handle } from '../types';

import { checkBullet } from '../util/check-bullet';
import { checkListItemIndent } from '../util/check-list-item-indent';
import { containerFlow } from '../util/container-flow';
import { indentLines, Map } from '../util/indent-lines';

export const listItem: Handle = function listItem(node: ListItem, parent, context) {
  const listItemIndent = checkListItemIndent(context);
  let bullet = context.bulletCurrent || checkBullet(context);

  // Add the marker value for ordered lists.
  if (parent && parent.type === 'list' && parent.ordered) {
    bullet =
      context.options.incrementListMarker === false
        ? bullet
        : (typeof parent.start === 'number' && parent.start > -1 ? parent.start : 1) + parent.children.indexOf(node) + bullet;
  }

  let size = bullet.length + 1;

  if (listItemIndent === 'tab' || (listItemIndent === 'mixed' && ((parent && parent.type === 'list' && parent.spread) || node.spread))) {
    size = Math.ceil(size / 4) * 4;
  }

  const exit = context.enter('listItem');
  const map: Map = function map(line, index, blank) {
    if (index) {
      return (blank ? '' : ' '.repeat(size)) + line;
    }

    return (blank ? bullet : bullet + ' '.repeat(size - bullet.length)) + line;
  };
  const value = indentLines(containerFlow(node, context), map);
  exit();

  return value;
};
