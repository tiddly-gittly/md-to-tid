import { u } from 'unist-builder';
import { unified } from 'unified';
import { toString } from '../dist/index.mjs';

describe('retidStringify', () => {
  test('* unordered list', () => {
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

  test('# ordered list', () => {
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
});
