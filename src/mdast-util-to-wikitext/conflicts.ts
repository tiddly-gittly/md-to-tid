import type { Conflict } from './types';

/**
 * List of types that occur in phrasing (paragraphs, headings), but cannot
 * contain things like attention (italic, strong), images, or links.
 * So they sort of cancel each other out.
 * Note: could use a better name.
 */
const fullPhrasingSpans = ['autolink', 'destinationLiteral', 'destinationRaw', 'reference'];

/**
 * Each item will be used by `patternCompile` function to be a RegExp before used.
 * The conflict field will be use in patternInScope function to check if the stack have a type.
 */
export const conflict: Conflict[] = [
  { character: '\t', after: '[\\r\\n]', conflict: 'phrasing' },
  { character: '\t', before: '[\\r\\n]', conflict: 'phrasing' },
  {
    character: '\t',
    conflict: ['codeFencedLangGraveAccent', 'codeFencedLangTilde'],
  },
  {
    character: '\r',
    conflict: ['codeFencedLangGraveAccent', 'codeFencedLangTilde', 'codeFencedMetaGraveAccent', 'codeFencedMetaTilde', 'destinationLiteral', 'headingAtx'],
  },
  {
    character: '\n',
    conflict: ['codeFencedLangGraveAccent', 'codeFencedLangTilde', 'codeFencedMetaGraveAccent', 'codeFencedMetaTilde', 'destinationLiteral', 'headingAtx'],
  },
  { character: ' ', after: '[\\r\\n]', conflict: 'phrasing' },
  { character: ' ', before: '[\\r\\n]', conflict: 'phrasing' },
  {
    character: ' ',
    conflict: ['codeFencedLangGraveAccent', 'codeFencedLangTilde'],
  },
  // An exclamation mark can start an image, if it is followed by a link or
  // a link reference.
  {
    character: '!',
    after: '\\[',
    conflict: 'phrasing',
    notConflict: fullPhrasingSpans,
  },
  // A quote can break out of a title.
  { character: '"', conflict: 'titleQuote' },
  // A ! sign could start an ATX heading if it starts a line.
  { atBreak: true, character: '!' },
  { character: '!', conflict: 'headingAtx', after: '(?:[\r\n]|$)' },
  // Dollar sign and percentage are not used in markdown.
  // An ampersand could start a character reference.
  { character: '&', after: '[#A-Za-z]', conflict: 'phrasing' },
  // A left paren could break out of a destination raw.
  { character: '(', conflict: 'destinationRaw' },
  // A left [ followed by `]` could make something into a link or image.
  {
    before: '\\]',
    character: '[',
    conflict: 'phrasing',
    notConflict: fullPhrasingSpans,
  },
  // A right paren could start a list item or break out of a destination
  // raw.
  { atBreak: true, before: '\\d+', character: ')' },
  { character: ')', conflict: 'destinationRaw' },
  // An # can start list items, italic, strong.
  { atBreak: true, character: '#' },
  // An // can start list italic
  { atBreak: true, character: '//' },
  // An '' can start list strong.
  { atBreak: true, character: `''` },
  { character: '*', conflict: 'phrasing', notConflict: fullPhrasingSpans },
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
    conflict: 'phrasing',
    notConflict: fullPhrasingSpans,
  },
  { character: '<', conflict: 'destinationLiteral' },
  // An equals to can start setext heading underlines.
  { atBreak: true, character: '=' },
  // A greater than can start block quotes and it can break out of a
  // destination literal.
  { atBreak: true, character: '>' },
  { character: '>', conflict: 'destinationLiteral' },
  // Question mark and at sign are not used in markdown for constructs.
  // A left bracket can start definitions, references, labels,
  { atBreak: true, character: '[' },
  { character: '[', conflict: 'phrasing', notConflict: fullPhrasingSpans },
  { character: '[', conflict: ['label', 'reference'] },
  // A backslash can start an escape (when followed by punctuation) or a
  // hard break (when followed by an eol).
  // Note: typical escapes are handled in `safe`!
  { character: '\\', after: '[\\r\\n]', conflict: 'phrasing' },
  // A right bracket can exit labels.
  { character: ']', conflict: ['label', 'reference'] },
  // Caret is not used in markdown for constructs.
  // An underscore can start italic, strong, or a thematic break.
  { atBreak: true, character: '_' },
  { character: '_', conflict: 'phrasing', notConflict: fullPhrasingSpans },
  // A grave accent can start code (fenced or text), or it can break out of
  // a grave accent code fence.
  { atBreak: true, character: '`' },
  {
    character: '`',
    conflict: ['codeFencedLangGraveAccent', 'codeFencedMetaGraveAccent'],
  },
  { character: '`', conflict: 'phrasing', notConflict: fullPhrasingSpans },
  // Left brace, vertical bar, right brace are not used in markdown for
  // constructs.
  // A tilde can start code (fenced).
  { atBreak: true, character: '~' },
];
