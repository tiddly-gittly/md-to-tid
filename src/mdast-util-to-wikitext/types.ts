import type { Association, Parents, PhrasingContent, TableCell, TableRow } from 'mdast';
import type { Point } from 'unist';

/**
 * Get an identifier from an association to match it to others.
 *
 * Associations are nodes that match to something else through an ID:
 * <https://github.com/syntax-tree/mdast#association>.
 *
 * The `label` of an association is the string value: character escapes and
 * references work, and casing is intact.
 * The `identifier` is used to match one association to another:
 * controversially, character escapes and references don’t work in this
 * matching: `&copy;` does not match `©`, and `\+` does not match `+`.
 *
 * But casing is ignored (and whitespace) is trimmed and collapsed: ` A\nb`
 * matches `a b`.
 * So, we do prefer the label when figuring out how we’re going to serialize:
 * it has whitespace, casing, and we can ignore most useless character
 * escapes and all character references.
 *
 * @param node
 *   Node that includes an association.
 * @returns
 *   ID.
 */
export type AssociationId = (node: Association) => string;

/**
 * Compile an unsafe pattern to a regex.
 *
 * @param info
 *   Pattern.
 * @returns
 *   Regex.
 */
export type CompilePattern = (info: Unsafe) => RegExp;

/**
 * Interface of registered constructs.
 *
 * When working on extensions that use new constructs, extend the corresponding
 * interface to register its name:
 *
 * ```ts
 * declare module 'mdast-util-to-markdown' {
 *   interface ConstructNameMap {
 *     // Register a new construct name (value is used, key should match it).
 *     gfmStrikethrough: 'gfmStrikethrough'
 *   }
 * }
 * ```
 */
export interface ConstructNameMap {
  italic: 'italic';
  /**
   * Whole autolink.
   *
   * ```markdown
   * > | <https://example.com> and <admin@example.com>
   *     ^^^^^^^^^^^^^^^^^^^^^     ^^^^^^^^^^^^^^^^^^^
   * ```
   */
  autolink: 'autolink';
  /**
   * Whole block quote.
   *
   * ```markdown
   * > | > a
   *     ^^^
   * > | b
   *     ^
   * ```
   */
  blockquote: 'blockquote';
  /**
   * Whole code (indented).
   *
   * ```markdown
   * ␠␠␠␠console.log(1)
   * ^^^^^^^^^^^^^^^^^^
   * ```
   */
  codeIndented: 'codeIndented';
  /**
   * Whole code (fenced).
   *
   * ````markdown
   * > | ```js
   *     ^^^^^
   * > | console.log(1)
   *     ^^^^^^^^^^^^^^
   * > | ```
   *     ^^^
   * ````
   */
  codeFenced: 'codeFenced';
  /**
   * Code (fenced) language, when fenced with grave accents.
   *
   * ````markdown
   * > | ```js
   *        ^^
   *   | console.log(1)
   *   | ```
   * ````
   */
  codeFencedLangGraveAccent: 'codeFencedLangGraveAccent';
  /**
   * Code (fenced) language, when fenced with tildes.
   *
   * ````markdown
   * > | ~~~js
   *        ^^
   *   | console.log(1)
   *   | ~~~
   * ````
   */
  codeFencedLangTilde: 'codeFencedLangTilde';
  /**
   * Code (fenced) meta string, when fenced with grave accents.
   *
   * ````markdown
   * > | ```js eval
   *           ^^^^
   *   | console.log(1)
   *   | ```
   * ````
   */
  codeFencedMetaGraveAccent: 'codeFencedMetaGraveAccent';
  /**
   * Code (fenced) meta string, when fenced with tildes.
   *
   * ````markdown
   * > | ~~~js eval
   *           ^^^^
   *   | console.log(1)
   *   | ~~~
   * ````
   */
  codeFencedMetaTilde: 'codeFencedMetaTilde';
  /**
   * Whole definition.
   *
   * ```markdown
   * > | [a]: b "c"
   *     ^^^^^^^^^^
   * ```
   */
  definition: 'definition';
  /**
   * Destination (literal) (occurs in definition, image, link).
   *
   * ```markdown
   * > | [a]: <b> "c"
   *          ^^^
   * > | a ![b](<c> "d") e
   *            ^^^
   * ```
   */
  destinationLiteral: 'destinationLiteral';
  /**
   * Destination (raw) (occurs in definition, image, link).
   *
   * ```markdown
   * > | [a]: b "c"
   *          ^
   * > | a ![b](c "d") e
   *            ^
   * ```
   */
  destinationRaw: 'destinationRaw';
  /**
   * Emphasis.
   *
   * ```markdown
   * > | *a*
   *     ^^^
   * ```
   */
  emphasis: 'emphasis';
  /**
   * Whole heading (atx).
   *
   * ```markdown
   * > | # alpha
   *     ^^^^^^^
   * ```
   */
  headingAtx: 'headingAtx';
  /**
   * Whole heading (setext).
   *
   * ```markdown
   * > | alpha
   *     ^^^^^
   * > | =====
   *     ^^^^^
   * ```
   */
  headingSetext: 'headingSetext';
  /**
   * Whole image.
   *
   * ```markdown
   * > | ![a](b)
   *     ^^^^^^^
   * > | ![c]
   *     ^^^^
   * ```
   */
  image: 'image';
  /**
   * Whole image reference.
   *
   * ```markdown
   * > | ![a]
   *     ^^^^
   * ```
   */
  imageReference: 'imageReference';
  /**
   * Label (occurs in definitions, image reference, image, link reference,
   * link).
   *
   * ```markdown
   * > | [a]: b "c"
   *     ^^^
   * > | a [b] c
   *       ^^^
   * > | a ![b][c] d
   *       ^^^^
   * > | a [b](c) d
   *       ^^^
   * ```
   */
  label: 'label';
  /**
   * Whole link.
   *
   * ```markdown
   * > | [a](b)
   *     ^^^^^^
   * > | [c]
   *     ^^^
   * ```
   */
  link: 'link';
  /**
   * Whole link reference.
   *
   * ```markdown
   * > | [a]
   *     ^^^
   * ```
   */
  linkReference: 'linkReference';
  /**
   * List.
   *
   * ```markdown
   * > | * a
   *     ^^^
   * > | 1. b
   *     ^^^^
   * ```
   */
  list: 'list';
  /**
   * List item.
   *
   * ```markdown
   * > | * a
   *     ^^^
   * > | 1. b
   *     ^^^^
   * ```
   */
  listItem: 'listItem';
  /**
   * Paragraph.
   *
   * ```markdown
   * > | a b
   *     ^^^
   * > | c.
   *     ^^
   * ```
   */
  paragraph: 'paragraph';
  /**
   * Phrasing (occurs in headings, paragraphs, etc).
   *
   * ```markdown
   * > | a
   *     ^
   * ```
   */
  phrasing: 'phrasing';
  /**
   * Reference (occurs in image, link).
   *
   * ```markdown
   * > | [a][]
   *        ^^
   * ```
   */
  reference: 'reference';
  /**
   * Strong.
   *
   * ```markdown
   * > | **a**
   *     ^^^^^
   * ```
   */
  bold: 'bold';
  /**
   * Title using single quotes (occurs in definition, image, link).
   *
   * ```markdown
   * > | [a](b 'c')
   *           ^^^
   * ```
   */
  titleApostrophe: 'titleApostrophe';
  /**
   * Title using double quotes (occurs in definition, image, link).
   *
   * ```markdown
   * > | [a](b "c")
   *           ^^^
   * ```
   */
  titleQuote: 'titleQuote';
}

/**
 * Construct names for things generated by `mdast-util-to-markdown`.
 *
 * This is an enum of strings, each being a semantic label, useful to know when
 * serializing whether we’re for example in a double (`"`) or single (`'`)
 * quoted title.
 */
export type ConstructName = ConstructNameMap[keyof ConstructNameMap];

/**
 * Serialize the children of a parent that contains flow children.
 *
 * These children will typically be joined by blank lines.
 * What they are joined by exactly is defined by `Join` functions.
 *
 * @param parent
 *   Parent of flow nodes.
 * @param info
 *   Info on where we are in the document we are generating.
 * @returns
 *   Serialized children, joined by (blank) lines.
 */
export type ContainerFlow = (parent: FlowParents, info: TrackFields) => string;

/**
 * Serialize the children of a parent that contains phrasing children.
 *
 * These children will be joined flush together.
 *
 * @param parent
 *   Parent of phrasing nodes.
 * @param info
 *   Info on where we are in the document we are generating.
 * @returns
 *   Serialized children, joined together.
 */
export type ContainerPhrasing = (parent: PhrasingParents, info: Info) => string;

/**
 * Track positional info in the output.
 *
 * This info isn’t used yet but such functionality will allow line wrapping,
 * source maps, etc.
 *
 * @param info
 *   Info on where we are in the document we are generating.
 * @returns
 *   Tracker.
 */
export type CreateTracker = (info: TrackFields) => Tracker;

/**
 * Whether to encode things — with fields representing the surrounding of a
 * whole.
 */
export interface EncodeSurrounding {
  /**
   * Whether to encode after.
   */
  after: boolean;

  /**
   * Whether to encode before.
   */
  before: boolean;
}

/**
 * Whether to encode things — with fields representing the relationship to a
 * whole.
 */
export interface EncodeSides {
  /**
   * Whether to encode inside.
   */
  inside: boolean;

  /**
   * Whether to encode before.
   */
  outside: boolean;
}

/**
 * Enter something.
 *
 * @param name
 *   Label, more similar to a micromark event than an mdast node type.
 * @returns
 *   Revert.
 */
export type Enter = (name: ConstructName) => Exit;

/**
 * Exit something.
 *
 * @returns
 *   Nothing.
 */
export type Exit = () => undefined;

/**
 * Children of flow nodes.
 */
export type FlowChildren = FlowParents extends {
  children: Array<infer T>;
}
  ? T
  : never;

/**
 * Parents that are not phrasing,
 * or similar.
 */
export type FlowParents = Exclude<Parents, PhrasingContent | TableCell | TableRow>;

/**
 * Handle particular nodes.
 *
 * Each key is a node type, each value its corresponding handler.
 */
export type Handlers = Record<string, Handle>;

/**
 * Handle a particular node.
 *
 * @param node
 *   Expected mdast node.
 * @param parent
 *   Parent of `node`.
 * @param state
 *   Info passed around about the current state.
 * @param Info
 *   Info on the surrounding of the node that is serialized.
 * @returns
 *   Serialized markdown representing `node`.
 */
export type Handle = (
  // type-coverage:ignore-next-line
  node: any,
  parent: Parents | undefined,
  state: State,
  Info: Info,
) => string;

/**
 * Pad serialized markdown.
 *
 * @param value
 *   Whole fragment of serialized markdown.
 * @param map
 *   Map function.
 * @returns
 *   Padded value.
 */
export type IndentLines = (value: string, map: Map) => string;

/**
 * Info on the surrounding of the node that is serialized.
 */
export interface Info extends SafeFields, TrackFields {}

/**
 * How to join two blocks.
 *
 * “Blocks” are typically joined by one blank line.
 * Sometimes it’s nicer to have them flush next to each other, yet other
 * times they cannot occur together at all.
 *
 * Join functions receive two adjacent siblings and their parent and what
 * they return defines how many blank lines to use between them.
 *
 * @param left
 *   First of two adjacent siblings.
 * @param right
 *   Second of two adjacent siblings.
 * @param parent
 *   Parent of the two siblings.
 * @param state
 *   Info passed around about the current state.
 * @returns
 *   How many blank lines to use between the siblings.
 *
 *   Where `true` is as passing `1` and `false` means the nodes cannot be
 *   joined by a blank line, such as two adjacent block quotes or indented code
 *   after a list, in which case a comment will be injected to break them up:
 *
 *   ```markdown
 *   > Quote 1
 *
 *   <!---->
 *
 *   > Quote 2
 *   ```
 *
 *    > 👉 **Note**: abusing this feature will break markdown.
 *    > One such example is when returning `0` for two paragraphs, which will
 *    > result in the text running together, and in the future to be seen as
 *    > one paragraph.
 */
export type Join = (left: FlowChildren, right: FlowChildren, parent: FlowParents, state: State) => boolean | number | null | undefined | void;

/**
 * Map function to pad a single line.
 *
 * @param value
 *   A single line of serialized markdown.
 * @param line
 *   Line number relative to the fragment.
 * @param blank
 *   Whether the line is considered blank in markdown.
 * @returns
 *   Padded line.
 */
export type Map = (value: string, line: number, blank: boolean) => string;

/**
 * Configuration (optional).
 */
export interface Options {
  /**
   * 用于表示斜体的标记（可选），可以是 '//' 或 undefined。
   */
  italic?: '//' | undefined;
  /**
   * 用于有序列表项的标记（默认值：`'#'`）。
   */
  bulletOrdered?: '#' | null | undefined;
  /**
   * 用于无序列表项的标记（默认值：`'*'`）。
   */
  bullet?: '*' | null | undefined;
  /**
   * 通过将文本设置为粗体或斜体来强调其重要性。
   *
   * 用于表示强调的标记（默认值：``''``）。
   */
  emphasis?: '//' | `''` | null | undefined;
  /**
   * 要包含的扩展列表（可选）。
   *
   * 每个 `ToTidExtension` 是一个与这里的 `Options` 具有相同接口的对象。
   */
  extensions?: Array<Options> | null | undefined;
  /**
   * 是否始终使用围栏代码块（默认值：`true`）。
   *
   * 默认情况下，如果定义了语言、代码为空，或者代码以空行开头或结尾，则使用围栏代码块。
   */
  fences?: boolean | null | undefined;
  /**
   * 用于围栏代码块的标记（默认值：``'`'``）。
   *
   * ``'<'``用于标记引言区块，可包含css类别，<<<.myClass.another-class、以及末尾可以注释<<< cite
   *
   * ``'$'``用于标记类型区块，$$$image/svg+xml、$$$.svg、$$$text/unknown
   */
  fence?: '`' | '<' | '$' | null | undefined;
  /**
   * 处理特定节点的函数（可选）。
   *
   * 每个键是节点类型，每个值是对应的处理函数。
   */
  handlers?: Partial<Handlers> | null | undefined;
  /**
   * 是否递增有序列表项的计数器（默认值：`true`）。
   */
  incrementListMarker?: boolean | null | undefined;
  /**
   * 如何连接块（可选）。
   */
  join?: Array<Join> | null | undefined;
  /**
   * 如何缩进列表项的内容（默认值：`'one'`）。
   *
   * TW中列表项使用多个列表标记，不使用缩进。
   *
   * TODO 暂时不理解
   *
   * 可以是标记大小加一个空格（当为 `'one'` 时）、一个制表符（`'tab'`），或者根据列表项及其父列表而定（`'mixed'`，如果列表项和列表紧凑则使用 `'one'`，否则使用 `'tab'`）。
   */
  listItemIndent?: 'mixed' | 'one' | 'tab' | null | undefined;
  /**
   * 用于标题的标记（默认值：`'"'`）。
   * TODO 暂时不理解
   */
  quote?: '"' | "'" | null | undefined;
  /**
   * 是否始终使用资源链接（默认值：`false`）。
   *
   * 默认情况下，尽可能使用自动链接（`[ext[https://example.com]]`），否则使用资源链接（`[[text|url]]`）。
   */
  resourceLink?: boolean | null | undefined;
  /**
   * 水平分隔线使用的标记数量（默认值：`3`）。
   */
  horizontalRuleRepetition?: number | null | undefined;
  /**
   * 用于水平分隔线的标记（默认值：`'-'`）。
   */
  horizontalRule?: '-' | null | undefined;
  /**
   * 用于表示加粗的标记（默认值：`''`）。
   */
  bold?: `''` | null | undefined;
  /**
   * 是否不使用空行连接定义（默认值：`false`）。
   *
   * 默认情况下，在任何流（“块”）结构之间添加空行。
   * 打开此选项相当于使用如下的连接函数：
   *
   * ```js
   * function joinTightDefinitions(left, right) {
   *   if (left.type === 'definition' && right.type === 'definition') {
   *     return 0;
   *   }
   * }
   * ```
   */
  tightDefinitions?: boolean | null | undefined;
  /**
   * 定义字符何时不能出现的模式（可选）。
   */
  unsafe?: Array<Unsafe> | null | undefined;
}

/**
 * Parent of phrasing nodes.
 */
export type PhrasingParents = Parents extends {
  children: Array<infer T>;
}
  ? PhrasingContent extends T
    ? Parents
    : never
  : never;

/**
 * Configuration for `safe`
 */
export interface SafeConfig extends SafeFields {
  /**
   * 额外的字符，这些字符*必须*被编码为字符引用，而不是转义为字符转义（可选）。
   *
   * 只有 ASCII 标点符号会使用字符转义，因此您永远不需要在这里传递非 ASCII 标点符号。
   */
  encode?: Array<string> | null | undefined;
}

/**
 * 关于当前正在生成内容周围字符的信息。
 */
export interface SafeFields {
  /**
   * 此内容之后的字符（保证至少有一个，可能更多）。
   */
  after: string;
  /**
   * 此内容之前的字符（保证至少有一个，可能更多）。
   */
  before: string;
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
 * @param input
 *   Raw value to make safe.
 * @param config
 *   Configuration.
 * @returns
 *   Serialized markdown safe for embedding.
 */
export type Safe = (input: string | null | undefined, config: SafeConfig) => string;

/**
 * Info passed around about the current state.
 */
export interface State {
  /**
   * Get an identifier from an association to match it to others.
   */
  associationId: AssociationId;
  /**
   * Info on whether to encode the surrounding of *attention*.
   *
   * Whether attention (emphasis, bold, strikethrough) forms
   * depends on the characters inside and outside them.
   * The characters inside can be handled by *attention* itself.
   * However the outside characters are already handled.
   * Or handled afterwards.
   * This field can be used to signal from *attention* that some parent
   * function (practically `containerPhrasing`) has to handle the surrounding.
   */
  attentionEncodeSurroundingInfo?: EncodeSurrounding | undefined;
  /**
   * List marker currently in use.
   */
  bulletCurrent?: string | undefined;
  /**
   * List marker previously in use.
   */
  bulletLastUsed?: string | undefined;
  /**
   * Compile an unsafe pattern to a regex.
   */
  compilePattern: CompilePattern;
  /**
   * Serialize the children of a parent that contains phrasing children.
   */
  containerPhrasing: ContainerPhrasing;
  /**
   * Serialize the children of a parent that contains flow children.
   */
  containerFlow: ContainerFlow;
  /**
   * Track positional info in the output.
   */
  createTracker: CreateTracker;
  /**
   * Enter a construct (returns a corresponding exit function).
   */
  enter: Enter;
  /**
   * Applied handlers.
   */
  handlers: Handlers;
  /**
   * Call the configured handler for the given node.
   */
  handle: Handle;
  /**
   * Pad serialized markdown.
   */
  indentLines: IndentLines;
  /**
   * Positions of child nodes in their parents.
   */
  indexStack: Array<number>;
  /**
   * Applied join handlers.
   */
  join: Array<Join>;
  /**
   * Applied user configuration.
   */
  options: Options;
  /**
   * Serialize the children of a parent that contains flow children.
   */
  safe: Safe;
  /**
   * Stack of constructs we’re in.
   */
  stack: Array<ConstructName>;
  /**
   * Applied unsafe patterns.
   */
  unsafe: Array<Unsafe>;
}

/**
 * Get current tracked info.
 *
 * @returns
 *   Current tracked info.
 */
export type TrackCurrent = () => TrackFields;

/**
 * Info on where we are in the document we are generating.
 */
export interface TrackFields {
  /**
   * Number of columns each line will be shifted by wrapping nodes.
   */
  lineShift: number;
  /**
   * Current point.
   */
  now: Point;
}

/**
 * Move past some generated markdown.
 *
 * @param value
 *   Generated markdown.
 * @returns
 *   Given markdown.
 */
export type TrackMove = (value: string | null | undefined) => string;

/**
 * Define a relative increased line shift (the typical indent for lines).
 *
 * @param value
 *   Relative increment in how much each line will be padded.
 * @returns
 *   Nothing.
 */
export type TrackShift = (value: number) => undefined;

/**
 * Track positional info in the output.
 *
 * This info isn’t used yet but such functionality will allow line wrapping,
 * source maps, etc.
 */
export interface Tracker {
  /**
   * Get the current tracked info.
   */
  current: TrackCurrent;
  /**
   * Move past some generated markdown.
   */
  move: TrackMove;
  /**
   * Define an increased line shift (the typical indent for lines).
   */
  shift: TrackShift;
}

/**
 * Schema that defines when a character cannot occur.
 */
export interface Unsafe {
  /**
   * The unsafe pattern (this whole object) compiled as a regex (do not use).
   *
   * This is internal and must not be defined.
   */
  _compiled?: RegExp | null | undefined;
  /**
   * `character` is bad when this is after it (optional).
   */
  after?: string | null | undefined;
  /**
   * `character` is bad at a break (cannot be used together with `before`) (optional).
   */
  atBreak?: boolean | null | undefined;
  /**
   * `character` is bad when this is before it (cannot be used together with
   * `atBreak`) (optional).
   */
  before?: string | null | undefined;
  /**
   * Single unsafe character.
   */
  character: string;
  /**
   * Constructs where this is bad (optional).
   */
  inConstruct?: Array<ConstructName> | ConstructName | null | undefined;
  /**
   * Constructs where this is fine again (optional).
   */
  notInConstruct?: Array<ConstructName> | ConstructName | null | undefined;
}
