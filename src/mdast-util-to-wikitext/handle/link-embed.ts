import { Text } from 'mdast';
import { Info, State } from '../types';

export function linkEmbed(node: Text, state: State, info: Info) {
  // 从node.value 找到所有符合要求的语法，存储下来。
  // 存储的结果然后safe一下，
  // 存储的结果转换语法
  // 然后node.value整体safe的结果字符串替换全局替换为转换的语法。
  const patternInternalLink = /(?<!!)\[\[(.*?)]]/g;
  const patternEmbed = /!\[\[(.*?)]]/g;
  const regexpInternalLink = node.value.match(patternInternalLink) || [];
  const regexpEmbed = node.value.match(patternEmbed) || [];
  let safeRegexpInternalLink = [];
  let safeRegexpEmbed = [];
  let transformerRegexpInternalLink = [];
  let transformerRegexpEmbed = [];
  for (const item of regexpInternalLink) {
    safeRegexpInternalLink.push(state.safe(item, info));
    patternInternalLink.lastIndex = 0;
    const execArray = patternInternalLink.exec(item);
    const match = execArray && execArray[1];
    if (match) {
      // [[Link|AltText|AltText1|...]]
      const verticalBarIndex = match.indexOf('|');
      let linkText = match.substring(0, verticalBarIndex);
      const altText = match.substring(verticalBarIndex + 1).replaceAll("|","_");
      if (verticalBarIndex === -1) {
        transformerRegexpInternalLink.push(item);
      } else {
        // [[Displayed Link Title|Tiddler Title]]
        transformerRegexpInternalLink.push(`[[${altText}|${linkText}]]`);
      }
    } else {
      transformerRegexpInternalLink.push(item);
    }
  }
  for (const item of regexpEmbed) {
    safeRegexpEmbed.push(state.safe(item, info));
    patternEmbed.lastIndex = 0;
    const execArray = patternEmbed.exec(item);
    const match = execArray && execArray[1];
    if (match) {
      // ![[Embeds|AltText|AltText1|...|200x400]]
      // 黑曜石嵌入笔记和图像共用一个语法，但太微是分开的不同的语法。
      // 选择最简单的共同点{{条目名}}
      const firstVerticalBarIndex = match.indexOf('|');
      if (firstVerticalBarIndex === -1) {
        transformerRegexpEmbed.push(`{{${match}}}`);
      } else {
        transformerRegexpEmbed.push(`{{${match.substring(0, firstVerticalBarIndex)}}}`);
      }
    } else {
      transformerRegexpEmbed.push(item);
    }
  }
  let safeArray = safeRegexpInternalLink.concat(safeRegexpEmbed);
  let transformerArray = transformerRegexpInternalLink.concat(transformerRegexpEmbed);
  let allArrayLength = regexpEmbed.length + regexpInternalLink.length;
  let index = -1;
  let result = state.safe(node.value, info);
  while (index++ < allArrayLength) {
    result = result.replaceAll(safeArray[index], transformerArray[index]);
  }

  return result;
}
