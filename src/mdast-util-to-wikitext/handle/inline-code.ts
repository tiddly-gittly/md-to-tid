import type { InlineCode } from 'mdast';
import type { Conflict, Context, SafeOptions } from '../types';

export function inlineCode(node: InlineCode, parent: unknown, context: Context, safeOptions: SafeOptions): string {
  // return '`';peek
  let value = node.value || '';
  let sequence = '`';
  let index = -1;

  // If there is a single grave accent on its own in the code, use a fence of
  // two.
  // If there are two in a row, use one.
  while (new RegExp('(^|[^`])' + sequence + '([^`]|$)').test(value)) {
    sequence += '`';
  }

  // If this is not just spaces or eols (tabs don’t count), and either the
  // first or last character are a space, eol, or tick, then pad with spaces.
  if (/[^\n\r ]/.test(value) && ((/^[\n\r ]/.test(value) && /[\n\r ]$/.test(value)) || /^`|`$/.test(value))) {
    value = ' ' + value + ' ';
  }

  // We have a potential problem: certain characters after eols could result in
  // blocks being seen.
  // For example, if someone injected the string `'\n# b'`, then that would
  // result in an ATX heading.
  // We can’t escape characters in `inlineCode`, but because eols are
  // transformed to spaces when going from markdown to HTML anyway, we can swap
  // them out.
  while (++index < context.conflict.length) {
    const pattern = context.conflict[index];
    const expression = patternCompile(pattern);
    let match: RegExpExecArray | null;

    // Only look for `atBreak`s.
    // Btw: note that `atBreak` patterns will always start the regex at LF or
    // CR.
    if (!pattern.atBreak) continue;

    while ((match = expression.exec(value))) {
      let position = match.index;

      // Support CRLF (patterns only look for one of the characters).
      if (value.charCodeAt(position) === 10 /* `\n` */ && value.charCodeAt(position - 1) === 13 /* `\r` */) {
        position--;
      }

      value = value.slice(0, position) + ' ' + value.slice(match.index + 1);
    }
  }

  return sequence + value + sequence;
}

function patternCompile(pattern: Conflict): RegExp {
  if (!pattern._compiled) {
    // before要么是换行要么是空字符串
    const before = (pattern.atBreak ? '[\\r\\n][\\t ]*' : '') + (pattern.before ? '(?:' + pattern.before + ')' : '');

    // 四部分表达式组成，第二部分是含有任意一个字符就被自动替换为\\，问题在这里，为啥要这样做？
    pattern._compiled = new RegExp(
      (before ? '(' + before + ')' : '') +
        (/[|\\{}()[\]^$+*?.-]/.test(pattern.character) ? '\\' : '') +
        pattern.character +
        (pattern.after ? '(?:' + pattern.after + ')' : ''),
      'g',
    );
  }

  return pattern._compiled;
}
