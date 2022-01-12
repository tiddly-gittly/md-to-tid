import type { Context, Options } from '../types';

export function checkBulletOrdered(context: Context): Exclude<Options['bulletOrdered'], undefined> {
  const marker = context.options.bulletOrdered || '#';

  return marker;
}
