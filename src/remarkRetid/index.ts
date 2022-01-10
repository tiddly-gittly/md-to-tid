import { Plugin, Processor } from 'unified';
import { Root as MdastRoot } from 'mdast';

export const remarkRetid: Plugin<[Processor, Options?] | [Options] | [], MdastRoot> = (destination, options) =>
  destination && 'run' in destination ? bridge(destination, options) : mutate(destination || options);
export default remarkRetid;

/**
 * Bridge-mode.
 * Runs the destination with the new tidast tree.
 */
export const bridge: Plugin<[Processor, Options?], MdastRoot> = (destination, options) => {
  return (node, file, next) => {
    destination.run(toHast(node, options), file, (error) => {
      next(error);
    });
  };
};

/**
 * Mutate-mode.
 * Further plugins run on the tidast tree.
 */
export const mutate: Plugin<[Options?] | [], MdastRoot, HastRoot> = (options) => {
  // @ts-expect-error: assume a corresponding node is returned by `toHast`.
  return (node) => toHast(node, options);
};
