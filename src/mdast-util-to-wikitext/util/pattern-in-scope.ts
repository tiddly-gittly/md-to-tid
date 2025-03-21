import { ConstructName, Unsafe } from '../types';

/**
 * 检查指定模式是否在当前作用域内。
 * 
 * @param stack - 构造名称数组，表示当前的作用域栈。
 * @param pattern - 要检查的不安全模式。
 * @returns 如果模式在作用域内返回 true，否则返回 false。
 */
export function patternInScope(stack: ConstructName[], pattern: Unsafe): boolean {
  // 检查模式是否在允许的构造中，并且不在禁止的构造中
  return listInScope(stack, pattern.inConstruct, true) && !listInScope(stack, pattern.notInConstruct, false);
}

/**
 * 检查指定的构造名称列表是否在当前作用域栈中。
 * 
 * @param stack - 构造名称数组，表示当前的作用域栈。
 * @param list - 要检查的构造名称列表。
 * @param none - 当列表为空时返回的值。
 * @returns 如果列表中的任何构造名称在作用域栈中，返回 true，否则返回 false。
 */
function listInScope(stack: ConstructName[], list: Unsafe['inConstruct'], none: boolean): boolean {
  // 如果 list 是字符串，将其转换为数组
  if (typeof list === 'string') {
    list = [list];
  }

  // 如果列表为空，返回 none 参数指定的值
  if (!list || list.length === 0) {
    return none;
  }

  // 初始化索引
  let index = -1;

  // 遍历列表中的每个构造名称
  while (++index < list.length) {
    // 如果作用域栈中包含当前构造名称，返回 true
    if (stack.includes(list[index])) {
      return true;
    }
  }

  // 如果列表中没有构造名称在作用域栈中，返回 false
  return false;
}
