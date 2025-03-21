import { phrasing } from 'mdast-util-phrasing';
import { Parents, Root } from 'mdast';
import { Info, State } from '../types';

export function root(node: Root, _: Parents | undefined, state: State, info: Info): string {
  // Note: `html` nodes are ambiguous.
  const hasPhrasing = node.children.some(function (d) {
    return phrasing(d);
  });

  const container = hasPhrasing ? state.containerPhrasing : state.containerFlow;
  return container.call(state, node, info);
}
