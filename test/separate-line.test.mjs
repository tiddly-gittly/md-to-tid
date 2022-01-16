import { toString, md2tid } from '../dist/index.mjs';

describe('separate-line', () => {
  test('should support a separate-line', () => {
    expect(toString({ type: 'thematicBreak' })).toEqual('---\n');
  });
  test('should support a separate-line w/ more repetitions w/ `separateLineRepetition`', () => {
    expect(toString({ type: 'thematicBreak' }, { separateLineRepetition: 5 })).toEqual('-----\n');
  });
  test('should not support a separate-line w/ less repetitions w/ `separateLineRepetition`', () => {
    expect(() => toString({ type: 'thematicBreak' }, { separateLineRepetition: 2 })).toThrowError(
      /Cannot serialize rules with repetition `2` for `options\.separateLineRepetition`, expected `3` or more/,
    );
  });
  test('should support a separate-line w/ more spaces w/ `separateLineSpaces`', () => {
    expect(toString({ type: 'thematicBreak' }, { separateLineSpaces: true })).toEqual('- - -\n');
  });

  test('should support a separate-line w/ dashes when `separateLineMarker: "-"`', () => {
    const tidResult = toString({ type: 'thematicBreak' }, { separateLineMarker: '-' });
    expect(tidResult).toEqual('---\n');
  });

  test('should support a separate-line w/ underscores when `separateLineMarker: "_"`', () => {
    const tidResult = toString({ type: 'thematicBreak' }, { separateLineMarker: '_' });
    expect(tidResult).toEqual(`___\n`);
  });

  test('should transform thematicBreak to separate-line', async () => {
    await expect(md2tid('***\n')).resolves.toEqual('---\n');
  });
});
