// ==================== 类型定义 ====================

/**
 * 唯一信息项接口
 */
interface UniqueInfoItem {
  row: number;
  col: number;
  value?: number | string;
}

/**
 * 表格信息接口
 */
interface SheetInfo {
  name: string | number;
  uniqueInfo?: UniqueInfoItem[];
  data?: Map<string, CellOutput>;
}

/**
 * 单元格输出接口
 */
interface CellOutput {
  cellData?: {
    v?: number | string;
    type?: string;
    f?: string;
    getValue?: (sheets: SheetInfo[]) => number | string;
  };
  source?: {
    getValue?: () => number | string;
  };
}

/**
 * 原始数据接口
 */
interface OriginData {
  sheets?: SheetInfo[];
  [key: string]: unknown;
}

/**
 * 表格数据类，用于处理和管理表格数据
 * 支持数据的设置、获取和单元格值的计算
 */
export class SheetData {
  /** 原始数据对象 */
  originData: OriginData | null;

  /**
   * 创建表格数据实例
   * @param data - 原始数据对象
   */
  constructor(data: OriginData | null = null) {
    this.originData = data;
  }

  /**
   * 设置表格数据
   * @param data - 新的数据对象
   */
  setData(data: OriginData | null): void {
    this.originData = data;
  }

  /**
   * 获取单元格的值
   * 根据唯一信息定位到特定单元格并返回其值
   * 支持普通值、函数和公式的计算
   * @param name - 表格名称
   * @param row - 行号
   * @param col - 列号
   * @returns 返回单元格的值，如果无法获取则返回 0
   */
  getValue(name: string | number, row: number, col: number): number {
    if (
      !this?.originData ||
      typeof name === "undefined" ||
      typeof row === "undefined" ||
      typeof col === "undefined"
    ) {
      return 0;
    }

    const data = this.originData;
    const sheets = data.sheets;
    if (!Array.isArray(sheets)) {
      return 0;
    }

    const uniqueSheet = sheets.find((sheet: SheetInfo) => sheet.name === name);
    if (!uniqueSheet || !Array.isArray(uniqueSheet.uniqueInfo)) {
      return 0;
    }

    const selectedUniqueInfo = uniqueSheet.uniqueInfo.find(
      (item: UniqueInfoItem) => item.row === row && item.col === col
    );
    const outVal = uniqueSheet?.data?.get(`${row},${col}`);
    const cellData = outVal?.cellData;
    // 如果是函数
    let outputVal: number | string | undefined = cellData?.v;
    if (cellData?.type)
      outputVal = outVal?.source?.getValue ? outVal.source?.getValue() : 0;
    
    const finalValue = selectedUniqueInfo?.value ?? outputVal ?? 0;
    return typeof finalValue === 'number' ? finalValue : Number(finalValue) || 0;
  }
}
