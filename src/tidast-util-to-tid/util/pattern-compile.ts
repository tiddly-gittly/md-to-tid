import type { Conflict } from '../types';

export function patternCompile(pattern: Conflict): RegExp {
  if (!pattern._compiled) {
    const before = (pattern.atBreak ? '[\\r\\n][\\t ]*' : '') + (pattern.before ? '(?:' + pattern.before + ')' : '');

    pattern._compiled = new RegExp(
      (before ? '(' + before + ')' : '') +
        (/[|\\{}()[\]^$+*?.-]/.test(pattern.character) ? '\\' : '') +
        pattern.character +
        (pattern.after ? '(?:' + pattern.after + ')' : ''),
      'g',
    );
  }

  return pattern._compiled;
}
