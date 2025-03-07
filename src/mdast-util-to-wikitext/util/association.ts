import { decodeString } from 'micromark-util-decode-string';
import type { Association } from 'mdast';

/**
 * 从关联对象中获取一个标识符，以便将其与其他关联对象进行匹配。
 *
 * 关联对象是通过ID与其他对象匹配的节点：
 * <https://github.com/syntax-tree/mdast#association>。
 *
 * 关联对象的`label`是字符串值：字符转义和引用有效，并且大小写保持不变。
 * `identifier`用于将一个关联对象与另一个关联对象进行匹配：
 * 有争议的是，字符转义和引用在这种匹配中不起作用：`&copy;` 与 `©` 不匹配，`\+` 与 `+` 不匹配。
 *
 * 但是忽略大小写，并且会去除首尾空格并将连续空格合并为一个：` A\nb` 与 `a b` 匹配。
 * 因此，在确定如何序列化时，我们更倾向于使用`label`：
 * 它包含空格、大小写，并且我们可以忽略大多数无用的字符转义以及所有字符引用。
 *
 * @type {AssociationId}
 */
export function association(node: Association): string {
  if (node.label || !node.identifier) {
    return node.label || '';
  }

  return decodeString(node.identifier);
}
