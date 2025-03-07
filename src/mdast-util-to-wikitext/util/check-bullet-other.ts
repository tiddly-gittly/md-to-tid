import { Options, State } from '../types';
import { checkBullet } from './check-bullet';

/**
 * 检查除默认标记字符外的其他列表项标记字符是否有效。
 *
 * 如果未提供 `bulletOther`，则根据默认标记字符返回另一个有效的标记字符。
 * 如果提供的 `bulletOther` 不是 `*`、`+` 或 `-`，则抛出错误。
 * 如果 `bulletOther` 与默认标记字符相同，也会抛出错误。
 *
 * @param state - 包含配置选项的状态对象。
 * @returns 有效的其他列表项标记字符。
 */
export function checkBulletOther(state: State): Exclude<Options['bullet'], null | undefined> {
  const bullet = checkBullet(state);
  const bulletOther = state.options.bulletOther;

  if (!bulletOther) {
    return bullet === '*' ? '-' : '*'
  }

  if (bulletOther !== '*' && bulletOther !== '+' && bulletOther !== '-') {
    throw new Error(
      'Cannot serialize items with `' +
      bulletOther +
      '` for `options.bulletOther`, expected `*`, `+`, or `-`'
    )
  }

  if (bulletOther === bullet) {
    throw new Error(
      'Expected `bullet` (`' +
      bullet +
      '`) and `bulletOther` (`' +
      bulletOther +
      '`) to be different'
    )
  }

  return bulletOther;
}
