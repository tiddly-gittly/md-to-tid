import { toString, md2tid } from '../dist/index.mjs';

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
