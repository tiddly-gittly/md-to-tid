import { Options, State } from './types';

const own = {}.hasOwnProperty;

export function configure(base: State, extension: Options): State {
  let index = -1;
  let key: keyof Options;

  // First do subextensions.
  if (extension.extensions) {
    while (++index < extension.extensions.length) {
      configure(base, extension.extensions[index]);
    }
  }

  for (key in extension) {
    if (own.call(extension, key)) {
      switch (key) {
        case 'extensions': {
          // Empty.
          break;
        }

        /* c8 ignore next 4 */
        case 'unsafe': {
          list(base[key], extension[key]);
          break;
        }

        case 'join': {
          list(base[key], extension[key]);
          break;
        }

        case 'handlers': {
          map(base[key], extension[key]);
          break;
        }

        default: {
          // @ts-expect-error: matches.
          base.options[key] = extension[key];
        }
      }
    }
  }

  return base;
}

/**
 * @template T
 * @param {Array<T>} left
 * @param {Array<T> | null | undefined} right
 */
function list<T>(left: Array<T>, right: Array<T> | null | undefined) {
  if (right) {
    left.push(...right);
  }
}

/**
 * @template T
 * @param {Record<string, T>} left
 * @param {Record<string, T> | null | undefined} right
 */
function map<T>(left: Record<string, T>, right: Record<string, T> | null | undefined) {
  if (right) {
    Object.assign(left, right);
  }
}
