
import { EventManager as Eve } from "../../core/events/EventManager";
import { fx } from "../../core/system/System";
import { VariableValue } from "../models/VariableValue";
import { OperationLayerData } from "./OperationLayerData";

/**
 * 图表图层类，用于管理图表相关的运算层和元数据
 * @class ChartsLayer
 */
export class ChartsLayer {
  /** 图层名称 */
  name: string | undefined;

  /** 运算层对象数组 */
  operationArray: OperationLayerData[] = [];

  /** 元数据对象 */
  metadata: VariableValue | null = null;
  /** 元数据数组 */
  metadataArray: VariableValue[] = [];

  /** 初始单位值 */
  minValue: number = 1;

  /** 最大行数值 */
  maxValue: number = 1;

  /** 间隔行数值 */
  intervalValue: number = 1;

  /** 构造函数名称 */
  constructorName: string = "ChartsLayer";
  /** 唯一标识符 */
  id: number;

  /**
   * 创建图表图层实例
   * @param name - 图层名称
   */
  constructor(name: string) {
    // 设置名称
    this.name = name;
    // ID
    this.id = ++Eve.IDINDEX;
  }

  /**
   * 添加元数据
   * 从当前点击的对象中复制元数据并设置到元数据数组中
   */
  addMetadataData(): void {
    if (fx.clickBody != null) {
      this.metadata = (fx.clickBody as any).copy();
      // this.metadataArray.push(this.metadata);
      this.metadataArray[0] = this.metadata as VariableValue;
    }
  }

  /**
   * 释放资源，清理图层数据
   */
  dispose(): void { }
}
// export class ChartsLayer {
//   //名称
//   name;

//   //运算层对象
//   operationArray = [];

//   //元数值
//   metadata = null;
//   metadataArray = [];

//   //初始单位
//   minValue = 1;

//   //最大行数
//   maxValue = 1;

//   //间隔行数
//   intervalValue = 1;

//   // Constructor name
//   constructorName = "ChartsLayer";

//   constructor(name) {
//     // Set the name
//     this.name = name;
//     // ID
//     this.id = ++Eve.IDINDEX;
//   }

//   addMetadataData() {
//     if (fx.clickBody != null) {
//       this.metadata = fx.clickBody.copy();
//       // this.metadataArray.push(this.metadata);
//       this.metadataArray[0] = this.metadata;
//     }
//   }
//   dispose() {}
// }
