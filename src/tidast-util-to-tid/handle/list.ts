import type { List } from 'mdast';
import type { Handle } from '../types';

import { containerFlow } from '../util/container-flow';
import { checkBullet } from '../util/check-bullet';
import { checkBulletOther } from '../util/check-bullet-other';
import { checkBulletOrdered } from '../util/check-bullet-ordered';
import { checkBulletOrderedOther } from '../util/check-bullet-ordered-other';

export const list: Handle = function list(node: List, parent, context) {
  const exit = context.enter('list');
  const bulletCurrent = context.bulletCurrent;
  /** @type {string} */
  let bullet: string = node.ordered ? checkBulletOrdered(context) : checkBullet(context);
  /** @type {string} */
  const bulletOther: string = node.ordered ? checkBulletOrderedOther(context) : checkBulletOther(context);
  const bulletLastUsed = context.bulletLastUsed;
  let useDifferentMarker = false;

  if (
    parent &&
    // Explicit `other` set.
    (node.ordered ? context.options.bulletOrderedOther : context.options.bulletOther) &&
    bulletLastUsed &&
    bullet === bulletLastUsed
  ) {
    useDifferentMarker = true;
  }

  if (!node.ordered) {
    const firstListItem = node.children ? node.children[0] : undefined;

    // If there’s an empty first list item directly in two list items,
    // we have to use a different bullet:
    //
    // ```markdown
    // * - *
    // ```
    //
    // …because otherwise it would become one big thematic break.
    if (
      // Bullet could be used as a thematic break marker:
      (bullet === '*' || bullet === '-') &&
      // Empty first list item:
      firstListItem &&
      (!firstListItem.children || !firstListItem.children[0]) &&
      // Directly in two other list items:
      context.stack[context.stack.length - 1] === 'list' &&
      context.stack[context.stack.length - 2] === 'listItem' &&
      context.stack[context.stack.length - 3] === 'list' &&
      context.stack[context.stack.length - 4] === 'listItem' &&
      // That are each the first child.
      context.indexStack[context.indexStack.length - 1] === 0 &&
      context.indexStack[context.indexStack.length - 2] === 0 &&
      context.indexStack[context.indexStack.length - 3] === 0
    ) {
      useDifferentMarker = true;
    }
  }

  if (useDifferentMarker) {
    bullet = bulletOther;
  }

  context.bulletCurrent = bullet;
  const value = containerFlow(node, context);
  context.bulletLastUsed = bullet;
  context.bulletCurrent = bulletCurrent;
  exit();
  return value;
};
