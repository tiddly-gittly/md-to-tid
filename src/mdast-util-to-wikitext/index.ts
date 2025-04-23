import { zwitch } from 'zwitch';
import { configure } from './configure';
import { handle as handlers } from './handle/index';
import { join } from './join';
import { unsafe } from './unsafe';
import { association } from './util/association';
import { compilePattern } from './util/compile-pattern';
import { containerPhrasing } from './util/container-phrasing';
import { containerFlow } from './util/container-flow';
import { indentLines } from './util/indent-lines';
import { safe } from './util/safe';
import { track } from './util/track';
import { Nodes, Parents } from 'mdast';
import {
  ConstructName,
  Exit,
  FlowChildren,
  FlowParents,
  Info,
  Options,
  PhrasingParents,
  SafeConfig,
  State,
  TrackFields,
} from './types';
import { gfmTableToTid } from './util/gfm-table';
import { gfmFootnoteToTid } from './util/gfm-footnote';

/**
 * Turn an mdast syntax tree into markdown.
 *
 * @param {Nodes} tree
 *   Tree to serialize.
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {string}
 *   Serialized markdown representing `tree`.
 */
export function toTid(tree: Nodes, options: Options | null | undefined): string {
  const settings = options || {};
  const state: State = {
    associationId: association,
    containerPhrasing: containerPhrasingBound,
    containerFlow: containerFlowBound,
    createTracker: track,
    compilePattern,
    enter,
    handlers: { ...handlers },
    handle: (node: any, parent: Parents | undefined, state: State, Info: Info) => {
      return '';
    },
    indentLines,
    indexStack: [],
    join: [...join],
    options: {},
    safe: safeBound,
    stack: [],
    unsafe: [...unsafe],
  };

  configure(state, settings);

  // 注册表格处理函数
  configure(state, {
    handlers: { ...gfmTableToTid(settings).handlers },
    unsafe: [...gfmTableToTid(settings).gfmUnsafe],
  });

  // 注册脚注处理函数
  configure(state, {
    handlers: { ...gfmFootnoteToTid(settings).handlers },
    unsafe: [...gfmFootnoteToTid(settings).gfmUnsafe],
  });

  if (state.options.tightDefinitions) {
    state.join.push(joinDefinition);
  }

  state.handle = zwitch('type', {
    invalid,
    unknown,
    handlers: state.handlers,
  });

  let result = state.handle(tree, undefined, state, {
    before: '\n',
    after: '\n',
    now: { line: 1, column: 1 },
    lineShift: 0,
  });

  if (result && result.charCodeAt(result.length - 1) !== 10 && result.charCodeAt(result.length - 1) !== 13) {
    result += '\n';
  }

  return result;

  /** @type {Enter} */
  function enter(name: ConstructName): Exit {
    state.stack.push(name);
    return exit;

    /**
     * @returns {undefined}
     */
    function exit(): undefined {
      state.stack.pop();
    }
  }
}

/**
 * @param {unknown} value
 * @returns {never}
 */
function invalid(value: unknown): never {
  throw new Error('Cannot handle value `' + value + '`, expected node');
}

/**
 * @param {unknown} value
 * @returns {never}
 */
function unknown(value: unknown): never {
  // Always a node.
  throw new Error('Cannot handle unknown node `' + value + '`');
}

/** @type {Join} */
function joinDefinition(left: FlowChildren, right: FlowChildren): number | undefined {
  // No blank line between adjacent definitions.
  if (left.type === 'definition' && left.type === right.type) {
    return 0;
  }
}

/**
 * Serialize the children of a parent that contains phrasing children.
 *
 * These children will be joined flush together.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {PhrasingParents} parent
 *   Parent of flow nodes.
 * @param {Info} info
 *   Info on where we are in the document we are generating.
 * @returns {string}
 *   Serialized children, joined together.
 */
function containerPhrasingBound(this: State, parent: PhrasingParents, info: Info): string {
  return containerPhrasing(parent, this, info);
}

/**
 * Serialize the children of a parent that contains flow children.
 *
 * These children will typically be joined by blank lines.
 * What they are joined by exactly is defined by `Join` functions.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {FlowParents} parent
 *   Parent of flow nodes.
 * @param {TrackFields} info
 *   Info on where we are in the document we are generating.
 * @returns {string}
 *   Serialized children, joined by (blank) lines.
 */
function containerFlowBound(this: State, parent: FlowParents, info: TrackFields): string {
  return containerFlow(parent, this, info);
}

/**
 * Make a string safe for embedding in markdown constructs.
 *
 * In markdown, almost all punctuation characters can, in certain cases,
 * result in something.
 * Whether they do is highly subjective to where they happen and in what
 * they happen.
 *
 * To solve this, `mdast-util-to-markdown` tracks:
 *
 * * Characters before and after something;
 * * What “constructs” we are in.
 *
 * This information is then used by this function to escape or encode
 * special characters.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {string | null | undefined} value
 *   Raw value to make safe.
 * @param {SafeConfig} config
 *   Configuration.
 * @returns {string}
 *   Serialized markdown safe for embedding.
 */
function safeBound(this: State, value: string | null | undefined, config: SafeConfig): string {
  return safe(this, value, config);
}
