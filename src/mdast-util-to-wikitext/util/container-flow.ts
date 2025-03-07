import { FlowChildren, FlowParents, State, TrackFields } from '../types.js';

/**
 * @param {FlowParents} parent
 *   流节点的父节点。
 * @param {State} state
 *   关于当前状态的信息。
 * @param {TrackFields} info
 *   关于我们在生成文档中的位置的信息。
 * @returns {string}
 *   序列化后的子节点，用（空）行连接。
 */
export function containerFlow(parent: FlowParents, state: State, info: TrackFields): string {
  const indexStack = state.indexStack;
  const children = parent.children || [];
  const tracker = state.createTracker(info);
  const results: Array<string> = [];
  let index = -1;

  indexStack.push(-1);

  while (++index < children.length) {
    const child = children[index];

    indexStack[indexStack.length - 1] = index;

    results.push(
      tracker.move(
        state.handle(child, parent, state, {
          before: '\n',
          after: '\n',
          ...tracker.current(),
        }),
      ),
    );

    if (child.type !== 'list') {
      state.bulletLastUsed = undefined;
    }

    if (index < children.length - 1) {
      results.push(tracker.move(between(child, children[index + 1], parent, state)));
    }
  }

  indexStack.pop();

  return results.join('');
}

/**
 * @param {FlowChildren} left
 *   左侧的流节点。
 * @param {FlowChildren} right
 *   右侧的流节点。
 * @param {FlowParents} parent
 *   流节点的父节点。
 * @param {State} state
 *   关于当前状态的信息。
 * @returns {string}
 *   节点之间的分隔符。
 */
function between(left: FlowChildren, right: FlowChildren, parent: FlowParents, state: State): string {
  let index = state.join.length;

  while (index--) {
    const result = state.join[index](left, right, parent, state);

    if (result === true || result === 1) {
      break;
    }

    if (typeof result === 'number') {
      return '\n'.repeat(1 + result);
    }

    if (result === false) {
      return '\n\n<!---->\n\n';
    }
  }

  return '\n\n';
}
