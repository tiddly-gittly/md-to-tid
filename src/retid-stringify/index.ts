import { Options as IToMarkdownOptions, toTid } from '../tidast-util-to-tid';
import { Plugin, Processor, CompilerFunction } from 'unified';
import { Root as MdastRoot, Content as MdastContent } from 'mdast';
import { merge } from 'lodash';

type MdastNode = MdastRoot | MdastContent;

export type IOptions = Omit<IToMarkdownOptions, 'extensions'>;

// @ts-expect-error: bad type written by unified author.
export const retidStringify: Plugin<[(IOptions | undefined)?] | void[], MdastRoot, string> = function (options) {
  const compiler: CompilerFunction<MdastNode, string> = (tree) => {
    // Assume options.
    const settings = this.data('settings') as IOptions;

    return toTid(
      tree,
      merge({ bullet: '*', bulletOrdered: '#', incrementListMarker: false }, settings, options, {
        // Note: this option is not in the readme.
        // The goal is for it to be set by plugins on `data` instead of being
        // passed by users.
        extensions: this.data('toMarkdownExtensions') || ([] as IToMarkdownOptions['extensions']),
      }) as IOptions,
    );
  };

  Object.assign(this, { Compiler: compiler });
};
export default retidStringify;
