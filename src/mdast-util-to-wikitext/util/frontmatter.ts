import { Info, Matter, Options, toMatters } from 'micromark-extension-frontmatter';
import escapeStringRegexp from 'escape-string-regexp';
import { Literal } from 'mdast';
import { Options as ToMarkdownExtension } from '../types';

/**
 * Create an extension for `mdast-util-to-markdown`.
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {ToMarkdownExtension}
 *   Extension for `mdast-util-to-markdown`.
 */
export function frontMatterToTid(options: Options) {
  const gfmUnsafe: ToMarkdownExtension['unsafe'] = [];
  const handlers: ToMarkdownExtension['handlers'] = {};
  const matters = toMatters(options);
  let index = -1;

  while (++index < matters.length) {
    const matter = matters[index];

    // Typing this is the responsibility of the end user.
    handlers[matter.type] = handler(matter);

    const open = fence(matter, 'open');

    gfmUnsafe.push({
      atBreak: true,
      character: open.charAt(0),
      after: escapeStringRegexp(open.charAt(1)),
    });
  }

  return { gfmUnsafe, handlers };
}

/**
 * Create a handle that can serialize a front matter node as markdown.
 *
 * @param {Matter} matter
 *   Structure.
 * @returns {(node: Literal) => string} enter
 *   Handler.
 */
function handler(matter: Matter): (node: Literal) => string {
  const open = fence(matter, 'open');
  const close = fence(matter, 'close');

  return handle;

  /**
   * Serialize a front matter node as markdown.
   *
   * @param {Literal} node
   *   Node to serialize.
   * @returns {string}
   *   Serialized node.
   */
  function handle(node: Literal): string {
    return open + (node.value ? '\n' + node.value : '') + '\n' + close;
  }
}

/**
 * Get an `open` or `close` fence.
 *
 * @param {Matter} matter
 *   Structure.
 * @param {'close' | 'open'} prop
 *   Field to get.
 * @returns {string}
 *   Fence.
 */
function fence(matter: Matter, prop: 'close' | 'open'): string {
  return matter.marker
    ? pick(matter.marker, prop).repeat(3)
    : // @ts-expect-error: They’re mutually exclusive.
      pick(matter.fence, prop);
}

/**
 * Take `open` or `close` fields when schema is an info object, or use the
 * given value when it is a string.
 *
 * @param {Info | string} schema
 *   Info object or value.
 * @param {'close' | 'open'} prop
 *   Field to get.
 * @returns {string}
 *   Thing to use for the opening or closing.
 */
function pick(schema: Info | string, prop: 'close' | 'open'): string {
  return typeof schema === 'string' ? schema : schema[prop];
}
