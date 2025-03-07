import type { Link } from 'mdast';
import type { Context, Exit } from '../types';

import { formatLinkAsExtensionLink } from '../util/format-link-as-external-link';
import { containerPhrasing } from '../util/container-phrasing';

export function link(node: Link, parent: unknown, context: Context): string {
  // return formatLinkAsExtensionLink(node, context) ? '[ext[' : '[[';peek
  let exit: Exit;
  let subexit: Exit;
  let value: string = '';

  if (formatLinkAsExtensionLink(node, context)) {
    // Hide the fact that we’re in phrasing, because escapes don’t work.
    const stack = context.stack;
    context.stack = [];
    exit = context.enter('autolink');
    value = '[ext[' + containerPhrasing(node, context, { before: '[ext[', after: ']]' }) + ']]';
    exit();
    context.stack = stack;
    return value;
  }

  exit = context.enter('link');
  subexit = context.enter('label');
  const childValue = containerPhrasing(node, context, { before: '[[', after: ']]' });
  const separateLine = childValue ? '|' : '';
  subexit();

  if ((!node.url && node.title) || /[\0- \u007F]/.test(node.url)) {
    // If there’s no url but there is a title…
    // If there are control characters or whitespace.
    subexit = context.enter('destinationLiteral');
    value = `[[${childValue}${separateLine}${node.url}]]`;
  } else {
    // No whitespace, raw is prettier.
    subexit = context.enter('destinationRaw');
    value = `[[${childValue}${separateLine}${node.url}]]`;
  }

  subexit();

  exit();
  return value;
}
