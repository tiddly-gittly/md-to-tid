import { md2tid, toString } from '../dist/index.mjs';

describe('title', () => {
  test('render 1 level title3 ast', () => {
    expect(
      toString({
        type: 'heading',
        depth: 3,
        children: [{ type: 'text', value: 'a' }, { type: 'break' }, { type: 'text', value: 'b' }],
      }),
    ).toEqual('!!! a b\n');
  });

  test('should serialize a heading w/o rank as a heading of rank 1', () => {
    expect(toString({ type: 'heading', depth: 1 })).toEqual('!\n');
  });

  test('should serialize a heading w/o rank as a heading of rank 1', () => {
    expect(
      // @ts-expect-error: `children` missing.
      toString({ type: 'heading' }),
    ).toEqual('!\n');
  });

  test('should serialize a heading w/ rank 1', () => {
    expect(
      // @ts-expect-error: `children` missing.
      toString({ type: 'heading', depth: 1 }),
    ).toEqual('!\n');
  });

  test('should serialize a heading w/ rank 6', () => {
    expect(
      // @ts-expect-error: `children` missing.
      toString({ type: 'heading', depth: 6 }),
    ).toEqual('!!!!!!\n');
  });

  test('should serialize a heading w/ rank 7 as 6', () => {
    expect(
      // @ts-expect-error: `children` missing.
      toString({ type: 'heading', depth: 7 }),
    ).toEqual('!!!!!!\n');
  });

  test('should serialize a heading w/ rank 0 as 1', () => {
    expect(
      // @ts-expect-error: `children` missing.
      toString({ type: 'heading', depth: 0 }),
    ).toEqual('!\n');
  });

  test('should serialize a heading w/ content', () => {
    expect(toString({ type: 'heading', depth: 1, children: [{ type: 'text', value: 'a' }] })).toEqual('! a\n');
  });

  test('should serialize a heading w/ rank 3', () => {
    expect(toString({ type: 'heading', depth: 3, children: [{ type: 'text', value: 'a' }] })).toEqual('!!! a\n');
  });

  test('should serialize an empty heading w/ rank 1 as atx', () => {
    expect(toString({ type: 'heading', depth: 1, children: [] })).toEqual('!\n');
  });

  test('should serialize an empty heading w/ rank 2 as atx', () => {
    expect(toString({ type: 'heading', depth: 2, children: [] })).toEqual('!!\n');
  });

  test('should serialize a heading with a closing sequence when `closeAtx` (empty)', () => {
    expect(
      // @ts-expect-error: `children` missing.
      toString({ type: 'heading' }, { closeAtx: true }),
    ).toEqual('! !\n');
  });

  test('should serialize a with a closing sequence when `closeAtx` (content)', () => {
    expect(
      toString(
        {
          type: 'heading',
          depth: 3,
          children: [{ type: 'text', value: 'a' }],
        },
        { closeAtx: true },
      ),
    ).toEqual('!!! a !!!\n');
  });

  test('should not escape a `#` at the start of phrasing in a heading', () => {
    expect(toString({ type: 'heading', depth: 2, children: [{ type: 'text', value: '# a' }] })).toEqual('!! # a\n');
  });

  test('should not escape a `1)` at the start of phrasing in a heading', () => {
    expect(toString({ type: 'heading', depth: 2, children: [{ type: 'text', value: '1) a' }] })).toEqual('!! 1) a\n');
  });

  test('should not escape a `+` at the start of phrasing in a heading', () => {
    expect(toString({ type: 'heading', depth: 2, children: [{ type: 'text', value: '+ a' }] })).toEqual('!! + a\n');
  });

  test('should not escape a `-` at the start of phrasing in a heading', () => {
    expect(toString({ type: 'heading', depth: 2, children: [{ type: 'text', value: '- a' }] })).toEqual('!! - a\n');
  });

  test('should not escape a `=` at the start of phrasing in a heading', () => {
    expect(toString({ type: 'heading', depth: 2, children: [{ type: 'text', value: '= a' }] })).toEqual('!! = a\n');
  });

  test('should not escape a `>` at the start of phrasing in a heading', () => {
    expect(toString({ type: 'heading', depth: 2, children: [{ type: 'text', value: '> a' }] })).toEqual('!! > a\n');
  });

  test('should escape a `#` at the end of a heading (1)', () => {
    expect(toString({ type: 'heading', depth: 1, children: [{ type: 'text', value: 'a #' }] })).toEqual('! a #\n');
  });

  test('should escape a `#` at the end of a heading (2)', () => {
    expect(toString({ type: 'heading', depth: 1, children: [{ type: 'text', value: 'a ##' }] })).toEqual('! a ##\n');
  });

  test('should not escape a `#` in a heading (2)', () => {
    expect(toString({ type: 'heading', depth: 1, children: [{ type: 'text', value: 'a # b' }] })).toEqual('! a # b\n');
  });

  test('should encode a space at the start of an atx heading', () => {
    expect(toString({ type: 'heading', depth: 1, children: [{ type: 'text', value: '  a' }] })).toEqual('! &#x20; a\n');
  });

  test('should encode a tab at the start of an atx heading', () => {
    expect(
      toString({
        type: 'heading',
        depth: 1,
        children: [{ type: 'text', value: '\t\ta' }],
      }),
    ).toEqual('! &#x9;\ta\n');
  });

  test('should encode a space at the end of an atx heading', () => {
    expect(toString({ type: 'heading', depth: 1, children: [{ type: 'text', value: 'a  ' }] })).toEqual('! a &#x20;\n');
  });

  test('should encode a tab at the end of an atx heading', () => {
    expect(
      toString({
        type: 'heading',
        depth: 1,
        children: [{ type: 'text', value: 'a\t\t' }],
      }),
    ).toEqual('! a\t&#x9;\n');
  });

  test('should not need to encode spaces around a line ending in an atx heading (because the line ending is encoded)', () => {
    expect(
      toString({
        type: 'heading',
        depth: 3,
        children: [{ type: 'text', value: 'a \n b' }],
      }),
    ).toEqual('!!! a &#xA; b\n');
  });

  test('# to !', () => {
    expect(md2tid('# title 1\n')).toEqual('! title 1\n');
  });

  test('3 level #s to !s', () => {
    const md = `
# AAA

## BBB

### CCC

DDD
`;

    const tid = `! AAA

!! BBB

!!! CCC

DDD
`;
    expect(md2tid(md)).toEqual(tid);
  });
});
