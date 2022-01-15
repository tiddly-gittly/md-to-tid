import type { Context, Options } from './types';

/**
 * @param base Context, that will be accessed in each handler.
 * @param extension Extra functions that user's extension provided, that we want to add to the context to use by the handlers.
 * @returns Augmented context.
 */
export function configure(base: Context, extension: Options): Context {
  let index = -1;
  let key: string;

  // First do sub-extensions.
  if (extension.extensions) {
    while (++index < extension.extensions.length) {
      configure(base, extension.extensions[index]);
    }
  }

  for (key in extension) {
    if (key === 'extensions') {
      // Empty.
    } else if (key === 'inConstruct' || key === 'join') {
      /* c8 ignore next 2 */
      // @ts-expect-error: hush.
      base[key] = [...(base[key] || []), ...(extension[key] || [])];
    } else if (key === 'handlers') {
      base[key] = Object.assign(base[key], extension[key] || {});
    } else {
      // @ts-expect-error: hush.
      base.options[key] = extension[key];
    }
  }

  return base;
}
