import { Info, PhrasingParents, State } from '../types';

import { encodeCharacterReference } from './encode-character-reference';


/**
 * 处理短语级别的容器节点，将其子节点序列化为字符串。
 *
 * @param {PhrasingParents} parent - 短语级别的父节点，包含子节点。
 * @param {State} state - 序列化过程中的状态对象，包含索引栈和跟踪器等信息。
 * @param {Info} info - 额外的信息，如前后字符和跟踪信息。
 * @returns {string} 序列化后的字符串。
 */
export function containerPhrasing(parent: PhrasingParents, state: State, info: Info): string {
  // 从状态对象中获取索引栈
  const indexStack = state.indexStack;
  // 获取父节点的子节点列表，如果没有则为空数组
  const children = parent.children || [];
  // 用于存储每个子节点序列化后的结果
  const results: string[] = [];
  // 初始化子节点索引
  let index = -1;
  // 获取当前处理前的字符
  let before = info.before;
  // 用于存储需要编码的字符
  let encodeAfter: string | undefined;

  // 将当前索引压入索引栈
  indexStack.push(-1);
  // 创建一个跟踪器，用于跟踪处理过程中的位置信息
  let tracker = state.createTracker(info);

  // 遍历所有子节点
  while (++index < children.length) {
    // 获取当前子节点
    const child = children[index];
    /** @type {string} */
    // 用于存储下一个子节点处理后的第一个字符
    let after: string;

    // 更新索引栈中当前层级的索引
    indexStack[indexStack.length - 1] = index;

    // 如果还有下一个子节点
    if (index + 1 < children.length) {
      /** @type {Handle} */
      // @ts-expect-error: hush, it’s actually a `zwitch`.
      // 获取下一个子节点的处理函数
      let handle: Handle = state.handle.handlers[children[index + 1].type];
      /** @type {Handle} */
      // 如果处理函数有 peek 方法，则使用 peek 方法
      if (handle && handle.peek) handle = handle.peek;
      // 获取下一个子节点处理后的第一个字符
      after = handle
        ? handle(children[index + 1], parent, state, {
            before: '',
            after: '',
            ...tracker.current(),
          }).charAt(0)
        : '';
    } else {
      // 如果没有下一个子节点，则使用 info 中的 after 字符
      after = info.after;
    }

    // 在某些情况下，短语中紧跟换行符之后可能会出现 HTML（文本）。
    // 当我们对其进行序列化时，大多数情况下会被视为 HTML（流）。
    // 由于我们无法通过转义等方式来避免这种情况发生，所以我们采取了一种相对合理的方法：将该换行符替换为空格。
    // 参考：<https://github.com/syntax-tree/mdast-util-to-markdown/issues/15>
    if (results.length > 0 && (before === '\r' || before === '\n') && child.type === 'html') {
      // 将上一个结果中的换行符替换为空格
      results[results.length - 1] = results[results.length - 1].replace(/(\r?\n|\r)$/, ' ');
      // 更新 before 字符为空格
      before = ' ';

      // 待办：这样做能重置跟踪器吗？
      // 重新创建跟踪器
      tracker = state.createTracker(info);
      // 移动跟踪器到当前结果的末尾
      tracker.move(results.join(''));
    }

    // 处理当前子节点，获取序列化后的结果
    let value = state.handle(child, parent, state, {
      ...tracker.current(),
      after,
      before,
    });

    // 如果我们必须对前一个节点之后的第一个字符进行编码，并且该字符仍然相同，
    // 则对其进行编码。
    if (encodeAfter && encodeAfter === value.slice(0, 1)) {
      // 对第一个字符进行编码
      value = encodeCharacterReference(encodeAfter.charCodeAt(0)) + value.slice(1);
    }

    // 获取编码信息
    const encodingInfo = state.attentionEncodeSurroundingInfo;
    // 清空编码信息
    state.attentionEncodeSurroundingInfo = undefined;
    // 清空需要编码的字符
    encodeAfter = undefined;

    // 如果我们必须对当前节点之前的第一个字符进行编码，并且该字符仍然相同，
    // 则对其进行编码。
    if (encodingInfo) {
      if (results.length > 0 && encodingInfo.before && before === results[results.length - 1].slice(-1)) {
        // 对前一个结果的最后一个字符进行编码
        results[results.length - 1] = results[results.length - 1].slice(0, -1) + encodeCharacterReference(before.charCodeAt(0));
      }

      if (encodingInfo.after) encodeAfter = after;
    }

    // 移动跟踪器到当前结果的末尾
    tracker.move(value);
    // 将当前结果添加到结果数组中
    results.push(value);
    // 更新 before 字符为当前结果的最后一个字符
    before = value.slice(-1);
  }

  // 从索引栈中弹出当前索引
  indexStack.pop();

  // 将所有结果连接成一个字符串并返回
  return results.join('');
}
