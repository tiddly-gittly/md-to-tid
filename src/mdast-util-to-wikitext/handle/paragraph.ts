import type { Paragraph } from 'mdast';
import type { Context, Parent, SafeOptions } from '../types';
import { containerPhrasing } from '../util/container-phrasing';

export function paragraph(node: Paragraph, parent: Parent | null | undefined, context: Context, safeOptions: SafeOptions) {
  const exit = context.enter('paragraph');
  const subexit = context.enter('phrasing');
  const value = containerPhrasing(node, context, { before: '\n', after: '\n' });
  subexit();
  exit();
  return value;
}
