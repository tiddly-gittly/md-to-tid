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
    ).toEqual('*   alpha\n');
  });

  test('- to *', async () => {
    await expect(md2tid('- item 1')).resolves.toEqual('*   item 1\n');
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
    ).toEqual('#   item 1\n');
  });

  test('1. to #', async () => {
    await expect(md2tid('1. item 1')).resolves.toEqual('#   item 1\n');
  });
});
