/**
 * 将一个码点编码为字符引用。
 *
 * @param {number} code
 *   要编码的码点。
 * @returns {string}
 *   编码后的字符引用。
 */
export function encodeCharacterReference(code: number): string {
  return '&#x' + code.toString(16).toUpperCase() + ';';
}
