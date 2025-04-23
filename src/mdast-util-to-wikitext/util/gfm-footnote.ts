import { FootnoteDefinition, FootnoteReference, type Parents } from 'mdast';
import { Info, Options, State, Unsafe } from '../types';

footnoteReference.peek = footnoteReferencePeek;

function footnoteReferencePeek() {
  return '[';
}

function footnoteReference(node: FootnoteReference, _: Parents | undefined, state: State, info: Info) {
  const tracker = state.createTracker(info);
  let value = tracker.move('[^');
  const exit = state.enter('footnoteReference');
  const subexit = state.enter('reference');
  value += tracker.move(state.safe(state.associationId(node), { after: ']', before: value }));
  subexit();
  exit();
  value += tracker.move(']');
  return value;
}

/**
 * GFM表格注册脚注
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {Object}
 *   Extension for `mdast-util-to-tid`.
 */
export function gfmFootnoteToTid(options: Options) {
  // To do: next major: change default.
  let firstLineBlank = false;

  if (options && options.firstLineBlank) {
    firstLineBlank = true;
  }
  const gfmUnsafe: Array<Unsafe> = [{ character: '[', inConstruct: ['label', 'phrasing', 'reference'] }];
  return {
    // This is on by default already.
    gfmUnsafe,
    handlers: { footnoteDefinition, footnoteReference },
  };

  function footnoteDefinition(node: FootnoteDefinition, _: Parents | undefined, state: State, info: Info) {
    const tracker = state.createTracker(info);
    let value = tracker.move('[^');
    const exit = state.enter('footnoteDefinition');
    const subexit = state.enter('label');
    value += tracker.move(state.safe(state.associationId(node), { before: value, after: ']' }));
    subexit();

    value += tracker.move(']:');

    if (node.children && node.children.length > 0) {
      tracker.shift(4);

      value += tracker.move(
        (firstLineBlank ? '\n' : ' ') + state.indentLines(state.containerFlow(node, tracker.current()), firstLineBlank ? mapAll : mapExceptFirst),
      );
    }

    exit();

    return value;
  }
}

function mapExceptFirst(value: string, line: number, blank: boolean) {
  return line === 0 ? line.toString() : mapAll(value, line, blank);
}

function mapAll(value: string, line: number, blank: boolean) {
  return (blank ? '' : '    ') + line;
}
