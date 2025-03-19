import { md2tid, toString } from '../dist/index.mjs';
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

  test('multiple same type of list', () => {
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

    expect(md2tid(listArticleMD)).toEqual(listArticleTid);
  });

  test('multiple mixed type of list 1', () => {
    const listArticleMD = `
- item 1
- item 2
  1. item 2.1
  1. item 2.2
  - asdfasdf
- item 3
  - item 3.1
    - item 3.1.1
`;

    const listArticleTid = `
* item 1
* item 2
*# item 2.1
*# item 2.2
** asdfasdf
* item 3
** item 3.1
*** item 3.1.1
`;

    expect(md2tid(listArticleMD)).toEqual(listArticleTid);
  });
});

describe('extension', () => {
  test('render 2 level 1 list ast', () => {
    expect(
      toString(
        {
          type: 'root',
          children: [{ type: 'strong', children: [{ type: 'text', value: 'a' }] }],
        },
        {
          extensions: [
            {
              join: undefined,
              handlers: undefined,
              extensions: undefined,
            },
          ],
        },
      ),
    ).toEqual(`''a''\n`);
  });
});


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

  test('render 2 level 1+1 node ast', () => {
    const tidResult = toString({
      type: 'list',
      children: [
        {
          type: 'listItem',
          children: [{ type: 'paragraph', children: [{ type: 'text', value: 'c\nd' }] }],
        },
        {
          type: 'listItem',
          children: [{ type: 'thematicBreak' }],
        },
        {
          type: 'listItem',
          children: [{ type: 'paragraph', children: [{ type: 'text', value: 'e\nf' }] }],
        },
      ],
    });
    expect(tidResult).toEqual(`* c
* d

* ---

* e
* f
`);
  });

  test('- to *', () => {
    expect(md2tid('- item 1')).toEqual('* item 1\n');
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

  test('1. to #', () => {
    expect(md2tid('1. item 1')).toEqual('# item 1\n');
  });
});

