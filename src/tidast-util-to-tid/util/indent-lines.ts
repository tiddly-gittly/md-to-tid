export type Map = (value: string, line: number, blank: boolean) => string;
const eol = /\r?\n|\r/g;

export function indentLines(value: string, map: Map): string {
  const result: Array<string> = [];
  let start = 0;
  let line = 0;
  let match: RegExpExecArray | null;

  while ((match = eol.exec(value))) {
    one(value.slice(start, match.index));
    result.push(match[0]);
    start = match.index + match[0].length;
    line++;
  }

  one(value.slice(start));

  return result.join('');

  function one(value: string) {
    result.push(map(value, line, !value));
  }
}
