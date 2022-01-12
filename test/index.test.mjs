import { u } from 'unist-builder';
import { Heading as MdHeading } from 'mdast'
import { toTidast } from '../dist/index.mjs';

describe('Map from Mdast to Tidast', () => {
  test('Map root to root', () => {
    expect(toTidast(u('root', []))).toEqual(u('root', []));
  });

  test('Map literal to literal', () => {
    expect(toTidast(u('heading', []) as MdHeading)).toEqual(u('root', []));
  });
});
