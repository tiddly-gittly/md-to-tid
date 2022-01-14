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
