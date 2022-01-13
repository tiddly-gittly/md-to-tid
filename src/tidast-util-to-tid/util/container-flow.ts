import type { Context, Node, Parent } from '../types';


export function containerFlow(parent: Parent, context: Context): string {
  const indexStack = context.indexStack;
  const children = parent.children || [];
  /** @type {Array.<string>} */
  const results: Array<string> = [];
  let index = -1;

  indexStack.push(-1);

  while (++index < children.length) {
    const child = children[index];

    indexStack[indexStack.length - 1] = index;

    context.handle && results.push(context.handle(child, parent, context, { before: '\n', after: '\n' }));

    if (child.type !== 'list') {
      context.bulletLastUsed = undefined;
    }

    if (index < children.length - 1) {
      results.push(between(child, children[index + 1]));
    }
  }

  indexStack.pop();

  return results.join('');

  function between(left: Node, right: Node): string {
    let index = context.join.length;

    while (index--) {
      const result = context.join[index](left, right, parent, context);

      if (result === true || result === 1) {
        break;
      }

      if (typeof result === 'number') {
        return '\n'.repeat(1 + result);
      }

      if (result === false) {
        return '\n\n';
      }
    }

    return '\n\n';
  }
}
