import { toString, md2tid } from '../dist/index.mjs';

describe('html', () => {
  test('should support a void html', () => {
    expect(toString({ type: 'html' })).toEqual('');
  });
  test('should support an empty html', () => {
    expect(toString({ type: 'html', value: '' })).toEqual('');
  });
  test('should support html', () => {
    expect(toString({ type: 'html', value: 'a\nb' })).toEqual('a\nb\n');
  });

  test('should prevent html (text) from becoming html (flow) (1)', () => {
    expect(
      toString({
        type: 'paragraph',
        children: [
          { type: 'text', value: 'a\n' },
          { type: 'html', value: '<div>' },
        ],
      }),
    ).toEqual('a <div>\n');
  });

  test('should prevent html (text) from becoming html (flow) (2)', () => {
    expect(
      toString({
        type: 'paragraph',
        children: [
          { type: 'text', value: 'a\r' },
          { type: 'html', value: '<div>' },
        ],
      }),
    ).toEqual('a <div>\n');
  });

  test('should prevent html (text) from becoming html (flow) (3)', () => {
    expect(
      toString({
        type: 'paragraph',
        children: [
          { type: 'text', value: 'a\r\n' },
          { type: 'html', value: '<div>' },
        ],
      }),
    ).toEqual('a <div>\n');
  });

  test('should serialize html (text)', () => {
    expect(
      toString({
        type: 'paragraph',
        children: [
          { type: 'html', value: '<x>' },
          { type: 'text', value: 'a' },
        ],
      }),
    ).toEqual('<x>a\n');
  });
});
