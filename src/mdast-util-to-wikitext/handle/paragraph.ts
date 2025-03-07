import type { Paragraph } from 'mdast';
import type { Context, SafeOptions } from '../types';
import { containerPhrasing } from '../util/container-phrasing';

export function paragraph(node: Paragraph, parent: unknown, context: Context, safeOptions: SafeOptions): string {
  const exit = context.enter('paragraph');
  const subExit = context.enter('phrasing');

  const value = containerPhrasing(node, context, { before: '\n', after: '\n' });

  subExit();
  exit();
  return value;
}
