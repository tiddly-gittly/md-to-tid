import { toString, md2tid } from '../dist/index.mjs';

describe('image', () => {
  test('should support an image', () => {
    expect(toString({ type: 'image' })).toEqual('![]()\n');
  });

  // @ts-expect-error: `url` missing
  test('should support `alt`', () => {
    expect(toString({ type: 'image', alt: 'a' })).toEqual('![a]()\n');
  });

  test('should support a url', () => {
    expect(toString({ type: 'image', url: 'a' })).toEqual('![](a)\n');
  });

  test('should support a title', () => {
    expect(toString({ type: 'image', url: '', title: 'a' })).toEqual('![](<> "a")\n');
  });

  test('should support a url and title', () => {
    expect(toString({ type: 'image', url: 'a', title: 'b' })).toEqual('![](a "b")\n');
  });

  test('should support an image w/ enclosed url w/ whitespace in url', () => {
    expect(toString({ type: 'image', url: 'b c' })).toEqual('![](<b c>)\n');
  });

  test('should escape an opening angle bracket in `url` in an enclosed url', () => {
    expect(toString({ type: 'image', url: 'b <c' })).toEqual('![](<b \\<c>)\n');
  });

  test('should escape a closing angle bracket in `url` in an enclosed url', () => {
    expect(toString({ type: 'image', url: 'b >c' })).toEqual('![](<b \\>c>)\n');
  });

  test('should escape a backslash in `url` in an enclosed url', () => {
    expect(toString({ type: 'image', url: 'b \\+c' })).toEqual('![](<b \\\\+c>)\n');
  });

  test('should encode a line ending in `url` in an enclosed url', () => {
    expect(toString({ type: 'image', url: 'b\nc' })).toEqual('![](<b&#xA;c>)\n');
  });

  test('should escape an opening paren in `url` in a raw url', () => {
    expect(toString({ type: 'image', url: 'b(c' })).toEqual('![](b\\(c)\n');
  });

  test('should escape a closing paren in `url` in a raw url', () => {
    expect(toString({ type: 'image', url: 'b)c' })).toEqual('![](b\\)c)\n');
  });

  test('should escape a backslash in `url` in a raw url', () => {
    expect(toString({ type: 'image', url: 'b\\+c' })).toEqual('![](b\\\\+c)\n');
  });

  test('should support control characters in images', () => {
    expect(toString({ type: 'image', url: '\f' })).toEqual('![](<\f>)\n');
  });

  test('should escape a double quote in `title`', () => {
    expect(toString({ type: 'image', url: '', title: 'b"c' })).toEqual('![](<> "b\\"c")\n');
  });

  test('should escape a backslash in `title`', () => {
    expect(toString({ type: 'image', url: '', title: 'b\\.c' })).toEqual('![](<> "b\\\\.c")\n');
  });

  test('should support an image w/ title when `quote: "\'"`', () => {
    expect(toString({ type: 'image', url: '', title: 'b' }, { quote: "'" })).toEqual("![](<> 'b')\n");
  });

  test('should escape a quote in `title` in a title when `quote: "\'"`', () => {
    expect(toString({ type: 'image', url: '', title: "'" }, { quote: "'" })).toEqual("![](<> '\\'')\n");
  });
});

describe('imageReference', (t) => {
  test('should support a link reference (nonsensical)', () => {
    expect(toString({ type: 'imageReference' })).toEqual('![][]\n');
  });

  test('should support `alt`', () => {
    expect(toString({ type: 'imageReference', alt: 'a' })).toEqual('![a][]\n');
  });

  test('should support an `identifier` (nonsensical)', () => {
    expect(toString({ type: 'imageReference', identifier: 'a' })).toEqual('![][a]\n');
  });

  test('should support a `label` (nonsensical)', () => {
    expect(toString({ type: 'imageReference', label: 'a' })).toEqual('![][a]\n');
  });

  test('should support `referenceType: "shortcut"`', () => {
    expect(
      toString({
        type: 'imageReference',
        alt: 'A',
        label: 'A',
        referenceType: 'shortcut',
      }),
    ).toEqual('![A]\n');
  });

  test('should support `referenceType: "collapsed"`', () => {
    expect(
      toString({
        type: 'imageReference',
        alt: 'A',
        label: 'A',
        referenceType: 'collapsed',
      }),
    ).toEqual('![A][]\n');
  });

  test('should support `referenceType: "full"` (default)', () => {
    expect(
      toString({
        type: 'imageReference',
        alt: 'A',
        label: 'A',
        referenceType: 'full',
      }),
    ).toEqual('![A][A]\n');
  });

  test('should prefer label over identifier', () => {
    expect(
      toString({
        type: 'imageReference',
        alt: '&',
        label: '&',
        identifier: '&amp;',
        referenceType: 'full',
      }),
    ).toEqual('![&][&]\n');
  });

  test('should decode `identifier` if w/o `label`', () => {
    expect(
      toString({
        type: 'imageReference',
        alt: '&',
        identifier: '&amp;',
        referenceType: 'full',
      }),
    ).toEqual('![&][&]\n');
  });

  test('should support incorrect character references', () => {
    expect(
      toString({
        type: 'paragraph',
        children: [
          {
            type: 'imageReference',
            alt: '&a;',
            identifier: '&b;',
            referenceType: 'full',
          },
        ],
      }),
    ).toEqual('![\\&a;][&b;]\n');
  });

  test('should unescape `identifier` if w/o `label`', () => {
    expect(
      toString({
        type: 'imageReference',
        alt: '+',
        identifier: '\\+',
        referenceType: 'full',
      }),
    ).toEqual('![+][+]\n');
  });

  test('should use a collapsed reference if w/o `referenceType` and the label matches the reference', () => {
    expect(toString({ type: 'imageReference', alt: 'a', label: 'a' })).toEqual('![a][]\n');
  });

  test('should use a full reference if w/o `referenceType` and the label does not match the reference', () => {
    expect(toString({ type: 'imageReference', alt: 'a', label: 'b' })).toEqual('![a][b]\n');
  });
});
