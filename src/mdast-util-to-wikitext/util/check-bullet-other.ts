import type { Context, Options } from '../types';

import { checkBullet } from './check-bullet';

export function checkBulletOther(context: Context): Exclude<Options['bullet'], undefined> {
  const bullet = checkBullet(context);
  const bulletOther = context.options.bulletOther;

  if (!bulletOther) {
    return bullet === '*' ? '-' : '*';
  }

  if (bulletOther !== '*' && bulletOther !== '+' && bulletOther !== '-') {
    throw new Error('Cannot serialize items with `' + bulletOther + '` for `options.bulletOther`, expected `*`, `+`, or `-`');
  }

  if (bulletOther === bullet) {
    throw new Error('Expected `bullet` (`' + bullet + '`) and `bulletOther` (`' + bulletOther + '`) to be different');
  }

  return bulletOther;
}
