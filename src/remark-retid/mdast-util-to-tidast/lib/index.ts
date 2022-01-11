/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { u } from 'unist-builder';
import { visit } from 'unist-util-visit';
import { Root as MdastRoot, Content as MdastContent, Parent as MdastParent } from 'mdast';
import { Root as TidastRoot, Content as TidastContent, Parent as TidastParent } from '../../tidast';
import { toString } from 'nlcst-to-string';
import { location } from 'vfile-location';
import { VFile } from 'vfile';
import { Handler, handlers } from './handlers';
import { one } from './traverse';

export type MdastNode = MdastContent | MdastRoot;
export type TidastNode = TidastContent | TidastRoot;

const defaultIgnore = ['table', 'tableRow', 'tableCell'];
const defaultSource = ['inlineCode'];

interface IOptions {
  ignore?: string[];
  source?: string[];
}

/**
 * Transform a `tree` in mdast to nlcst.
 */
export function toTidast(tree: MdastNode, options: IOptions = {}): TidastNode | undefined {
  // Crash on invalid parameters.
  if (!tree || !tree.type) {
    throw new Error('mdast-util-to-tidast expected node');
  }

  // if (!tree.position || !tree.position.start || !tree.position.start.column || !tree.position.start.line) {
  //   throw new Error('mdast-util-to-tidast expected position on nodes');
  // }

  const result = one(
    {
      handlers,
      ignore: options.ignore ? [...defaultIgnore, ...options.ignore] : defaultIgnore,
      source: options.source ? [...defaultSource, ...options.source] : defaultSource,
    },
    tree,
  );

  return result;
}

export interface IConfiguration {
  handlers: Record<string, Handler>;
  ignore: string[];
  source: string[];
}

/**
 * Patch a position on each node in `nodes`.
 * `offset` is the offset in `file` this run of content starts at.
 *
 * @template {NlcstContent[]} T
 * @param {Context} config
 * @param {T} nodes
 * @param {number|undefined} offset
 * @returns {T}
 */
// function patch<T extends TidastContent[]>(config: IConfiguration, nodes: T, offset: number | undefined): T {
//   let index = -1;
//   let start = offset;

//   while (++index < nodes.length) {
//     const node = nodes[index];

//     if ('children' in node) {
//       patch(config, node.children, start);
//     }

//     const end = typeof start === 'number' ? start + toString(node).length : undefined;

//     node.position =
//       start !== undefined && end !== undefined
//         ? {
//             start: config.place.toPoint(start),
//             end: config.place.toPoint(end),
//           }
//         : undefined;

//     start = end;
//   }

//   return nodes;
// }
