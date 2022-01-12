import type { InConstruct } from '../types';

export function patternInScope(stack: Array<string>, pattern: InConstruct): boolean {
  return listInScope(stack, pattern.inConstruct, true) && !listInScope(stack, pattern.notInConstruct, false);
}

function listInScope(stack: Array<string>, list: InConstruct['inConstruct'], none: boolean): boolean {
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
