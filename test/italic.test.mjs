import { toString, md2tid } from '../dist/index.mjs';

describe('italic', () => {
  test('should support an empty emphasis (italic)', () => {
    expect(toString({ type: 'emphasis' })).toEqual(`////\n`);
  });

  test('should support code w/ a value (indent)', () => {
    expect(toString({ type: 'emphasis', children: [{ type: 'text', value: 'a' }] })).toEqual(`//a//\n`);
  });
});
