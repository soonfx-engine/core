import { VariableValue } from "../models/VariableValue";

/**
 * 运算层数据类，用于存储运算层的主体数据和视图信息
 * @class OperationLayerData
 */
export class OperationLayerData {
  /** 主体数据对象 */
  body: VariableValue;

  /** 视图对象 */
  view: any = null;

  /**
   * 创建运算层数据实例
   * @param body - 主体数据对象
   */
  constructor(body: VariableValue) {
    this.body = body.copy();
  }
}
