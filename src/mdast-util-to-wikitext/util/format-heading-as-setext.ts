import { Heading } from 'mdast';

import { EXIT, visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import { State } from '../types';

/**
 * 以Setext格式格式化标题节点。
 * 
 * @param node - 要格式化的标题节点。
 * @param state - 当前转换状态。
 * @returns 如果标题应该以Setext格式呈现，则返回true；否则返回false。
 */
export function formatHeadingAsSetext(node: Heading, state: State): boolean {
  // 标记是否存在带有换行符的文本节点
  let literalWithBreak = false;

  // 查找带有换行符的文本节点。
  // 注意，这也会检查换行符类型的节点
  visit(node, function (node) {
    // 如果节点包含值且值中包含换行符，或者节点类型为换行符
    if (('value' in node && /\r?\n|\r/.test(node.value)) || node.type === 'break') {
      // 标记存在带有换行符的文本节点
      literalWithBreak = true;
      // 停止遍历
      return EXIT;
    }
  });

  // 如果标题深度小于3，标题有内容，并且配置要求使用Setext格式或存在带有换行符的文本节点，则返回true
  return Boolean((!node.depth || node.depth < 3) && toString(node) && (state.options.setext || literalWithBreak));
}
