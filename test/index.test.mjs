import { u } from 'unist-builder';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { toString, md2tid } from '../dist/index.mjs';

describe('unordered list', () => {
  test('render 1 level 1 node ast', () => {
    expect(
      toString({
        type: 'list',
        children: [
          {
            type: 'listItem',
            children: [{ type: 'paragraph', children: [{ type: 'text', value: 'alpha' }] }],
          },
        ],
      }),
    ).toEqual('* alpha\n');
  });

  test('render 2 level 1+1 node ast', () => {
    const tidResult = toString({
      type: 'list',
      children: [
        {
          type: 'listItem',
          spread: false,
          children: [
            { type: 'paragraph', children: [{ type: 'text', value: 'alpha' }] },
            {
              type: 'list',
              children: [
                {
                  type: 'listItem',
                  spread: false,
                  children: [{ type: 'paragraph', children: [{ type: 'text', value: 'alpha' }] }],
                },
              ],
            },
          ],
        },
      ],
    });
    expect(tidResult).toEqual('* alpha\n** alpha\n');
  });

  test('- to *', async () => {
    await expect(md2tid('- item 1')).resolves.toEqual('* item 1\n');
  });
});

describe('ordered list', () => {
  test('render 1 level 1 node ast', () => {
    expect(
      toString({
        type: 'list',
        ordered: true,
        children: [
          {
            type: 'listItem',
            children: [
              {
                type: 'paragraph',
                children: [{ type: 'text', value: 'item 1' }],
              },
            ],
          },
        ],
      }),
    ).toEqual('# item 1\n');
  });

  test('1. to #', async () => {
    await expect(md2tid('1. item 1')).resolves.toEqual('# item 1\n');
  });
});

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
    expect(toString({ type: 'heading', depth: 3, children: [{ type: 'text', value: 'a' }] }, { closeAtx: true })).toEqual('!!! a !!!\n');
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
    expect(toString({ type: 'heading', depth: 1, children: [{ type: 'text', value: 'a #' }] })).toEqual('! a \\#\n');
  });

  test('should escape a `#` at the end of a heading (2)', () => {
    expect(toString({ type: 'heading', depth: 1, children: [{ type: 'text', value: 'a ##' }] })).toEqual('! a #\\#\n');
  });

  test('should not escape a `#` in a heading (2)', () => {
    expect(toString({ type: 'heading', depth: 1, children: [{ type: 'text', value: 'a # b' }] })).toEqual('! a # b\n');
  });

  test('should encode a space at the start of an atx heading', () => {
    expect(toString({ type: 'heading', depth: 1, children: [{ type: 'text', value: '  a' }] })).toEqual('! &#x20; a\n');
  });

  test('should encode a tab at the start of an atx heading', () => {
    expect(toString({ type: 'heading', depth: 1, children: [{ type: 'text', value: '\t\ta' }] })).toEqual('! &#x9;\ta\n');
  });

  test('should encode a space at the end of an atx heading', () => {
    expect(toString({ type: 'heading', depth: 1, children: [{ type: 'text', value: 'a  ' }] })).toEqual('! a &#x20;\n');
  });

  test('should encode a tab at the end of an atx heading', () => {
    expect(toString({ type: 'heading', depth: 1, children: [{ type: 'text', value: 'a\t\t' }] })).toEqual('! a\t&#x9;\n');
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

  test('# to !', async () => {
    await expect(md2tid('# title 1\n')).resolves.toEqual('! title 1\n');
  });

  test('3 level #s to !s', async () => {
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
    await expect(md2tid(md)).resolves.toEqual(tid);
  });
});

describe('integration test', () => {
  test('render 2 level 1 list ast', () => {
    expect(
      toString({
        type: 'root',
        children: [
          { type: 'paragraph', children: [{ type: 'text', value: 'a' }] },
          { type: 'list', children: [{ type: 'listItem' }] },
          { type: 'list', children: [{ type: 'listItem' }] },
          { type: 'list', ordered: true, children: [{ type: 'listItem' }] },
          { type: 'list', ordered: true, children: [{ type: 'listItem' }] },
          { type: 'paragraph', children: [{ type: 'text', value: 'd' }] },
        ],
      }),
    ).toEqual('a\n\n*\n\n*\n\n#\n\n#\n\nd\n');
  });

  test('multiple list', async () => {
    const listArticleMD = `
- item 1
- item 2
  - item 2.1
  - item 2.2
- item 3
  - item 3.1
    - item 3.1.1

1. item
1. item2
    1. item3
    1. item3
1. item2
  1. only four spaces indent will be recognized as next level
`;

    const listArticleTid = `* item 1
* item 2
** item 2.1
** item 2.2
* item 3
** item 3.1
*** item 3.1.1

# item
# item2
## item3
## item3
# item2
# only four spaces indent will be recognized as next level
`;

    await expect(md2tid(listArticleMD)).resolves.toEqual(listArticleTid);
  });
});
