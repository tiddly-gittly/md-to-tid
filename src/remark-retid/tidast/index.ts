import { Parent as UnistParent, Literal as UnistLiteral, Node } from 'unist';

export type AlignType = 'left' | 'right' | 'center' | null;

export type ReferenceType = 'shortcut' | 'collapsed' | 'full';

/**
 * This map registers all node types that may be used where markdown block content is accepted.
 *
 * These types are accepted inside block quotes, list items, footnotes, and roots.
 *
 * This interface can be augmented to register custom node types.
 *
 * @example
 * declare module 'mdast' {
 *   interface BlockContentMap {
 *     // Allow using math nodes defined by `remark-math`.
 *     math: Math;
 *   }
 * }
 */
export interface BlockContentMap {
  blockquote: Blockquote;
  code: Code;
  heading: Heading;
  html: HTML;
  list: List;
  paragraph: Paragraph;
  table: Table;
  thematicbreak: ThematicBreak;
}

/**
 * This map registers all node definition types.
 *
 * This interface can be augmented to register custom node types.
 *
 * @example
 * declare module 'mdast' {
 *   interface DefinitionContentMap {
 *     custom: Custom;
 *   }
 * }
 */
export interface DefinitionContentMap {
  definition: Definition;
  footnoteDefinition: FootnoteDefinition;
}

/**
 * This map registers all node types that are acceptable in a static phrasing context.
 *
 * This interface can be augmented to register custom node types in a phrasing context, including links and link
 * references.
 *
 * @example
 * declare module 'mdast' {
 *   interface StaticPhrasingContentMap {
 *     mdxJsxTextElement: MDXJSXTextElement;
 *   }
 * }
 */
export interface StaticPhrasingContentMap {
  break: Break;
  delete: Delete;
  emphasis: Emphasis;
  footnote: Footnote;
  footnotereference: FootnoteReference;
  html: HTML;
  image: Image;
  imagereference: ImageReference;
  inlinecode: InlineCode;
  strong: Strong;
  text: Text;
}

/**
 * This map registers all node types that are acceptable in a (interactive) phrasing context (so not in links).
 *
 * This interface can be augmented to register custom node types in a phrasing context, excluding links and link
 * references.
 *
 * @example
 * declare module 'mdast' {
 *   interface PhrasingContentMap {
 *     custom: Custom;
 *   }
 * }
 */
export interface PhrasingContentMap extends StaticPhrasingContentMap {
  link: Link;
  linkReference: LinkReference;
}

/**
 * This map registers all node types that are acceptable inside lists.
 *
 * This interface can be augmented to register custom node types that are acceptable inside lists.
 *
 * @example
 * declare module 'mdast' {
 *   interface ListContentMap {
 *     custom: Custom;
 *   }
 * }
 */
export interface ListContentMap {
  listItem: ListItem;
}

/**
 * This map registers all node types that are acceptable inside tables (not table cells).
 *
 * This interface can be augmented to register custom node types that are acceptable inside tables.
 *
 * @example
 * declare module 'mdast' {
 *   interface TableContentMap {
 *     custom: Custom;
 *   }
 * }
 */
export interface TableContentMap {
  tableRow: TableRow;
}

/**
 * This map registers all node types that are acceptable inside tables rows (not table cells).
 *
 * This interface can be augmented to register custom node types that are acceptable inside table rows.
 *
 * @example
 * declare module 'mdast' {
 *   interface RowContentMap {
 *     custom: Custom;
 *   }
 * }
 */
export interface RowContentMap {
  tableCell: TableCell;
}

export interface YAML extends Literal {
  type: 'yaml';
}

/**
 * This map registers all frontmatter node types.
 *
 * This interface can be augmented to register custom node types.
 *
 * @example
 * declare module 'mdast' {
 *   interface FrontmatterContentMap {
 *     // Allow using toml nodes defined by `remark-frontmatter`.
 *     toml: TOML;
 *   }
 * }
 */
export interface FrontmatterContentMap {
  yaml: YAML;
}

export type Content = TopLevelContent | ListContent | TableContent | RowContent | PhrasingContent;

export type TopLevelContent = BlockContent | FrontmatterContent | DefinitionContent;

export type BlockContent = BlockContentMap[keyof BlockContentMap];

export type FrontmatterContent = FrontmatterContentMap[keyof FrontmatterContentMap];

export type DefinitionContent = DefinitionContentMap[keyof DefinitionContentMap];

export type ListContent = ListContentMap[keyof ListContentMap];

export type TableContent = TableContentMap[keyof TableContentMap];

export type RowContent = RowContentMap[keyof RowContentMap];

export type PhrasingContent = PhrasingContentMap[keyof PhrasingContentMap];

export type StaticPhrasingContent = StaticPhrasingContentMap[keyof StaticPhrasingContentMap];

export interface Parent extends UnistParent {
  children: Content[];
}

export interface Literal extends UnistLiteral {
  value: string;
}

export interface Root extends Parent {
  type: 'root';
}

export interface Paragraph extends Parent {
  children: PhrasingContent[];
  type: 'paragraph';
}

export interface Heading extends Parent {
  children: PhrasingContent[];
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  type: 'heading';
}

export interface ThematicBreak extends Node {
  type: 'thematicBreak';
}

export interface Blockquote extends Parent {
  children: Array<BlockContent | DefinitionContent>;
  type: 'blockquote';
}

export interface List extends Parent {
  children: ListContent[];
  ordered?: boolean | null | undefined;
  spread?: boolean | null | undefined;
  start?: number | null | undefined;
  type: 'list';
}

export interface ListItem extends Parent {
  checked?: boolean | null | undefined;
  children: Array<BlockContent | DefinitionContent>;
  spread?: boolean | null | undefined;
  type: 'listItem';
}

export interface Table extends Parent {
  align?: AlignType[] | null | undefined;
  children: TableContent[];
  type: 'table';
}

export interface TableRow extends Parent {
  children: RowContent[];
  type: 'tableRow';
}

export interface TableCell extends Parent {
  children: PhrasingContent[];
  type: 'tableCell';
}

export interface HTML extends Literal {
  type: 'html';
}

export interface Code extends Literal {
  lang?: string | null | undefined;
  meta?: string | null | undefined;
  type: 'code';
}

export interface Definition extends Node, Association, Resource {
  type: 'definition';
}

export interface FootnoteDefinition extends Parent, Association {
  children: Array<BlockContent | DefinitionContent>;
  type: 'footnoteDefinition';
}

export interface Text extends Literal {
  type: 'text';
}

export interface Emphasis extends Parent {
  children: PhrasingContent[];
  type: 'emphasis';
}

export interface Strong extends Parent {
  children: PhrasingContent[];
  type: 'strong';
}

export interface Delete extends Parent {
  children: PhrasingContent[];
  type: 'delete';
}

export interface InlineCode extends Literal {
  type: 'inlineCode';
}

export interface Break extends Node {
  type: 'break';
}

export interface Link extends Parent, Resource {
  children: StaticPhrasingContent[];
  type: 'link';
}

export interface Image extends Node, Resource, Alternative {
  type: 'image';
}

export interface LinkReference extends Parent, Reference {
  children: StaticPhrasingContent[];
  type: 'linkReference';
}

export interface ImageReference extends Node, Reference, Alternative {
  type: 'imageReference';
}

export interface Footnote extends Parent {
  children: PhrasingContent[];
  type: 'footnote';
}

export interface FootnoteReference extends Node, Association {
  type: 'footnoteReference';
}

// Mixin
export interface Resource {
  title?: string | null | undefined;
  url: string;
}

export interface Association {
  identifier: string;
  label?: string | null | undefined;
}

export interface Reference extends Association {
  referenceType: ReferenceType;
}

export interface Alternative {
  alt?: string | null | undefined;
}
