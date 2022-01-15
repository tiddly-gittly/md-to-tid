import { toString, md2tid } from '../dist/index.mjs';

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

  test('should support fenced code w/ tildes when `fence: "~"`', () => {
    expect(toString({ type: 'code', value: '' }, { fence: '~' })).toEqual('~~~\n~~~\n');
  });

  test('should not encode a grave accent when using tildes for fences', () => {
    expect(toString({ type: 'code', lang: 'a`b', value: '' }, { fence: '~' })).toEqual('~~~a`b\n~~~\n');
  });

  test('should use more grave accents for fences if there are streaks of grave accents in the value (fences)', () => {
    expect(toString({ type: 'code', value: '```\nasd\n```' }, { fences: true })).toEqual('````\n```\nasd\n```\n````\n');
  });

  test('should use more tildes for fences if there are streaks of tildes in the value (fences)', () => {
    expect(toString({ type: 'code', value: '~~~\nasd\n~~~' }, { fence: '~', fences: true })).toEqual('~~~~\n~~~\nasd\n~~~\n~~~~\n');
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
