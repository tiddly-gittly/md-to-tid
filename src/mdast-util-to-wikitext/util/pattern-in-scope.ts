import type { Conflict } from '../types';

/**
 * @param stack Context['stack']
 * @param pattern an conflict object, but we actually use its conflict['conflict'] and try find it in the stack.
 * @returns
 */
export function patternInScope(stack: Array<string>, pattern: Conflict): boolean {
  return listInScope(stack, pattern.conflict, true) && !listInScope(stack, pattern.notConflict, false);
}

function listInScope(stack: Array<string>, list: Conflict['conflict'], none: boolean): boolean {
  if (!list) {
    return none;
  }

  if (typeof list === 'string') {
    list = [list];
  }

  let index = -1;

  while (++index < list.length) {
    if (stack.includes(list[index])) {
      return true;
    }
  }

  return false;
}
