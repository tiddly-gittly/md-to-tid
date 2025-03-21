import { toString } from '../dist/index.mjs';

describe('code (flow)', () => {
  test('should support empty code', () => {
    expect(toString({ type: 'code' })).toEqual('```\n```\n');
  });

  test('should support code w/ a value (indent)', () => {
    expect(toString({ type: 'code', value: 'a' })).toEqual('    a\n');
  });

  test('should support code w/ a value (fences)', () => {
    expect(toString({ type: 'code', value: 'a' }, { fences: true })).toEqual('```\na\n```\n');
  });

  test('should support code w/ a lang', () => {
    expect(toString({ type: 'code', lang: 'a', value: '' })).toEqual('```a\n```\n');
  });

  test('should support (ignore) code w/ only a meta', () => {
    expect(toString({ type: 'code', meta: 'a', value: '' })).toEqual('```\n```\n');
  });

  test('should support code w/ lang and meta', () => {
    expect(toString({ type: 'code', lang: 'a', meta: 'b', value: '' })).toEqual('```a b\n```\n');
  });

  test('should encode a space in `lang`', () => {
    expect(toString({ type: 'code', lang: 'a b', value: '' })).toEqual('```a&#x20;b\n```\n');
  });

  test('should encode a line ending in `lang`', () => {
    expect(toString({ type: 'code', lang: 'a\nb', value: '' })).toEqual('```a&#xA;b\n```\n');
  });

  test('should encode a grave accent in `lang`', () => {
    expect(toString({ type: 'code', lang: 'a`b', value: '' })).toEqual('```a&#x60;b\n```\n');
  });

  test('should escape a backslash in `lang`', () => {
    expect(toString({ type: 'code', lang: 'a\\-b', value: '' })).toEqual('```a\\\\-b\n```\n');
  });

  test('should not encode a space in `meta`', () => {
    expect(toString({ type: 'code', lang: 'x', meta: 'a b', value: '' })).toEqual('```x a b\n```\n');
  });

  test('should encode a line ending in `meta`', () => {
    expect(toString({ type: 'code', lang: 'x', meta: 'a\nb', value: '' })).toEqual('```x a&#xA;b\n```\n');
  });

  test('should encode a grave accent in `meta`', () => {
    expect(toString({ type: 'code', lang: 'x', meta: 'a`b', value: '' })).toEqual('```x a&#x60;b\n```\n');
  });

  test('should escape a backslash in `meta`', () => {
    expect(toString({ type: 'code', lang: 'x', meta: 'a\\-b', value: '' })).toEqual('```x a\\\\-b\n```\n');
  });

  test('should use more grave accents for fences if there are streaks of grave accents in the value (fences)', () => {
    expect(toString({ type: 'code', value: '```\nasd\n```' }, { fences: true })).toEqual('````\n```\nasd\n```\n````\n');
  });

  test('should use a fence if there is an info', () => {
    expect(toString({ type: 'code', lang: 'a', value: 'b' })).toEqual('```a\nb\n```\n');
  });

  test('should use a fence if there is only whitespace', () => {
    expect(toString({ type: 'code', value: ' ' })).toEqual('```\n \n```\n');
  });

  test('should use a fence if there first line is blank (void)', () => {
    expect(toString({ type: 'code', value: '\na' })).toEqual('```\n\na\n```\n');
  });

  test('should use a fence if there first line is blank (filled)', () => {
    expect(toString({ type: 'code', value: ' \na' })).toEqual('```\n \na\n```\n');
  });

  test('should use a fence if there last line is blank (void)', () => {
    expect(toString({ type: 'code', value: 'a\n' })).toEqual('```\na\n\n```\n');
  });

  test('should use a fence if there last line is blank (filled)', () => {
    expect(toString({ type: 'code', value: 'a\n ' })).toEqual('```\na\n \n```\n');
  });

  test('should use an indent if the value is indented', () => {
    expect(toString({ type: 'code', value: '  a\n\n b' })).toEqual('      a\n\n     b\n');
  });
});

describe('code (text)', () => {
  test('should support an empty code text', () => {
    expect(toString({ type: 'inlineCode' })).toEqual('``\n');
  });

  test('should support a code text', () => {
    expect(toString({ type: 'inlineCode', value: 'a' })).toEqual('`a`\n');
  });

  test('should support a space', () => {
    expect(toString({ type: 'inlineCode', value: ' ' })).toEqual('` `\n');
  });

  test('should support an eol', () => {
    expect(toString({ type: 'inlineCode', value: '\n' })).toEqual('`\n`\n');
  });

  test('should support several spaces', () => {
    expect(toString({ type: 'inlineCode', value: '  ' })).toEqual('`  `\n');
  });

  test('should use a fence of two grave accents if the value contains one', () => {
    expect(toString({ type: 'inlineCode', value: 'a`b' })).toEqual('``a`b``\n');
  });

  test('should use a fence of one grave accent if the value contains two', () => {
    expect(toString({ type: 'inlineCode', value: 'a``b' })).toEqual('`a``b`\n');
  });

  test('should use a fence of three grave accents if the value contains two and one', () => {
    expect(toString({ type: 'inlineCode', value: 'a``b`c' })).toEqual('```a``b`c```\n');
  });

  test('should pad w/ a space if the value starts w/ a grave accent', () => {
    expect(toString({ type: 'inlineCode', value: '`a' })).toEqual('`` `a ``\n');
  });

  test('should pad w/ a space if the value ends w/ a grave accent', () => {
    expect(toString({ type: 'inlineCode', value: 'a`' })).toEqual('`` a` ``\n');
  });

  test('should pad w/ a space if the value starts and ends w/ a space', () => {
    expect(toString({ type: 'inlineCode', value: ' a ' })).toEqual('`  a  `\n');
  });

  test('should not pad w/ spaces if the value ends w/ a non-space', () => {
    expect(toString({ type: 'inlineCode', value: ' a' })).toEqual('` a`\n');
  });

  test('should not pad w/ spaces if the value starts w/ a non-space', () => {
    expect(toString({ type: 'inlineCode', value: 'a ' })).toEqual('`a `\n');
  });

  test('should prevent breaking out of code (#)', () => {
    expect(toString({ type: 'inlineCode', value: 'a\n#' })).toEqual('`a #`\n');
  });

  test('should prevent breaking out of code (!)', () => {
    expect(toString({ type: 'inlineCode', value: 'a\n!' })).toEqual('`a !`\n');
  });

  test('should prevent breaking out of code (\\d\\.)', () => {
    expect(toString({ type: 'inlineCode', value: 'a\n1. ' })).toEqual('`a 1. `\n');
  });

  test('should prevent breaking out of code (cr)', () => {
    expect(toString({ type: 'inlineCode', value: 'a\r-' })).toEqual('`a -`\n');
  });

  test('should prevent breaking out of code (crlf)', () => {
    expect(toString({ type: 'inlineCode', value: 'a\r\n-' })).toEqual('`a -`\n');
  });
});
