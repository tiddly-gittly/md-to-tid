import { Parent as MdastParent } from 'mdast';
import type { IConfiguration, MdastNode, TidastNode } from '.';
/**
 * Transform a single node.
 */
export function one(config: IConfiguration, node: MdastNode): TidastNode | undefined {
  if (node.type in config.handlers) {
    const result = config.handlers[node.type](node);
    if (result !== undefined) {
      // TODO: patch location or something
      return result;
    }
  }
  // const start = node.position ? node.position.start.offset : undefined;
  // if (!config.ignore.includes(node.type)) {
  //   if (config.source.includes(node.type) && start && node.position) {
  //     return patch(config, [config.parser.tokenizeSource(config.doc.slice(start, node.position.end.offset))], start);
  //   }
  //   if ('children' in node) {
  //     return all(config, node);
  //   }
  //   return patch(config, config.parser.tokenize(node.value), start);
  // }
}

/**
 * Transform all nodes in `parent`.
 */
export function allChildren(config: IConfiguration, parent: MdastParent): TidastNode[] {
  const results: TidastNode[] = [];
  for (let index = 0; index < parent.children.length; index += 1) {
    const child = parent.children[index];
    const result = one(config, child);
    if (result !== undefined) results.push(result);
  }

  return results;
}
