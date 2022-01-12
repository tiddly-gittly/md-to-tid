import { zwitch } from 'zwitch';
import { configure } from './configure';
import { handle } from './handle/index';
import { join } from './join';
import { inConstruct } from './inConstruct';
import type { Context, Node, Options, Handle } from './types';

/**
 * @param {Node} tree
 * @param {Options} [options]
 * @returns {string}
 */
export function toTid(tree: Node, options: Options = {}): string {
  const context: Context = {
    enter,
    stack: [],
    inConstruct: [],
    join: [],
    handlers: {},
    options: {},
    indexStack: [],
  };

  configure(context, { inConstruct, join, handlers: handle });
  configure(context, options);

  if (context.options.tightDefinitions) {
    configure(context, { join: [joinDefinition] });
  }

  // @ts-expect-error: bad type written by zwitch author.
  context.handle = zwitch<Handle>('type', {
    invalid,
    unknown,
    handlers: context.handlers,
  });

  let result = context.handle(tree, null, context, { before: '\n', after: '\n' });

  if (result && result.charCodeAt(result.length - 1) !== 10 && result.charCodeAt(result.length - 1) !== 13) {
    result += '\n';
  }

  return result;

  function enter(typeName: string) {
    context.stack.push(typeName);
    return exit;

    function exit() {
      context.stack.pop();
    }
  }
}

function invalid(value: Node) {
  throw new Error('Cannot handle value `' + value + '`, expected node');
}

function unknown(node: Node) {
  throw new Error('Cannot handle unknown node `' + node.type + '`');
}

function joinDefinition(left: Node, right: Node) {
  // No blank line between adjacent definitions.
  if (left.type === 'definition' && left.type === right.type) {
    return 0;
  }
}
