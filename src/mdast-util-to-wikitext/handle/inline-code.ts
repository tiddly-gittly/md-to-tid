import { InlineCode, Parents } from 'mdast';
import { State } from '../types';

// 为 inlineCode 函数添加 peek 方法，指向 inlineCodePeek 函数
inlineCode.peek = inlineCodePeek;

export function inlineCode(node: InlineCode, _: Parents | undefined, state: State): string {
  let value = node.value || '';
  let sequence = '`';
  let index = -1;

  // 如果代码中存在单个独立的反引号，则使用两个反引号作为分隔符
  // 如果代码中存在连续两个反引号，则使用一个反引号作为分隔符
  while (new RegExp('(^|[^`])' + sequence + '([^`]|$)').test(value)) {
    // 增加反引号序列的长度
    sequence += '`';
  }

  // 如果代码不只是空格或换行符（制表符不算），并且代码的第一个或最后一个字符是空格、换行符或反引号，则在代码前后添加空格
  if (/[^ \r\n]/.test(value) && ((/^[ \r\n]/.test(value) && /[ \r\n]$/.test(value)) || /^`|`$/.test(value))) {
    value = ' ' + value + ' ';
  }

  // 存在一个潜在问题：换行符后的某些字符可能会导致块级元素被识别
  // 例如，如果有人注入字符串 `'\n# b'`，则会导致一个 ATX 标题的出现
  // 我们不能在内联代码中转义字符，但由于从 Markdown 转换为 HTML 时换行符会被转换为空格，所以我们可以将其替换掉
  while (++index < state.unsafe.length) {
    // 获取状态中不安全字符列表的当前pattern
    // 编译当前pattern为正则表达式
    const pattern = state.unsafe[index];
    const expression = state.compilePattern(pattern);
    let match: RegExpExecArray | null;

    // 只查找在换行符处匹配的模式
    // 注意：atBreak 模式的正则表达式总是从换行符（LF 或 CR）开始
    if (!pattern.atBreak) continue;

    // 循环查找所有匹配的模式
    while ((match = expression.exec(value))) {
      // 获取匹配的起始位置
      let position = match.index;

      // 支持 CRLF（模式只查找其中一个字符）
      if (value.charCodeAt(position) === 10 /* `\n` */ && value.charCodeAt(position - 1) === 13 /* `\r` */) {
        // 如果是 CRLF，将位置前移一位
        position--;
      }

      // 将匹配位置的字符替换为空格
      value = value.slice(0, position) + ' ' + value.slice(match.index + 1);
    }
  }

  return sequence + value + sequence;
}

function inlineCodePeek(): string {
  return '`';
}
