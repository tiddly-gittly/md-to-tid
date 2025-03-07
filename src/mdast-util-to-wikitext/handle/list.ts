import type { List } from 'mdast';
import type { Handle } from '../types';

import { containerFlow } from '../util/container-flow';

// 我需要把bullet给子元素item。
// 现在是子元素为当前元素，现在我的子元素有有两种情况，段落或者list，假设 是list，我要把父元素给我的bullet给list。
// 现在回到list函数，item父元素通过祖父元素list给我了bullet。我需要把他们结合起来然后再给子元素。
// list的任务就是选择bullet，然后接收上级元素给的bullet，然后传递结合好的bullet给下级元素。
// 现在是第二种情况，段落。我现在是当前元素是item，我的子元素是最终的段落，我把积累下来的bullet传递给段落，段落接收到bullet
// 解析段落结点，然后结合bullet，并返回。
// 现在就逐层返回了。通过变量 = 函数的方式。
// 现在是一条路径，我有很多条路径，现在推演第二条路径推算bullet如何去适应修改。
let bullet_stack: string[] = [];
export const list: Handle = function list(node: List, parent: unknown, context): string {
  const exit = context.enter(`list`);

  bullet_stack.push(node.ordered === true ? '#' : '*');
  context.bullet = bullet_stack.join('');
  const value = containerFlow(node, context);
  bullet_stack.pop();
  context.bullet = '';
  exit();
  return value;
};
