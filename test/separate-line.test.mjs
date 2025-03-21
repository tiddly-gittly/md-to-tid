import { md2tid, toString } from '../dist/index.mjs';

describe('separate-line', () => {
  test('should support a separate-line', () => {
    expect(toString({ type: 'thematicBreak' })).toEqual('---\n');
  });
  test('should support a separate-line w/ more repetitions w/ `horizontalRuleRepetition`', () => {
    expect(toString({ type: 'thematicBreak' }, { horizontalRuleRepetition: 5 })).toEqual('-----\n');
  });
  test('should not support a separate-line w/ less repetitions w/ `horizontalRuleRepetition`', () => {
    expect(() => toString({ type: 'thematicBreak' }, { horizontalRuleRepetition: 2 })).toThrowError(
      "Cannot serialize rules with repetition `2` for `options.ruleRepetition`, expected `3` or more",
    );
  });

  test('should support a separate-line w/ dashes when `separateLineMarker: "-"`', () => {
    const tidResult = toString({ type: 'thematicBreak' }, { separateLineMarker: '-' });
    expect(tidResult).toEqual('---\n');
  });

  test('should transform thematicBreak to separate-line', () => {
    expect(md2tid('***\n')).toEqual('---\n');
  });
});
