import { Code } from 'mdast';
import type { Context } from '../types';

/**
 * @param {Code} node
 * @param {Context} context
 * @returns {boolean}
 */
export function formatCodeAsIndented(node: Code, context: Context): boolean {
  return Boolean(
    !context.options.fences &&
      node.value &&
      // If there’s no info…
      !node.lang &&
      // And there’s a non-whitespace character…
      /[^ \r\n]/.test(node.value) &&
      // And the value doesn’t start or end in a blank…
      !/^[\t ]*(?:[\r\n]|$)|(?:^|[\r\n])[\t ]*$/.test(node.value),
  );
}
