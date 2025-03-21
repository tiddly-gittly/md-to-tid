import { FlowChildren, FlowParents, State, TrackFields } from '../types';


/**
 * 处理流节点的子节点，并将它们转换为字符串表示形式。
 * 
 * 该函数遍历给定父节点的所有子节点，使用状态对象的处理函数处理每个子节点，并在必要时添加分隔符。
 * 它还会跟踪索引和位置信息，以确保输出的准确性。
 * 
 * @param {FlowParents} parent - 包含子节点的父节点。
 * @param {State} state - 表示当前转换状态的对象。
 * @param {TrackFields} info - 包含跟踪信息的对象，如位置和偏移量。
 * @returns {string} 转换后的子节点的字符串表示形式。
 */
export function containerFlow(parent: FlowParents, state: State, info: TrackFields): string {
  // 从状态对象中获取索引栈
  const indexStack = state.indexStack;
  // 获取父节点的子节点数组，如果没有则为空数组
  const children = parent.children || [];
  // 使用状态对象创建一个跟踪器，用于跟踪位置信息
  const tracker = state.createTracker(info);
  // 用于存储每个子节点转换后的结果
  const results: Array<string> = [];
  // 初始化索引变量
  let index = -1;

  // 将当前索引压入索引栈
  indexStack.push(-1);

  // 遍历所有子节点
  while (++index < children.length) {
    // 获取当前子节点
    const child = children[index];

    // 更新索引栈中当前层级的索引
    indexStack[indexStack.length - 1] = index;

    // 处理当前子节点，并将结果添加到结果数组中
    results.push(
      // 使用跟踪器移动位置并记录
      tracker.move(
        // 调用状态对象的处理函数处理子节点
        state.handle(child, parent, state, {
          // 子节点前的字符
          before: '\n',
          // 子节点后的字符
          after: '\n',
          // 合并当前跟踪器的位置信息
          ...tracker.current(),
        }),
      ),
    );

    // 如果当前子节点不是列表类型，则重置最后使用的项目符号
    if (child.type !== 'list') {
      state.bulletLastUsed = undefined;
    }

    // 如果不是最后一个子节点，则添加分隔符
    if (index < children.length - 1) {
      // 调用 between 函数计算分隔符，并使用跟踪器移动位置
      results.push(tracker.move(between(child, children[index + 1], parent, state)));
    }
  }

  // 从索引栈中弹出当前层级的索引
  indexStack.pop();

  // 将所有结果连接成一个字符串并返回
  return results.join('');
}


/**
 * 计算两个相邻流子节点之间的分隔字符串。
 *
 * 该函数会遍历 `state.join` 数组中的每个连接函数，这些函数用于判断两个相邻节点之间的分隔规则。
 * 根据连接函数的返回值，函数会返回不同的分隔字符串：
 * - 如果返回 `true` 或 `1`，则跳出循环，继续检查下一个规则。
 * - 如果返回一个数字，则返回相应数量的换行符。
 * - 如果返回 `false`，则返回一个包含 HTML 注释的分隔字符串。
 * - 如果所有连接函数都没有返回特定值，则默认返回两个换行符。
 *
 * @param {FlowChildren} left - 左边的流子节点。
 * @param {FlowChildren} right - 右边的流子节点。
 * @param {FlowParents} parent - 流子节点的父节点。
 * @param {State} state - 关于当前状态的信息。
 * @returns {string} 两个相邻流子节点之间的分隔字符串。
 */
function between(left: FlowChildren, right: FlowChildren, parent: FlowParents, state: State): string {
  // 初始化索引，从 state.join 数组的末尾开始
  let index = state.join.length;

  // 从后往前遍历 state.join 数组
  while (index--) {
    // 调用当前的连接函数，传入左右节点、父节点和当前状态
    const result = state.join[index](left, right, parent, state);

    // 如果结果为 true 或 1，则跳出循环
    if (result === true || result === 1) {
      break;
    }

    // 如果结果是一个数字，则返回相应数量的换行符
    if (typeof result === 'number') {
      return '\n'.repeat(1 + result);
    }

    // 如果结果为 false，则返回包含 HTML 注释的分隔字符串
    if (result === false) {
      return '\n\n<!---->\n\n';
    }
  }

  // 如果所有连接函数都没有返回特定值，则默认返回两个换行符
  return '\n\n';
}
