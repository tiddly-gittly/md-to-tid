import { toString, md2tid } from '../dist/index.mjs';

describe.only('link', () => {
  test('should support a link', () => {
    expect(toString({ type: 'link' })).toEqual('[[]]\n');
  });

  test('should support children', () => {
    expect(toString({ type: 'link', children: [{ type: 'text', value: 'a' }] })).toEqual('[[a|]]\n');
  });

  test('should support a url', () => {
    expect(toString({ type: 'link', url: 'a', children: [] })).toEqual('[[a]]\n');
  });

  test("should omit a title (wikitext don't have title(tooltip) syntax)", () => {
    expect(toString({ type: 'link', url: '', title: 'a', children: [] })).toEqual('[[]]\n');
  });

  test('should support a url and omit a title', () => {
    expect(toString({ type: 'link', url: 'a', title: 'b', children: [] })).toEqual('[[a]]\n');
  });

  test('should support a link w/ enclosed url w/ whitespace in url', () => {
    expect(toString({ type: 'link', url: 'b c', children: [] })).toEqual('[[b c]]\n');
  });

  test('should escape an opening angle bracket in `url` in an enclosed url', () => {
    expect(toString({ type: 'link', url: 'b <c', children: [] })).toEqual('[[b \\<c]]\n');
  });

  test('should escape a closing angle bracket in `url` in an enclosed url', () => {
    expect(toString({ type: 'link', url: 'b >c', children: [] })).toEqual('[[b \\>c]]\n');
  });

  test('should escape a backslash in `url` in an enclosed url', () => {
    expect(toString({ type: 'link', url: 'b \\+c', children: [] })).toEqual('[[b \\\\+c]]\n');
  });

  test('should encode a line ending in `url` in an enclosed url', () => {
    expect(toString({ type: 'link', url: 'b\nc', children: [] })).toEqual('[[b&#xA;c]]\n');
  });

  test('should escape an opening paren in `url` in a raw url', () => {
    expect(toString({ type: 'link', url: 'b(c', children: [] })).toEqual('[[b\\(c]]\n');
  });

  test('should escape a closing paren in `url` in a raw url', () => {
    expect(toString({ type: 'link', url: 'b)c', children: [] })).toEqual('[[b\\)c]]\n');
  });

  test('should escape a backslash in `url` in a raw url', () => {
    expect(toString({ type: 'link', url: 'b\\.c', children: [] })).toEqual('[[b\\\\.c]]\n');
  });

  test('should support control characters in links', () => {
    expect(toString({ type: 'link', url: '\f', children: [] })).toEqual('[[\f]]\n');
  });

  test('should escape a double quote in `title`', () => {
    expect(toString({ type: 'link', url: '', title: 'b"c', children: [] })).toEqual('[[]]\n');
  });

  test('should escape a backslash in `title`', () => {
    expect(toString({ type: 'link', url: '', title: 'b\\-c', children: [] })).toEqual('[[]]\n');
  });

  test('should use an autolink for nodes w/ a value similar to the url and a protocol', () => {
    expect(
      toString({
        type: 'link',
        url: 'tel:123',
        children: [{ type: 'text', value: 'tel:123' }],
      }),
    ).toEqual('[ext[tel:123|tel:123]]\n');
  });

  test('should use a resource link (`resourceLink: true`)', () => {
    expect(
      toString(
        {
          type: 'link',
          url: 'tel:123',
          children: [{ type: 'text', value: 'tel:123' }],
        },
        { resourceLink: true },
      ),
    ).toEqual('[ext[tel:123|tel:123]]\n');
  });

  test('should use a normal link for nodes w/ a value similar to the url w/o a protocol', () => {
    expect(
      toString({
        type: 'link',
        url: 'a',
        children: [{ type: 'text', value: 'a' }],
      }),
    ).toEqual('[[a|a]]\n');
  });

  test('should use an autolink for nodes w/ a value similar to the url and a protocol', () => {
    expect(
      toString({
        type: 'link',
        url: 'tel:123',
        children: [{ type: 'text', value: 'tel:123' }],
      }),
    ).toEqual('[ext[tel:123|tel:123]]\n');
  });

  test('should use a normal link for nodes w/ a value similar to the url w/ and omit a title', () => {
    expect(
      toString({
        type: 'link',
        url: 'tel:123',
        title: 'a',
        children: [{ type: 'text', value: 'tel:123' }],
      }),
    ).toEqual('[ext[tel:123|tel:123]]\n');
  });

  test('should use an extlink for nodes w/ a value similar to the url and a protocol (email)', () => {
    expect(
      toString({
        type: 'link',
        url: 'mailto:a@b.c',
        children: [{ type: 'text', value: 'a@b.c' }],
      }),
    ).toEqual('[ext[a@b.c|mailto:a@b.c]]\n');
  });

  test('should not escape in extlinks', () => {
    expect(
      toString({
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url: 'mailto:a.b-c_d@a.b',
            children: [{ type: 'text', value: 'a.b-c_d@a.b' }],
          },
        ],
      }),
    ).toEqual('[ext[a.b-c_d@a.b|mailto:a.b-c_d@a.b]]\n');
  });

  test('should omit a link w/ title when `quote: "\'"`', () => {
    expect(toString({ type: 'link', url: '', title: 'b', children: [] }, { quote: "'" })).toEqual('[[]]\n');
  });

  test('should omit a quote in a title when `quote: "\'"`', () => {
    expect(toString({ type: 'link', url: '', title: "'", children: [] }, { quote: "'" })).toEqual('[[]]\n');
  });

  test('should remove unneeded characters in a `title` (double quotes)', () => {
    expect(toString({ type: 'link', url: '#', title: 'a![b](c*d_e[f_g`h<i</j', children: [] })).toEqual('[[#]]\n');
  });

  test('should remove unneeded characters in a `title` (single quotes)', () => {
    expect(toString({ type: 'link', url: '#', title: 'a![b](c*d_e[f_g`h<i</j', children: [] }, { quote: "'" })).toEqual('[[#]]\n');
  });

  test('should escape unneeded characters in a `destinationLiteral`', () => {
    expect(toString({ type: 'link', url: 'a b![c](d*e_f[g_h`i', children: [] })).toEqual('[[a b!\\[c\\](d*e_f\\[g_h`i]]\n');
  });

  test('should escape unneeded characters in a `destinationRaw`', () => {
    expect(toString({ type: 'link', url: 'a![b](c*d_e[f_g`h<i</j', children: [] })).toEqual('[[a!\\[b\\](c*d_e\\[f_g`h<i</j]]\n');
  });
});

describe('linkReference', (t) => {
  test('should support a link reference (nonsensical)', () => {
    expect(toString({ type: 'linkReference' })).toEqual('[][]\n');
  });

  test('should support `children`', () => {
    expect(toString({ type: 'linkReference', children: [{ type: 'text', value: 'a' }] })).toEqual('[a][]\n');
  });

  test('should support an `identifier` (nonsensical)', () => {
    expect(toString({ type: 'linkReference', identifier: 'a' })).toEqual('[][a]\n');
  });

  test('should support a `label` (nonsensical)', () => {
    expect(toString({ type: 'linkReference', label: 'a' })).toEqual('[][a]\n');
  });

  test('should support `referenceType: "shortcut"`', () => {
    expect(
      toString({
        type: 'linkReference',
        children: [{ type: 'text', value: 'A' }],
        label: 'A',
        referenceType: 'shortcut',
      }),
    ).toEqual('[A]\n');
  });

  test('should support `referenceType: "collapsed"`', () => {
    expect(
      toString({
        type: 'linkReference',
        children: [{ type: 'text', value: 'A' }],
        label: 'A',
        identifier: 'a',
        referenceType: 'collapsed',
      }),
    ).toEqual('[A][]\n');
  });

  test('should support `referenceType: "full"` (default)', () => {
    expect(
      toString({
        type: 'linkReference',
        children: [{ type: 'text', value: 'A' }],
        label: 'A',
        identifier: 'a',
        referenceType: 'full',
      }),
    ).toEqual('[A][A]\n');
  });

  test('should prefer label over identifier', () => {
    expect(
      toString({
        type: 'linkReference',
        children: [{ type: 'text', value: '&' }],
        label: '&',
        identifier: '&amp;',
        referenceType: 'full',
      }),
    ).toEqual('[&][&]\n');
  });

  test('should decode `identifier` if w/o `label`', () => {
    expect(
      toString({
        type: 'linkReference',
        children: [{ type: 'text', value: '&' }],
        identifier: '&amp;',
        referenceType: 'full',
      }),
    ).toEqual('[&][&]\n');
  });

  test('should support incorrect character references', () => {
    expect(
      toString({
        type: 'paragraph',
        children: [
          {
            type: 'linkReference',
            children: [{ type: 'text', value: '&a;' }],
            identifier: '&b;',
            referenceType: 'full',
          },
        ],
      }),
    ).toEqual('[\\&a;][&b;]\n');
  });

  test('should unescape `identifier` if w/o `label`', () => {
    expect(
      toString({
        type: 'linkReference',
        children: [{ type: 'text', value: '+' }],
        identifier: '\\+',
        referenceType: 'full',
      }),
    ).toEqual('[+][+]\n');
  });

  test('should use a collapsed reference if w/o `referenceType` and the label matches the reference', () => {
    expect(
      toString({
        type: 'linkReference',
        children: [{ type: 'text', value: 'a' }],
        label: 'a',
        identifier: 'a',
      }),
    ).toEqual('[a][]\n');
  });

  test('should use a full reference if w/o `referenceType` and the label does not match the reference', () => {
    expect(
      toString({
        type: 'linkReference',
        children: [{ type: 'text', value: 'a' }],
        label: 'b',
        identifier: 'b',
      }),
    ).toEqual('[a][b]\n');
  });

  test('should use a full reference if w/o `referenceType` and the label does not match the reference', () => {
    expect(
      toString({
        type: 'paragraph',
        children: [
          { type: 'linkReference', children: [{ type: 'text', value: 'a' }] },
          { type: 'text', value: '(b)' },
        ],
      }),
    ).toEqual('[a][]\\(b)\n');
  });

  test('should escape unneeded characters in a `reference`', () => {
    expect(
      toString({
        type: 'linkReference',
        identifier: 'a![b](c*d_e[f_g`h<i</j',
        referenceType: 'full',
        children: [],
      }),
    ).toEqual('[][a!\\[b\\](c*d_e\\[f_g`h<i</j]\n');
  });

});
