import { InlineCode, type Parents, Table, TableCell, TableRow } from 'mdast';
import { Info, Options, State, Unsafe } from '../types';
import { handle } from '../handle';

const ALIGN_LOWER_RIGHT: number = 114;
const ALIGN_LOWER_CENTER: number = 99;
const ALIGN_LOWER_LEFT: number = 108;

const ALIGN_UPPER_RIGHT: number = 82;
const ALIGN_UPPER_CENTER: number = 67;
const ALIGN_UPPER_LEFT: number = 76;

/**
 * @param {string} value
 *   Cell value.
 * @returns {number}
 *   Cell size.
 */
function defaultStringLength(value: string): number {
  return value.length;
}

/**
 * GFM表格注册函数
 *
 * @param {Options | null | undefined} options - 转换选项，可为空。
 * @returns {Object} - 包含不安全字符和处理函数的配置对象。
 */
export function gfmTableToTid(options: Options | null | undefined) {
  // 如果未提供选项，则使用空对象
  const settings = options || {};
  // 获取表格分隔符对齐设置，默认为true
  const alignDelimiters = settings.tablePipeAlign || true;
  // 获取字符串长度计算函数，默认为defaultStringLength
  const stringLength = settings.stringLength || defaultStringLength;
  // 根据填充设置确定单元格周围的字符
  const around = '|';

  // 定义不安全字符及其适用的构造
  const gfmUnsafe: Array<Unsafe> = [
    { character: '\r', inConstruct: 'tableCell' },
    { character: '\n', inConstruct: 'tableCell' },
    // 当竖线后面跟着制表符、空格、破折号或冒号时，可能会导致表格解析问题
    { atBreak: true, character: '|', after: '[\t :-]' },
    // 单元格内的竖线必须进行编码
    { character: '|', inConstruct: 'tableCell' },
    // 冒号后面必须跟着破折号，否则可能会开始一个分隔符行
    { atBreak: true, character: ':', after: '-' },
    // 分隔符行也可以以破折号开头，后面跟着更多破折号、冒号或竖线
    { atBreak: true, character: '-', after: '[:|-]' },
  ];
  return {
    gfmUnsafe,
    // 定义不同节点类型的处理函数
    handlers: {
      inlineCode: inlineCodeWithTable,
      table: handleTable,
      tableCell: handleTableCell,
      tableRow: handleTableRow,
    },
  };

  /**
   * 处理表格节点，将其转换为TiddlyWiki表格字符串。
   *
   * @param {Table} node - 表格节点。
   * @param {Parents | undefined} _ - 父节点，未使用。
   * @param {State} state - 转换状态。
   * @param {Info} info - 转换信息。
   * @returns {string} - 转换后的TiddlyWiki表格字符串。
   */
  function handleTable(node: Table, _: Parents | undefined, state: State, info: Info) {
    return serializeData(handleTableAsData(node, state, info), node.align);
  }

  /**
   * 处理表格行节点，将其转换为TiddlyWiki表格字符串。
   * 此函数通常不直接使用，因为表格行在表格级别处理。
   * 但如果直接传入表格行节点，会尽力处理。
   *
   * @param {TableRow} node - 表格行节点。
   * @param {Parents | undefined} _ - 父节点，未使用。
   * @param {State} state - 转换状态。
   * @param {Info} info - 转换信息。
   * @returns {string} - 转换后的TiddlyWiki表格字符串。
   */
  function handleTableRow(node: TableRow, _: Parents | undefined, state: State, info: Info) {
    const row = handleTableRowAsData(node, state, info);
    const value = serializeData([row], undefined);
    // `markdown-table` 总是会添加一个对齐行，这里只取第一行
    return value.slice(0, value.indexOf('\n'));
  }

  /**
   * 处理表格单元格节点，将其转换为字符串。
   *
   * @param {TableCell} node - 表格单元格节点。
   * @param {Parents | undefined} _ - 父节点，未使用。
   * @param {State} state - 转换状态。
   * @param {Info} info - 转换信息。
   * @returns {string} - 转换后的单元格字符串。
   */
  function handleTableCell(node: TableCell, _: Parents | undefined, state: State, info: Info) {
    const exit = state.enter('tableCell');
    const subexit = state.enter('phrasing');
    const value = state.containerPhrasing(node, {
      ...info,
      before: around,
      after: around,
    });
    subexit();
    exit();
    return value;
  }

  /**
   * 将表格数据矩阵转换为TiddlyWiki表格字符串。
   *
   * @param {Array<Array<string>>} matrix - 表格数据矩阵。
   * @param {Array<string | null | undefined> | null | undefined} [align] - 列对齐方式。
   * @returns {string} - 转换后的TiddlyWiki表格字符串。
   */
  function serializeData(matrix: Array<Array<string>>, align: Array<string | null | undefined> | null | undefined): string {
    return tiddlywikiTable(matrix, {
      align,
      alignDelimiters,
      stringLength,
    });
  }

  /**
   * 将表格数据矩阵转换为TiddlyWiki表格字符串。
   *
   * @param {Array<Array<string>>} matrix - 表格数据矩阵。
   * @param {Object} options - 转换选项。
   * @param {Array<string | null | undefined> | null | undefined} [options.align] - 列对齐方式。
   * @param {boolean} [options.alignDelimiters] - 是否对齐分隔符。
   * @param {(value: string) => number} [options.stringLength] - 字符串长度计算函数。
   * @param {boolean | null | undefined | true} [options.delimiterStart] - 是否在每行开头添加分隔符。
   * @param {boolean | null | undefined | true} [options.delimiterEnd] - 是否在每行结尾添加分隔符。
   * @returns {string} - 转换后的TiddlyWiki表格字符串。
   */
  function tiddlywikiTable(
    matrix: Array<Array<string>>,
    options: {
      align?: (string | null | undefined)[] | null | undefined;
      alignDelimiters?: boolean;
      stringLength?: (value: string) => number;
      delimiterStart?: boolean | null | undefined;
      delimiterEnd?: boolean | null | undefined;
    },
  ): string {
    const settings = options || {};
    settings.delimiterStart = settings.delimiterStart || true;
    settings.delimiterEnd = settings.delimiterEnd || true;

    // 处理对齐设置，将其转换为数组
    const align = (settings.align || []).concat();
    const stringLength = settings.stringLength || defaultStringLength;
    // 存储每列的对齐方式，用字符编码表示
    const alignments: Array<number> = [];
    // 存储每行的单元格数据
    const cellMatrix: Array<Array<string>> = [];
    // 存储每行每个单元格的大小
    const sizeMatrix: Array<Array<number>> = [];
    // 存储每列最长单元格的大小
    const longestCellByColumn: Array<number> = [];
    // 存储每行最多的单元格数量
    let mostCellsPerRow = 0;
    // 当前处理的行索引
    let rowIndex = -1;

    // 遍历矩阵，计算单元格大小和最长单元格，得到单元格文本矩阵、单元格文本长度矩阵
    // 如果我们不进行对齐定界符，这个循环是多余的，但是如果我们进行对齐，否则在对齐时我们会做多余的工作，所以为了优化对齐过程。
    while (++rowIndex < matrix.length) {
      const row: Array<string> = [];
      const sizes: Array<number> = [];
      let columnIndex = -1;

      if (matrix[rowIndex].length > mostCellsPerRow) {
        mostCellsPerRow = matrix[rowIndex].length;
      }

      while (++columnIndex < matrix[rowIndex].length) {
        const cell = serialize(matrix[rowIndex][columnIndex]);

        if (settings.alignDelimiters) {
          const size = stringLength(cell);
          sizes[columnIndex] = size;

          if (longestCellByColumn[columnIndex] === undefined || size > longestCellByColumn[columnIndex]) {
            longestCellByColumn[columnIndex] = size;
          }
        }

        row.push(cell);
      }

      cellMatrix[rowIndex] = row;
      sizeMatrix[rowIndex] = sizes;
    }

    // column是列，row是行
    // 确定每列的对齐方式
    let columnIndex = -1;

    if (typeof align === 'object' && 'length' in align) {
      while (++columnIndex < mostCellsPerRow) {
        alignments[columnIndex] = toAlignment(align[columnIndex]);
      }
    } else {
      const code = toAlignment(align);

      while (++columnIndex < mostCellsPerRow) {
        alignments[columnIndex] = code;
      }
    }

    rowIndex = -1;
    // 存储每行的字符串
    const lines: Array<string> = [];

    while (++rowIndex < cellMatrix.length) {
      // 表格每一行的字符串数组  ['a', 'b', 'c', 'd'];
      const row = cellMatrix[rowIndex];
      // 表格每一行的字符串大小数组 [1, 1, 1, 1];
      const sizes = sizeMatrix[rowIndex];
      columnIndex = -1;
      // 存储当前行的单元格字符串
      const line: Array<string> = [];

      while (++columnIndex < mostCellsPerRow) {
        const cell = row[columnIndex] || '';
        let before = '';
        let after = '';

        if (settings.alignDelimiters) {
          // 一列（columnIndex列）中最长的单元格长度 减去 一行中（columnIndex列）单元格长度
          // A列最长3，A列当前行单元格长度1，size结果即为 2。
          let size = longestCellByColumn[columnIndex] - (sizes[columnIndex] || 0);
          // 对齐方式
          let code = alignments[columnIndex];
          // 对于TiddlyWiki需要增加 2 个空白字符用来标记对其方式。
          size += 2;
          if (code === ALIGN_LOWER_RIGHT) {
            before = ' '.repeat(size);
          } else if (code === ALIGN_LOWER_CENTER) {
            if (size % 2) {
              // 奇数情况
              before = ' '.repeat(size / 2 + 0.5);
              after = ' '.repeat(size / 2 - 0.5);
            } else {
              // 偶数情况
              before = ' '.repeat(size / 2);
              after = before;
            }
          } else {
            // 若无其他情况，默认为左对齐
            after = ' '.repeat(size);
          }
        }

        if (settings.delimiterStart && !columnIndex) {
          line.push('|');
        }

        if (settings.alignDelimiters) {
          line.push(before);
        }

        line.push(cell);

        if (settings.alignDelimiters) {
          line.push(after);
        }

        if (settings.delimiterEnd || columnIndex !== mostCellsPerRow - 1) {
          line.push('|');
        }
      }

      lines.push(!settings.delimiterEnd ? line.join('').replace(/ +$/, '') : line.join(''));
    }

    return lines.join('\n');
  }

  /**
   * 将对齐值转换为对应的字符编码。
   *
   * @param {string | null | undefined} value - 对齐值。
   * @returns {number} - 对应的字符编码。
   */
  function toAlignment(value: string | null | undefined): number {
    const code = typeof value === 'string' ? value.codePointAt(0) : 0;

    return code === ALIGN_UPPER_CENTER /* `C` */ || code === ALIGN_LOWER_CENTER /* `c` */
      ? ALIGN_LOWER_CENTER /* `c` */
      : code === ALIGN_UPPER_LEFT /* `L` */ || code === ALIGN_LOWER_LEFT /* `l` */
      ? ALIGN_LOWER_LEFT /* `l` */
      : code === ALIGN_UPPER_RIGHT /* `R` */ || code === ALIGN_LOWER_RIGHT /* `r` */
      ? ALIGN_LOWER_RIGHT /* `r` */
      : 0;
  }

  /**
   * 将值序列化为字符串。
   *
   * @param {string | null | undefined} [value] - 要序列化的值。
   * @returns {string} - 序列化后的字符串。
   */
  function serialize(value: string | null | undefined): string {
    return value === null || value === undefined ? '' : String(value);
  }

  /**
   * 将表格节点转换为数据矩阵。
   *
   * @param {Table} node - 表格节点。
   * @param {State} state - 转换状态。
   * @param {Info} info - 转换信息。
   * @returns {Array<Array<string>>} - 转换后的数据矩阵。
   */
  function handleTableAsData(node: Table, state: State, info: Info): Array<Array<string>> {
    const children = node.children;
    let index = -1;
    const result: Array<Array<string>> = [];
    const subexit = state.enter('table');

    while (++index < children.length) {
      result[index] = handleTableRowAsData(children[index], state, info);
    }

    subexit();

    return result;
  }

  /**
   * 将表格行节点转换为数据数组。
   *
   * @param {TableRow} node - 表格行节点。
   * @param {State} state - 转换状态。
   * @param {Info} info - 转换信息。
   * @returns {Array<string>} - 转换后的数据数组。
   */
  function handleTableRowAsData(node: TableRow, state: State, info: Info): Array<string> {
    const children = node.children;
    let index = -1;
    const result: Array<string> = [];
    const subexit = state.enter('tableRow');

    while (++index < children.length) {
      // 注意：这里使用的位置信息是不正确的。
      // 由于单元格对齐的原因，使其正确是不可能的。
      // 并且需要将 `markdown-table` 复制到这个项目中。
      result[index] = handleTableCell(children[index], node, state, info);
    }

    subexit();

    return result;
  }

  /**
   * 处理内联代码节点，在表格单元格内转义竖线。
   *
   * @param {InlineCode} node - 内联代码节点。
   * @param {Parents | undefined} parent - 父节点。
   * @param {State} state - 转换状态。
   * @returns {string} - 处理后的内联代码字符串。
   */
  function inlineCodeWithTable(node: InlineCode, parent: Parents | undefined, state: State): string {
    let value = handle.inlineCode(node, parent, state);

    if (state.stack.includes('tableCell')) {
      value = value.replace(/\|/g, '\\$&');
    }

    return value;
  }
}
