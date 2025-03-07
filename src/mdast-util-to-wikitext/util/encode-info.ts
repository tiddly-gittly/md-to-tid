import { classifyCharacter } from 'micromark-util-classify-character';
import { EncodeSides } from '../types';

/**
 * 检查是否需要对注意力运行符周围的字符进行编码（作为字符引用）。
 *
 * 注意力运行符周围的字符会影响其是否有效。
 *
 * 更多信息请参见 <https://github.com/orgs/syntax-tree/discussions/60>。
 * 可以在特定的渲染器中查看以下 Markdown 以了解其工作原理：
 *
 * ```markdown
 * |                         | A (内部为字母) | B (内部为标点符号) | C (内部为空白字符) | D (内部为空) |
 * | ----------------------- | -------------- | ------------------ | ------------------ | ------------ |
 * | 1 (外部为字母)          | x*y*z          | x*.*z              | x* *z              | x**z         |
 * | 2 (外部为标点符号)      | .*y*.          | .*.*.              | .* *.              | .**.         |
 * | 3 (外部为空白字符)      | x *y* z        | x *.* z            | x * * z            | x ** z       |
 * | 4 (外部为空)            | *x*            | *.*                | * *                | **           |
 * ```
 *
 * @param {number} outside
 *   运行符外侧的字符代码点。
 * @param {number} inside
 *   运行符内侧的字符代码点。
 * @param {'*' | '_'} marker
 *   运行符的标记。
 *   下划线的处理比星号更严格（它们形成有效格式的情况更少）。
 * @returns {EncodeSides}
 *   是否对字符进行编码。
 */
// 重要提示：标点符号绝不能进行编码。
// 标点符号仅用于 Markdown 结构。
// 并且用于编码本身。
// 对它们进行编码会破坏结构或导致双重编码。
export function encodeInfo(outside: number, inside: number, marker: '*' | '_'): EncodeSides {
  const outsideKind = classifyCharacter(outside);
  const insideKind = classifyCharacter(inside);

  // 外侧为字母：
  if (outsideKind === undefined) {
    return insideKind === undefined
      ? // 内侧为字母：
      // 对于 `_`，我们必须对两个字母都进行编码，因为它的规则更宽松。
      // 对于 `*`（以及 GFM 的 `~`），它已经可以正常工作。
      marker === '_'
        ? { inside: true, outside: true }
        : { inside: false, outside: false }
      : insideKind === 1
        ? // 内侧为空白字符：对两者（字母，空白字符）都进行编码。
        { inside: true, outside: true }
        : // 内侧为标点符号：对外侧（字母）进行编码
        { inside: false, outside: true };
  }

  // 外侧为空白字符：
  if (outsideKind === 1) {
    return insideKind === undefined
      ? // 内侧为字母：已经可以正常工作。
      { inside: false, outside: false }
      : insideKind === 1
        ? // 内侧为空白字符：对两者（空白字符）都进行编码。
        { inside: true, outside: true }
        : // 内侧为标点符号：已经可以正常工作。
        { inside: false, outside: false };
  }

  // 外侧为标点符号：
  return insideKind === undefined
    ? // 内侧为字母：已经可以正常工作。
    { inside: false, outside: false }
    : insideKind === 1
      ? // 内侧为空白字符：对内侧（空白字符）进行编码。
      { inside: true, outside: false }
      : // 内侧为标点符号：已经可以正常工作。
      { inside: false, outside: false };
}
