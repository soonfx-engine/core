import { VariableValue } from "../models/VariableValue";

/**
 * 元数据类，用于存储和管理元数据信息
 * 
 * @class MetadataData
 * @description 表示一个元数据对象，包含主体数据、视图、数值范围等属性
 */
export class MetadataData {
  /** 元数据的主体对象 */
  body: VariableValue;

  /** 元数据关联的视图对象 */
  view: any = null;

  /** 元数据的类型标识 */
  type: number = 0;

  /** 元数据的当前值 */
  presentValue: number = 0;

  /** 元数据的最小值 */
  minValue: number = 0;

  /** 元数据的最大值 */
  maxValue: number = 0;

  /** 元数据的间隔值 */
  intervalValue: number = 0;

  /** 元数据的列表数据 */
  list: any[] = [];

  /**
   * 创建元数据实例
   * 
   * @constructor
   * @param {VariableValue} body - 主体数据对象
   * @description 初始化元数据对象，复制主体数据作为副本
   */
  constructor(body: VariableValue) {
    this.body = body.copy();
  }
}
// import { fx } from "../aextends/System";
// export class MetadataData {
//   // 主体
//   body;

//   // 视图
//   view = null;

//   // 类型
//   type = 0;

//   // 当前值
//   presentValue = 0;

//   // 最小值
//   minValue = 0;

//   // 最大值
//   maxValue = 0;

//   // 间隔值
//   intervalValue = 0;

//   constructor(body) {
//     this.body = body.copy();
//   }
// }
