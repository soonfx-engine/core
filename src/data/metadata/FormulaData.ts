
import { EventManager as Eve } from "../../core/events/EventManager";
import { getCatchValue } from "../../utils/index";
import { fx } from "../../core/system/System";
import { BasicBody } from "../models/BasicBody";

/**
 * 公式数据类，用于存储和管理公式相关信息
 * 
 * @class FormulaData
 * @description 表示一个公式对象，包含名称、位置、主体数据等属性，并自动注册到系统缓存中
 */
export class FormulaData {
  /** 公式的名称 */
  name: string | undefined;

  /** 公式的 X 坐标位置 */
  x: number | undefined;

  /** 公式的 Y 坐标位置 */
  y: number | undefined;

  /** 公式的主体数据对象 */
  body: BasicBody | null = null;

  /** 公式的类型标识，固定为 "Formula" */
  type: string = "Formula";

  /** 缓存目标存储池，用于存储公式实例 */
  cacheTargetStoragePool: any[] = null as any;

  /** 缓存目标文件夹，用于组织公式实例 */
  cacheTargetFolder: any[] = null as any;

  /** 构造器名称，用于标识类名 */
  constructorName: string = "FormulaData";

  /** 公式的唯一标识符 */
  id: number = 0;

  /**
   * 创建公式数据实例
   * 
   * @constructor
   * @param {string} name - 公式名称
   * @param {number} x - X 坐标位置
   * @param {number} y - Y 坐标位置
   * @description 初始化公式对象，自动注册到系统缓存中并分配唯一ID
   */
  constructor(name: string, x: number, y: number) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.cacheTargetStoragePool = fx.targetStoragePool;
    this.cacheTargetFolder = (fx.targetFolder as any).formulaTree;
    this.cacheTargetStoragePool.push(this);
    this.cacheTargetFolder.push(this);
    this.id = ++Eve.IDINDEX;
  }

  /**
   * 获取公式的当前值
   * 
   * @method getValue
   * @returns {number} 公式的数值结果，如果主体为空则返回 0
   * @description 通过主体对象计算并返回公式的值，使用缓存值获取函数
   */
  getValue(): number {
    if (this.body != null) {
      return getCatchValue(this.body);
    }
    return 0;
  }

  /**
   * 销毁公式实例并清理缓存
   * 
   * @method dispose
   * @returns {void}
   * @description 从存储池和文件夹中移除当前公式实例，执行浅度销毁操作
   */
  dispose(): void {
    let _index = this.cacheTargetStoragePool.indexOf(this);
    if (_index >= 0) this.cacheTargetStoragePool.splice(_index, 1);
    _index = this.cacheTargetFolder.indexOf(this);
    this.cacheTargetFolder.splice(_index, 1);
  }
}
// import { fx } from "../aextends/System";
// import { EventManager as Eve } from "../../core/events/EventManager";
// export class FormulaData {
//   // 名称
//   name;

//   // X 坐标
//   x;

//   // Y 坐标
//   y;

//   // 主体
//   body = null;

//   // 类型
//   type = "Formula";

//   // 缓存目标存储池
//   cacheTargetStoragePool = null;

//   // 缓存目标文件夹
//   cacheTargetFolder = null;

//   // 构造器名称
//   constructorName = "FormulaData";
//   id = 0;
//   constructor(name, x, y) {
//     this.name = name;
//     this.x = x;
//     this.y = y;
//     this.cacheTargetStoragePool = fx.targetStoragePool;
//     this.cacheTargetFolder = fx.targetFolder.formulaTree;
//     this.cacheTargetStoragePool.push(this);
//     this.cacheTargetFolder.push(this);
//     this.id = ++Eve.IDINDEX;
//   }

//   getValue() {
//     if (this.body != null) {
//       return this.body.getValue();
//     }
//     return 0;
//   }

//   dispose() {
//     this.cacheTargetStoragePool.splice(
//       this.cacheTargetStoragePool.indexOf(this),
//       1
//     );
//     this.cacheTargetFolder.splice(this.cacheTargetFolder.indexOf(this), 1);
//   }
// }
