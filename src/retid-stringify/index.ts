import { toTid } from '../remark-retid/tidast-util-to-tid';
import { Plugin, Processor } from 'unified';
import { Root as MdastRoot } from 'mdast';

export default function remarkStringify(this: Plugin<[Processor, Options?] | [Options] | [], MdastRoot>, options) {
  /** @type {import('unified').CompilerFunction<Node, string>} */
  const compiler = (tree) => {
    // Assume options.
    const settings = /** @type {Options} */ this.data('settings');

    return toTid(
      tree,
      Object.assign({}, settings, options, {
        // Note: this option is not in the readme.
        // The goal is for it to be set by plugins on `data` instead of being
        // passed by users.
        extensions: /** @type {ToMarkdownOptions['extensions']} */ this.data('toMarkdownExtensions') || [],
      }),
    );
  };

  Object.assign(this, { Compiler: compiler });
}
