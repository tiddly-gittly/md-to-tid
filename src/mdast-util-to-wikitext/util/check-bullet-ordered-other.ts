import type { Context, Options } from '../types';

import { checkBulletOrdered } from './check-bullet-ordered';

export function checkBulletOrderedOther(context: Context): Exclude<Options['bulletOrdered'], undefined> {
  const bulletOrdered = checkBulletOrdered(context);
  const bulletOrderedOther = context.options.bulletOrderedOther;

  if (!bulletOrderedOther) {
    return bulletOrdered === '.' ? ')' : '.';
  }

  if (bulletOrderedOther !== '.' && bulletOrderedOther !== ')') {
    throw new Error('Cannot serialize items with `' + bulletOrderedOther + '` for `options.bulletOrderedOther`, expected `*`, `+`, or `-`');
  }

  if (bulletOrderedOther === bulletOrdered) {
    throw new Error('Expected `bulletOrdered` (`' + bulletOrdered + '`) and `bulletOrderedOther` (`' + bulletOrderedOther + '`) to be different');
  }

  return bulletOrderedOther;
}
