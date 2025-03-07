import { Info, PhrasingParents, State } from '../types.js';

import { encodeCharacterReference } from './encode-character-reference.js';

/**
 * 序列化包含短语子节点的父节点的子节点。
 *
 * 这些子节点将紧密连接在一起。
 *
 * @param {PhrasingParents} parent
 *   流节点的父节点。
 * @param {State} state
 *   关于当前状态的信息。
 * @param {Info} info
 *   关于我们在生成文档中的位置的信息。
 * @returns {string}
 *   序列化后的子节点，连接在一起。
 */
export function containerPhrasing(parent: PhrasingParents, state: State, info: Info): string {
  const indexStack = state.indexStack;
  const children = parent.children || [];
  const results: string[] = [];
  let index = -1;
  let before = info.before;
  let encodeAfter: string | undefined;

  indexStack.push(-1);
  let tracker = state.createTracker(info);

  while (++index < children.length) {
    const child = children[index];
    /** @type {string} */
    let after: string;

    indexStack[indexStack.length - 1] = index;

    if (index + 1 < children.length) {
      /** @type {Handle} */
      // @ts-expect-error: hush, it’s actually a `zwitch`.
      let handle: Handle = state.handle.handlers[children[index + 1].type];
      /** @type {Handle} */
      if (handle && handle.peek) handle = handle.peek;
      after = handle
        ? handle(children[index + 1], parent, state, {
            before: '',
            after: '',
            ...tracker.current(),
          }).charAt(0)
        : '';
    } else {
      after = info.after;
    }

    // 在某些情况下，短语中紧跟换行符之后可能会出现 HTML（文本）。
    // 当我们对其进行序列化时，大多数情况下会被视为 HTML（流）。
    // 由于我们无法通过转义等方式来避免这种情况发生，所以我们采取了一种相对合理的方法：将该换行符替换为空格。
    // 参考：<https://github.com/syntax-tree/mdast-util-to-markdown/issues/15>
    if (results.length > 0 && (before === '\r' || before === '\n') && child.type === 'html') {
      results[results.length - 1] = results[results.length - 1].replace(/(\r?\n|\r)$/, ' ');
      before = ' ';

      // 待办：这样做能重置跟踪器吗？
      tracker = state.createTracker(info);
      tracker.move(results.join(''));
    }

    let value = state.handle(child, parent, state, {
      ...tracker.current(),
      after,
      before,
    });

    // 如果我们必须对前一个节点之后的第一个字符进行编码，并且该字符仍然相同，
    // 则对其进行编码。
    if (encodeAfter && encodeAfter === value.slice(0, 1)) {
      value = encodeCharacterReference(encodeAfter.charCodeAt(0)) + value.slice(1);
    }

    const encodingInfo = state.attentionEncodeSurroundingInfo;
    state.attentionEncodeSurroundingInfo = undefined;
    encodeAfter = undefined;

    // 如果我们必须对当前节点之前的第一个字符进行编码，并且该字符仍然相同，
    // 则对其进行编码。
    if (encodingInfo) {
      if (results.length > 0 && encodingInfo.before && before === results[results.length - 1].slice(-1)) {
        results[results.length - 1] = results[results.length - 1].slice(0, -1) + encodeCharacterReference(before.charCodeAt(0));
      }

      if (encodingInfo.after) encodeAfter = after;
    }

    tracker.move(value);
    results.push(value);
    before = value.slice(-1);
  }

  indexStack.pop();

  return results.join('');
}
