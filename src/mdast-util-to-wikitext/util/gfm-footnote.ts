import { FootnoteDefinition, FootnoteReference, type Parents } from 'mdast';
import { Info, Options, State, Unsafe } from '../types';

footnoteReference.peek = footnoteReferencePeek;

/**
 * GFM表格注册脚注
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {Object}
 *   Extension for `mdast-util-to-tid`.
 */
export function gfmFootnoteToTid(options: Options) {
  const gfmUnsafe: Array<Unsafe> = [{ character: '[', inConstruct: ['label', 'phrasing', 'reference'] }];
  return {
    // This is on by default already.
    gfmUnsafe,
    handlers: { footnoteDefinition, footnoteReference },
  };

  function footnoteDefinition(node: FootnoteDefinition, _: Parents | undefined, state: State, info: Info) {
    const exit = state.enter('footnoteDefinition');
    const subexit = state.enter('label');
    subexit();
    exit();
    return '';
  }
}

function footnoteReferencePeek() {
  return '[';
}

function footnoteReference(node: FootnoteReference, _: Parents | undefined, state: State, info: Info) {
  const tracker = state.createTracker(info);
  let value = tracker.move('<<fnote "');
  const exit = state.enter('footnoteReference');
  const subexit = state.enter('reference');
  value += tracker.move(state.useMemo.get('footnoteDefinition')?.get(state.associationId(node)));
  subexit();
  exit();
  value += tracker.move('">>');
  return value;
}
