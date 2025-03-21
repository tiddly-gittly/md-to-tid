import { Html } from 'mdast';

html.peek = htmlPeek;

export function html(node: Html): string {
  return node.value || '';
}

function htmlPeek(): string {
  return '<';
}
