import { toString, md2tid } from '../dist/index.mjs';

describe('bold', () => {
  test('should support an empty bold', () => {
    expect(toString({ type: 'strong' })).toEqual(`''''\n`);
  });

  test('should support a strong w/ children', () => {
    const tidResult = toString({ type: 'strong', children: [{ type: 'text', value: 'a' }] });
    expect(tidResult).toEqual(`''a''\n`);
  });

  test('should support a strong w/ underscores when `italic: "_"`', () => {
    const tidResult = toString({ type: 'strong', children: [{ type: 'text', value: 'a' }] }, { strong: '_' });
    expect(tidResult).toEqual(`_a_\n`);
  });

  test('should transform strong to bold', async () => {
    await expect(md2tid('**asdf**')).resolves.toEqual(`''asdf''\n`);
  });
});
