import { checkBullet } from '../util/check-bullet';
import { checkBulletOrdered } from '../util/check-bullet-ordered';
import { List, Parents } from 'mdast';
import { Info, State } from '../types';

export function list(node: List, parent: Parents | undefined, state: State, info: Info): string {
  const exit = state.enter('list');
  const bulletCurrent = state.bulletCurrent;
  let bullet: string = node.ordered ? checkBulletOrdered(state) : checkBullet(state);
  state.bulletCurrent = bullet;
  const value = state.containerFlow(node, info);
  state.bulletLastUsed = bullet;
  state.bulletCurrent = bulletCurrent;
  exit();
  return value;
}
