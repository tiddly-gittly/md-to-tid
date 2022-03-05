import type { Link } from 'mdast';
import type { Context, Exit, Parent } from '../types';

import { formatLinkAsExtLink } from '../util/format-link-as-external-link';
import { containerPhrasing } from '../util/container-phrasing';
import { safe } from '../util/safe';

link.peek = linkPeek;

export function link(node: Link, parent: Parent | null | undefined, context: Context) {
  let exit: Exit;
  let subexit: Exit;
  let value: string = '';

  if (formatLinkAsExtLink(node, context)) {
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

  if (
    // If there’s no url but there is a title…
    (!node.url && node.title) ||
    // If there are control characters or whitespace.
    /[\0- \u007F]/.test(node.url)
  ) {
    subexit = context.enter('destinationLiteral');
    value = `[[${childValue}${separateLine}${safe(context, node.url, { before: '[[', after: ']]' })}]]`;
  } else {
    // No whitespace, raw is prettier.
    subexit = context.enter('destinationRaw');
    value = `[[${childValue}${separateLine}${safe(context, node.url, {
      before: '[[',
      after: node.title ? ' ' : ']]',
    })}]]`;
  }

  subexit();

  exit();
  return value;
}

function linkPeek(node: Link, parent: Parent | null | undefined, context: Context) {
  return formatLinkAsExtLink(node, context) ? '[ext[' : '[[';
}
