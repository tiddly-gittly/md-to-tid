import { toString } from '../dist/index.mjs';

describe('paragraph', () => {
  test('should support an empty paragraph', () => {
    expect(toString({ type: 'paragraph' })).toEqual('');
  });

  test('should support a paragraph', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: 'a\nb' }] })).toEqual('a\nb\n');
  });

  test('should encode spaces at the start of paragraphs', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '  a' }] })).toEqual('&#x20; a\n');
  });

  test('should encode spaces at the end of paragraphs', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: 'a  ' }] })).toEqual('a &#x20;\n');
  });

  test('should encode tabs at the start of paragraphs', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: '\t\ta' }] })).toEqual('&#x9;\ta\n');
  });

  test('should encode tabs at the end of paragraphs', () => {
    expect(toString({ type: 'paragraph', children: [{ type: 'text', value: 'a\t\t' }] })).toEqual('a\t&#x9;\n');
  });

  test('should encode spaces around line endings in paragraphs', () => {
    expect(
      toString({
        type: 'paragraph',
        children: [{ type: 'text', value: 'a  \n  b' }],
      }),
    ).toEqual('a &#x20;\n&#x20; b\n');
  });

  test('should encode spaces around line endings in paragraphs', () => {
    expect(
      toString({
        type: 'paragraph',
        children: [{ type: 'text', value: 'a\t\t\n\t\tb' }],
      }),
    ).toEqual('a\t&#x9;\n&#x9;\tb\n');
  });
});
