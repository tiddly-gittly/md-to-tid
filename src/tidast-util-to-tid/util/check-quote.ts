/**
 * @typedef {import('../types').Context} Context
 * @typedef {import('../types').Options} Options
 */

/**
 * @param {Context} context
 * @returns {Exclude<Options['quote'], undefined>}
 */
export function checkQuote(context) {
  const marker = context.options.quote || '"';

  if (marker !== '"' && marker !== "'") {
    throw new Error('Cannot serialize title with `' + marker + '` for `options.quote`, expected `"`, or `\'`');
  }

  return marker;
}
