import { u } from 'unist-builder';
import { visit } from 'unist-util-visit';
import { pointStart, pointEnd } from 'unist-util-position';
import { generated } from 'unist-util-generated';
import { definitions } from 'mdast-util-definitions';
import { one } from './traverse.js';
import { footer } from './footer.js';
import { handlers } from './handlers/index.js';

const own = {}.hasOwnProperty;

/**
 * Factory to transform.
 * @param {MdastNode} tree mdast node
 * @param {Options} [options] Configuration
 * @returns {H} `h` function
 */
function factory(tree, options) {
  const settings = options || {};
  const dangerous = settings.allowDangerousHtml || false;
  /** @type {Object.<string, FootnoteDefinition>} */
  const footnoteById = {};

  h.dangerous = dangerous;
  h.clobberPrefix = settings.clobberPrefix === undefined || settings.clobberPrefix === null ? 'user-content-' : settings.clobberPrefix;
  h.footnoteLabel = settings.footnoteLabel || 'Footnotes';
  h.footnoteBackLabel = settings.footnoteBackLabel || 'Back to content';
  h.definition = definitions(tree);
  h.footnoteById = footnoteById;
  /** @type {Array.<string>} */
  h.footnoteOrder = [];
  /** @type {Record.<string, number>} */
  h.footnoteCounts = {};
  h.augment = augment;
  h.handlers = { ...handlers, ...settings.handlers };
  h.unknownHandler = settings.unknownHandler;
  h.passThrough = settings.passThrough;

  visit(tree, 'footnoteDefinition', (definition) => {
    const id = String(definition.identifier).toUpperCase();

    // Mimick CM behavior of link definitions.
    // See: <https://github.com/syntax-tree/mdast-util-definitions/blob/8290999/index.js#L26>.
    if (!own.call(footnoteById, id)) {
      footnoteById[id] = definition;
    }
  });

  // @ts-expect-error Hush, it’s fine!
  return h;

  /**
   * Finalise the created `right`, a hast node, from `left`, an mdast node.
   * @param {(NodeWithData|PositionLike)?} left
   * @param {Content} right
   * @returns {Content}
   */
  function augment(left, right) {
    // Handle `data.hName`, `data.hProperties, `data.hChildren`.
    if (left?.data) {
      const data: Data = left.data;

      if (data.hName) {
        if (right.type !== 'element') {
          right = {
            type: 'element',
            tagName: '',
            properties: {},
            children: [],
          };
        }

        right.tagName = data.hName;
      }

      if (right.type === 'element' && data.hProperties) {
        right.properties = { ...right.properties, ...data.hProperties };
      }

      if ('children' in right && right.children && data.hChildren) {
        right.children = data.hChildren;
      }
    }

    if (left) {
      const ctx = 'type' in left ? left : { position: left };

      if (!generated(ctx)) {
        right.position = { start: pointStart(ctx), end: pointEnd(ctx) };
      }
    }

    return right;
  }

  /**
   * Create an element for `node`.
   *
   * @type {HFunctionProps}
   */
  function h(node, tagName, props, children) {
    if (Array.isArray(props)) {
      children = props;
      props = {};
    }

    // @ts-expect-error augmenting an element yields an element.
    return augment(node, {
      type: 'element',
      tagName,
      properties: props || {},
      children: children || [],
    });
  }
}

/**
 * Transform `tree` (an mdast node) to a hast node.
 *
 * @param {MdastNode} tree mdast node
 * @param {Options} [options] Configuration
 * @returns {HastNode|null|undefined} hast node
 */
export function toHast(tree, options) {
  const h = factory(tree, options);
  const node = one(h, tree, null);
  const foot = footer(h);

  if (foot) {
    // @ts-expect-error If there’s a footer, there were definitions, meaning block
    // content.
    // So assume `node` is a parent node.
    node.children.push(u('text', '\n'), foot);
  }

  return Array.isArray(node) ? { type: 'root', children: node } : node;
}

export { handlers as defaultHandlers } from './handlers/index.js';
