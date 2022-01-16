import { toString, md2tid } from '../dist/index.mjs';

describe('escape', () => {
  test('should escape what would otherwise be a block quote in a paragraph', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '> a\n> b\nc >' }] })).toEqual('\\> a\n\\> b\nc >\n');
  });

  test('should escape what would otherwise be a block quote in a list item', () => {
    expect(
      toString({
        type: 'listItem',
        children: [{ type: 'paragraph', children: [{ type: 'text', value: '> a\n> b' }] }],
      }),
    ).toEqual('* \\> a\n* \\> b\n');
  });

  test('should escape what would otherwise be a block quote in a block quote', () => {
    expect(
      toString({
        type: 'blockquote',
        children: [{ type: 'paragraph', children: [{ type: 'text', value: '> a\n> b' }] }],
      }),
    ).toEqual('> \\> a\n> \\> b\n');
  });

  test('should escape what would otherwise be a break', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: 'a\\\nb' }] })).toEqual('a\\\\\nb\n');
  });

  test('should escape what would otherwise be a named character reference', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '&amp' }] })).toEqual('\\&amp\n');
  });

  test('should escape what would otherwise be a numeric character reference', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '&#9;' }] })).toEqual('\\&#9;\n');
  });

  test('should escape what would otherwise be a character escape', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: 'a\\+b' }] })).toEqual('a\\\\+b\n');
  });

  test('should escape what would otherwise be a character escape of an autolink', () => {
    expect(
      toString({
        type: 'paragraph',
        children: [
          { type: 'text', value: 'a\\' },
          {
            type: 'link',
            children: [{ type: 'text', value: 'https://a.b' }],
            url: 'https://a.b',
          },
        ],
      }),
    ).toEqual('a\\\\[ext[https://a.b]]\n');
  });

  test('should escape what would otherwise be code (flow)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '```js\n```' }] })).toEqual('\\`\\`\\`js\n\\`\\`\\`\n');
  });

  test('should escape what would otherwise be a definition', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '[a]: b' }] })).toEqual('\\[a]: b\n');
  });

  test('should escape what would otherwise be emphasis (slash)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '//a//' }] })).toEqual('\\//a//\n');
  });

  test('should escape what would otherwise be bold (underscore)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: `''a''` }] })).toEqual(`\\''a''\n`);
  });

  test('should escape what would otherwise be a heading (atx)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '! a' }] })).toEqual('\\! a\n');
  });
  test('should not escape what would otherwise not be a heading (atx)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '# a' }] })).toEqual('\\# a\n');
  });

  test('should escape what would otherwise be a heading (setext, equals)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: 'a\n=' }] })).toEqual('a\n\\=\n');
  });

  test('should escape what would otherwise be a heading (setext, dash)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: 'a\n-' }] })).toEqual('a\n\\-\n');
  });

  test('should escape what would otherwise be html', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '<a\nb>' }] })).toEqual('\\<a\nb>\n');
  });

  test('should escape what would otherwise be code (text)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: 'a `b`\n`c` d' }] })).toEqual('a \\`b\\`\n\\`c\\` d\n');
  });

  test('should escape what would otherwise turn a link into an image', () => {
    expect(
      toString({
        type: 'paragraph',
        children: [
          { type: 'text', value: '!' },
          {
            type: 'link',
            children: [{ type: 'text', value: 'a' }],
            url: 'b',
          },
        ],
      }),
    ).toEqual('\\![[a|b]]\n');
  });

  test('should escape what would otherwise turn a link reference into an image reference', () => {
    expect(
      toString({
        type: 'paragraph',
        children: [
          { type: 'text', value: '!' },
          {
            type: 'linkReference',
            children: [{ type: 'text', value: 'a' }],
            label: 'b',
            identifier: 'b',
            referenceType: 'shortcut',
          },
        ],
      }),
    ).toEqual('\\![a][b]\n');
  });

  test('should escape what would otherwise be an image (reference)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '![a][b]' }] })).toEqual('\\!\\[a]\\[b]\n');
  });

  test('should escape what would otherwise be an image (resource)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '[img[a.jpg]]' }] })).toEqual('\\[img\\[a.jpg]]\n');
  });

  test('should not escape what would otherwise not be an image (resource), but escape because it might be heading', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '![](a.jpg)' }] })).toEqual('\\!\\[](a.jpg)\n');
  });

  test('should escape what would otherwise be a link (reference)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '[a][b]' }] })).toEqual('\\[a]\\[b]\n');
  });

  test('should escape what would otherwise be a link (resource)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '[[a.jpg]]' }] })).toEqual('\\[\\[a.jpg]]\n');
  });

  test('should not escape what would otherwise not be a link (resource)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '[](a.jpg)' }] })).toEqual('\\[](a.jpg)\n');
  });

  test('should escape what would otherwise be a list item (plus)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '+ a\n+ b' }] })).toEqual('\\+ a\n\\+ b\n');
  });

  test('should escape what would otherwise be a list item (dash)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '- a\n- b' }] })).toEqual('\\- a\n\\- b\n');
  });

  test('should escape what would otherwise be a list item (asterisk)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '* a\n* b' }] })).toEqual('\\* a\n\\* b\n');
  });

  test('should escape what would otherwise be a list item (dot)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '1. a\n2. b' }] })).toEqual('1\\. a\n2\\. b\n');
  });

  test('should escape what would otherwise be a list item (paren)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '1) a\n2) b' }] })).toEqual('1\\) a\n2\\) b\n');
  });

  test('should not escape what can’t be a list (dot)', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '1.2.3. asd' }] })).toEqual('1.2.3. asd\n');
  });

  test.skip('should support options in extensions', () => {
    expect(
      toString(
        {
          type: 'root',
          children: [
            { type: 'definition', url: '', label: 'a', identifier: 'a' },
            { type: 'definition', url: '', label: 'b', identifier: 'b' },
          ],
        },
        { extensions: [{ tightDefinitions: true }] },
      ),
    ).toEqual('[a]: <>\n[b]: <>\n');
  });

  test('should support empty `join`, `handlers`, `extensions` in an extension (coverage)', () => {
    expect(
      toString(
        {
          type: 'root',
          children: [{ type: 'strong', children: [{ type: 'text', value: 'a' }] }],
        },
        {
          extensions: [
            {
              strong: '_',
              join: undefined,
              handlers: undefined,
              extensions: undefined,
            },
          ],
        },
      ),
    ).toEqual(`_a_\n`);
  });

  test('should make `join` from options highest priority', () => {
    expect(
      toString(
        {
          type: 'root',
          children: [
            {
              type: 'list',
              ordered: true,
              start: 1,
              spread: false,
              children: [
                {
                  type: 'listItem',
                  spread: true,
                  checked: null,
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          value: 'foo',
                        },
                      ],
                    },
                    {
                      type: 'list',
                      ordered: false,
                      start: null,
                      spread: false,
                      children: [
                        {
                          type: 'listItem',
                          spread: false,
                          checked: null,
                          children: [
                            {
                              type: 'paragraph',
                              children: [{ type: 'text', value: 'bar' }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          join: [() => 0],
        },
      ),
    ).toEqual('# foo\n# * bar\n');
  });

  test('should prefer main options over extension options', () => {
    expect(
      toString(
        {
          type: 'root',
          children: [{ type: 'strong', children: [{ type: 'text', value: 'a' }] }],
        },
        { strong: `''`, extensions: [{ strong: '_' }] },
      ),
    ).toEqual(`''a''\n`);
  });

  test('should prefer extension options over subextension options', () => {
    expect(
      toString(
        {
          type: 'root',
          children: [{ type: 'strong', children: [{ type: 'text', value: 'a' }] }],
        },
        { extensions: [{ strong: `''`, extensions: [{ strong: '_' }] }] },
      ),
    ).toEqual(`''a''\n`);
  });

  test('should handle literal backslashes properly when before constructs (1)', () => {
    expect(
      toString({
        type: 'paragraph',
        children: [
          { type: 'text', value: '\\' },
          { type: 'emphasis', children: [{ type: 'text', value: 'a' }] },
        ],
      }),
    ).toEqual('\\\\//a//\n');
  });

  test('should handle literal backslashes properly when before constructs (2)', () => {
    expect(
      toString({
        type: 'paragraph',
        children: [
          { type: 'text', value: '\\\\' },
          { type: 'emphasis', children: [{ type: 'text', value: 'a' }] },
        ],
      }),
    ).toEqual('\\\\\\\\//a//\n');
  });
});
