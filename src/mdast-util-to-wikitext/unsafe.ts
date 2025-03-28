import { ConstructName, Unsafe } from './types';

/**
 * List of types that occur in phrasing (paragraphs, headings), but cannot
 * contain things like attention (italic, strong), images, or links.
 * So they sort of cancel each other out.
 * Note: could use a better name.
 */
const fullPhrasingSpans: Array<ConstructName> = ['autolink', 'destinationLiteral', 'destinationRaw', 'reference'];

/**
 * Each item will be used by `patternCompile` function to be a RegExp before used.
 * The inConstruct field will be use in patternInScope function to check if the stack have a type.
 */
export const unsafe: Array<Unsafe> = [
  { character: '\t', after: '[\\r\\n]', inConstruct: 'phrasing' },
  { character: '\t', before: '[\\r\\n]', inConstruct: 'phrasing' },
  {
    character: '\t',
    inConstruct: ['codeFencedLangGraveAccent', 'codeFencedLangTilde'],
  },
  {
    character: '\r',
    inConstruct: ['codeFencedLangGraveAccent', 'codeFencedLangTilde', 'codeFencedMetaGraveAccent', 'codeFencedMetaTilde', 'destinationLiteral', 'headingAtx'],
  },
  {
    character: '\n',
    inConstruct: ['codeFencedLangGraveAccent', 'codeFencedLangTilde', 'codeFencedMetaGraveAccent', 'codeFencedMetaTilde', 'destinationLiteral', 'headingAtx'],
  },
  { character: ' ', after: '[\\r\\n]', inConstruct: 'phrasing' },
  { character: ' ', before: '[\\r\\n]', inConstruct: 'phrasing' },
  {
    character: ' ',
    inConstruct: ['codeFencedLangGraveAccent', 'codeFencedLangTilde'],
  },
  // An exclamation mark can start an image, if it is followed by a link or
  // a link reference.
  {
    character: '!',
    after: '\\[',
    inConstruct: 'phrasing',
    notInConstruct: fullPhrasingSpans,
  },
  // A quote can break out of a title.
  { character: '"', inConstruct: 'titleQuote' },
  // A ! sign could start an ATX heading if it starts a line.
  { atBreak: true, character: '!' },
  { character: '!', inConstruct: 'headingAtx', after: '(?:[\r\n]|$)' },
  // Dollar sign and percentage are not used in markdown.
  // An ampersand could start a character reference.
  { character: '&', after: '[#A-Za-z]', inConstruct: 'phrasing' },
  // A left paren could break out of a destination raw.
  { character: '(', inConstruct: 'destinationRaw' },
  // A left [ followed by `]` could make something into a link or image.
  {
    before: '\\]',
    character: '[',
    inConstruct: 'phrasing',
    notInConstruct: fullPhrasingSpans,
  },
  // A right paren could start a list item or break out of a destination
  // raw.
  { atBreak: true, before: '\\d+', character: ')' },
  { character: ')', inConstruct: 'destinationRaw' },
  // An # can start list items, italic, strong.
  { atBreak: true, character: '#' },
  // An // can start list italic
  { atBreak: true, character: '//' },
  // An '' can start list strong.
  { atBreak: true, character: `''` },
  { character: '*', inConstruct: 'phrasing', notInConstruct: fullPhrasingSpans },
  // A plus sign could start a list item.
  { atBreak: true, character: '+' },
  // A dash can start thematic breaks, list items, and setext heading
  // underlines.
  { atBreak: true, character: '-' },
  // A dot could start a list item.
  { atBreak: true, before: '\\d+', character: '.', after: '(?:[ \t\r\n]|$)' },
  // Slash, colon, and semicolon are not used in markdown for constructs.
  // A less than can start html (flow or text) or an autolink.
  // HTML could start with an exclamation mark (declaration, cdata, comment),
  // slash (closing tag), question mark (instruction), or a letter (tag).
  // An autolink also starts with a letter.
  // Finally, it could break out of a destination literal.
  { atBreak: true, character: '<', after: '[!/?A-Za-z]' },
  {
    character: '<',
    after: '[!/?A-Za-z]',
    inConstruct: 'phrasing',
    notInConstruct: fullPhrasingSpans,
  },
  { character: '<', inConstruct: 'destinationLiteral' },
  // An equals to can start setext heading underlines.
  { atBreak: true, character: '=' },
  // A greater than can start block quotes and it can break out of a
  // destination literal.
  { atBreak: true, character: '>' },
  { character: '>', inConstruct: 'destinationLiteral' },
  // Question mark and at sign are not used in markdown for constructs.
  // A left bracket can start definitions, references, labels,
  { atBreak: true, character: '[' },
  { character: '[', inConstruct: 'phrasing', notInConstruct: fullPhrasingSpans },
  { character: '[', inConstruct: ['label', 'reference'] },
  // A backslash can start an escape (when followed by punctuation) or a
  // hard break (when followed by an eol).
  // Note: typical escapes are handled in `safe`!
  { character: '\\', after: '[\\r\\n]', inConstruct: 'phrasing' },
  // A right bracket can exit labels.
  { character: ']', inConstruct: ['label', 'reference'] },
  // Caret is not used in markdown for constructs.
  // An underscore can start italic, strong, or a thematic break.
  { atBreak: true, character: '_' },
  { character: '_', inConstruct: 'phrasing', notInConstruct: fullPhrasingSpans },
  // A grave accent can start code (fenced or text), or it can break out of
  // a grave accent code fence.
  { atBreak: true, character: '`' },
  {
    character: '`',
    inConstruct: ['codeFencedLangGraveAccent', 'codeFencedMetaGraveAccent'],
  },
  { character: '`', inConstruct: 'phrasing', notInConstruct: fullPhrasingSpans },
  // Left brace, vertical bar, right brace are not used in markdown for
  // constructs.
  // A tilde can start code (fenced).
  { atBreak: true, character: '~' },
];
