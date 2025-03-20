import { checkBullet } from '../util/check-bullet';
import { ListItem, Parents } from 'mdast';
import { Info, Map, State } from '../types';
import { checkBulletOrdered } from '../util/check-bullet-ordered';

export function listItem(node: ListItem, parent: Parents | undefined, state: State, info: Info): string {
  let bullet = state.bulletCurrent || checkBullet(state);

  // 为有序列表添加标记值
  // 检查父节点是否存在，且父节点类型为 'list'，并且该列表是有序列表
  if (parent && parent.type === 'list' && parent.ordered) {
    bullet = checkBulletOrdered(state);
  }

  let size = bullet.length + 1;

  // 满足父列表为展开状态或当前列表项为展开状态，则将缩进大小（size）向上取整到最接近的 4 的倍数。
  if (((parent && parent.type === 'list' && parent.spread) || node.spread)) {
    // Math.ceil会返回大于或等于该数字的最小整数
    size = Math.ceil(size / 4) * 4;
  }

  const tracker = state.createTracker(info);
  // 假设 `bullet` 是 `#`，`size` 是 4.
  // 那么 `bullet + ' '.repeat(size - bullet.length)` 会生成 `#   `。
  tracker.move(bullet.repeat(size - bullet.length));
  tracker.shift(size);
  const exit = state.enter('listItem');
  const map: Map = function map(line, index, blank) {
    if (index) {
      if (line.startsWith("#") || line.startsWith("*")) {
        let old_bullet = line.split(" ")[0]
        let old_line = line.split(" ").slice(1).join(" ")
        return (blank ? '' : bullet.repeat(size - bullet.length) + old_bullet + ' ') + old_line;
      } else {
        return (blank ? '' : bullet.repeat(size - bullet.length) + ' ') + line;
      }
    }

    return (blank ? bullet : bullet.repeat(size - bullet.length) + ' ') + line;
  };
  const value = state.indentLines(state.containerFlow(node, tracker.current()), map);
  exit();

  return value;
}
