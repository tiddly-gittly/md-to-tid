import { u } from 'unist-builder';
import { toTidast } from '../dist/index.mjs';

test('Map root to root', () => {
  expect(toTidast(u('root', []))).toEqual(u('root', []));
});
