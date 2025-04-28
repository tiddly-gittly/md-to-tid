import { Parents, Text } from 'mdast';
import { Info, State } from '../types';
import { linkEmbed } from './link-embed';

export function text(node: Text, _: Parents | undefined, state: State, info: Info): string {
  return linkEmbed(node,state,info);
}
