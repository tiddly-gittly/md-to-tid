import type { Link } from 'mdast';
import type { Context, Exit } from '../types';

import { checkQuote } from '../util/check-quote';
import { formatLinkAsAutolink } from '../util/format-link-as-autolink';
import { containerPhrasing } from '../util/container-phrasing';
import { safe } from '../util/safe';

link.peek = linkPeek;

export function link(node: Link, _: unknown, context: Context) {
  const quote = checkQuote(context);
  const suffix = quote === '"' ? 'Quote' : 'Apostrophe';
  let exit: Exit;
  let subexit: Exit;
  let value: string;

  if (formatLinkAsAutolink(node, context)) {
    // Hide the fact that we’re in phrasing, because escapes don’t work.
    const stack = context.stack;
    context.stack = [];
    exit = context.enter('autolink');
    value = '<' + containerPhrasing(node, context, { before: '<', after: '>' }) + '>';
    exit();
    context.stack = stack;
    return value;
  }

  exit = context.enter('link');
  subexit = context.enter('label');
  value = '[' + containerPhrasing(node, context, { before: '[', after: ']' }) + '](';
  subexit();

  if (
    // If there’s no url but there is a title…
    (!node.url && node.title) ||
    // If there are control characters or whitespace.
    /[\0- \u007F]/.test(node.url)
  ) {
    subexit = context.enter('destinationLiteral');
    value += '<' + safe(context, node.url, { before: '<', after: '>' }) + '>';
  } else {
    // No whitespace, raw is prettier.
    subexit = context.enter('destinationRaw');
    value += safe(context, node.url, {
      before: '(',
      after: node.title ? ' ' : ')',
    });
  }

  subexit();

  if (node.title) {
    subexit = context.enter('title' + suffix);
    value += ' ' + quote + safe(context, node.title, { before: quote, after: quote }) + quote;
    subexit();
  }

  value += ')';

  exit();
  return value;
}

/**
 * @param {Link} node
 */
function linkPeek(node: Link, _: unknown, context: Context) {
  return formatLinkAsAutolink(node, context) ? '<' : '[';
}
