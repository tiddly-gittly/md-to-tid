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
