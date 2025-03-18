import { Parents, Text } from 'mdast';
import { Info, State } from '../types';

export function text(node: Text, _: Parents | undefined, state: State, info: Info): string {
  return state.safe(node.value, info);
}
