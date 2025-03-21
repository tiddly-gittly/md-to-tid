import { toString } from 'mdast-util-to-string';
import { Link } from 'mdast';
import { State } from '../types';

/**
 * 检查一个链接节点是否应格式化为自动链接。
 * 
 * @param node - 要检查的链接节点。
 * @param state - 当前的转换状态。
 * @returns 如果链接应格式化为自动链接，则返回 true；否则返回 false。
 */
export function formatLinkAsAutolink(node: Link, state: State): boolean {
  // 获取节点的原始文本内容
  const raw = toString(node);

  return Boolean(
    // 如果没有启用资源链接选项
    !state.options.resourceLink &&
    // 如果存在链接地址
    node.url &&
    // 如果没有链接标题
    !node.title &&
    // 如果节点的子节点存在
    node.children &&
    // 并且子节点只有一个
    node.children.length === 1 &&
    // 且该子节点类型为文本
    node.children[0].type === 'text' &&
    // 如果原始文本内容与链接地址相同，或者在原始文本前加上 'mailto:' 后与链接地址相同
    (raw === node.url || 'mailto:' + raw === node.url) &&
    // 并且链接地址以协议开头
    /^[a-z][a-z+.-]+:/i.test(node.url) &&
    // 并且链接地址不包含 ASCII 控制字符、空格或尖括号
    !/[\0- <>\u007F]/.test(node.url),
  );
}
