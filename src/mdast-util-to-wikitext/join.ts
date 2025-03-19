import { formatCodeAsIndented } from './util/format-code-as-indented.js';
import { Join, State } from './types';
import { Nodes, Parent } from 'mdast';

/**
 * 定义一个用于合并节点的函数数组，初始包含一个默认的合并函数。
 */
export const join: Array<Join> = [joinDefaults];

/**
 * 默认的节点合并函数，用于判断两个相邻节点是否应该合并。
 *
 * @param left - 左侧节点。
 * @param right - 右侧节点。
 * @param parent - 父节点。
 * @param state - 当前转换状态。
 * @returns 如果节点应该合并，返回相应的合并规则；否则返回 undefined。
 */
function joinDefaults(left: Nodes, right: Nodes, parent: Parent, state: State): boolean | number | undefined {
  // 列表或另一个缩进代码块后的缩进代码块。
  if (
    right.type === 'code' &&
    formatCodeAsIndented(right, state) &&
    (left.type === 'list' || (left.type === right.type && formatCodeAsIndented(left, state)))
  ) {
    return false;
  }

  // 合并列表或列表项的子节点。
  // 在这种情况下，`parent` 有一个 `spread` 字段。
  if ('spread' in parent && typeof parent.spread === 'boolean') {
    if (
      left.type === 'paragraph' &&
      // 两个段落。
      (left.type === right.type || right.type === 'definition')
    ) {
      return;
    }

    return parent.spread ? 1 : 0;
  }
}
