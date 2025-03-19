import { md2tid, toString } from '../dist/index.mjs';

describe('break', () => {
  test('should support a break', () => {
    expect(toString({ type: 'break' })).toEqual('\\\n');
  });

  test('should serialize breaks in heading (atx) as a space', () => {
    const tidResult = toString({
      type: 'heading',
      depth: 3,
      children: [{ type: 'text', value: 'a' }, { type: 'break' }, { type: 'text', value: 'b' }],
    });
    expect(tidResult).toEqual('!!! a b\n');
  });

  test('should serialize breaks (with space) in heading (atx) as a space', () => {
    const tidResult = toString({
      type: 'heading',
      depth: 3,
      children: [{ type: 'text', value: 'a ' }, { type: 'break' }, { type: 'text', value: 'b' }],
    });
    expect(tidResult).toEqual(`!!! a b\n`);
  });

  test('should serialize breaks in heading (setext)', () => {
    expect(md2tid('a  \nb\n=\n')).toEqual('! a b\n');
  });
});
