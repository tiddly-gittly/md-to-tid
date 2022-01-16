import type { Context, Options } from '../types';

export function checkSeparateLineMarker(context: Context): Exclude<Options['separateLineMarker'], undefined> {
  const marker = context.options.separateLineMarker || '-'

  if (marker !== '*' && marker !== '-' && marker !== '_') {
    throw new Error(
      'Cannot serialize rules with `' +
        marker +
        '` for `options.rule`, expected `*`, `-`, or `_`'
    )
  }

  return marker
}
