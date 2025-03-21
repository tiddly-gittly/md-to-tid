import { Paragraph, Parents } from 'mdast';
import { Info, State } from '../types';

export function paragraph(node: Paragraph, _: Parents | undefined, state: State, info: Info): string {
  const exit = state.enter('paragraph');
  const subexit = state.enter('phrasing');
  const value = state.containerPhrasing(node, info);
  subexit();
  exit();
  return value;
}
