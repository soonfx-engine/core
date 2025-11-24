/**
 * 表格数据类，用于处理和管理表格数据
 * 支持数据的设置、获取和单元格值的计算
 */
export class SheetData {
  /** 原始数据对象 */
  originData: any;

  /**
   * 创建表格数据实例
   * @param data - 原始数据对象
   */
  constructor(data: any) {
    this.originData = data;
  }

  /**
   * 设置表格数据
   * @param data - 新的数据对象
   */
  setData(data: any): void {
    this.originData = data;
  }

  /**
   * 获取单元格的值
   * 根据唯一信息定位到特定单元格并返回其值
   * 支持普通值、函数和公式的计算
   * @returns 返回单元格的值，如果无法获取则返回 0
   */
  getValue(name: any, row: any, col: any): number {
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
    const uniqueSheet = sheets.find((sheet) => sheet.name === name);
    const selectedUniqueInfo = uniqueSheet.uniqueInfo.find(
      (item) => item.row === row && item.col === col
    );
    const outVal = uniqueSheet?.data?.get(`${row},${col}`);
    const cellData = outVal?.cellData;
    // 如果是函数
    let outputVal = cellData?.v;
    if (cellData?.type)
      outputVal = outVal?.source?.getValue ? outVal.source?.getValue() : 0;
    return selectedUniqueInfo?.value || outputVal || 0;
  }
}
