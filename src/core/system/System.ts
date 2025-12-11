/**
 * FX 引擎核心系统
 * 版本: 2.0
 * 重构日期: 2024年12月
 */

// 全局类型声明
declare global {
  interface Window {
    target: any;
  }
}

// 初始化全局目标对象
// 环境兼容性处理
const globalThis_: any = (function () {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof window !== "undefined") return window;
  // @ts-ignore
  if (typeof global !== "undefined") return global;
  if (typeof self !== "undefined") return self;
  return {};
})();

globalThis_.target = null;
/**
 * 核心系统导入
 * 导入所有必要的模块和类型定义
 */
import { FXCentre } from "../../game/combat/FXCentre";
import { Folder } from "../../data/storage/Folder";
import { EventManager as Eve } from "../../core/events/EventManager";
import { CallCenter } from "../../communication/messaging/CallCenter";
import { MessageList } from "../../communication/messaging/MessageList";
import { VariableValue } from "../../data/models/VariableValue";
import { Call } from "../../communication/messaging/Call";
import { SymbolBody } from "../../data/models/SymbolBody";
import { BasicBody } from "../../data/models/BasicBody";
import { OperationBody } from "../../data/models/OperationBody";
import { Player } from "../../game/combat/Player";
import { BillboardLayer } from "../../data/layers/BillboardLayer";
import { ChartsLayer } from "../../data/layers/ChartsLayer";
import { Bookmark } from "../../data/metadata/Bookmark";
import { FormulaData } from "../../data/metadata/FormulaData";
import { MetadataData } from "../../data/metadata/MetadataData";
import { SheetData } from "../../data/storage/SheetData";
import { OperationLayerData } from "../../data/layers/OperationLayerData";
import { Message } from "../../communication/messaging/Message";
import { NodeType } from "../../core/types/NodeType";
import { MathUtils } from "../../utils/MathUtils";

/**
 * 测试基类
 * 用于系统测试和验证
 */
class A {
  /**
   * 测试方法
   */
  test(): void {
    try {
      console.log("console A");
    } catch (error) {
      console.error("Error in class A test:", error);
    }
  }
}

/**
 * 测试派生类
 * 继承自类A，用于测试继承功能
 */
class B extends A {
  constructor() {
    super();
  }

  /**
   * 重写测试方法
   */
  test(): void {
    try {
      console.log("console B");
    } catch (error) {
      console.error("Error in class B test:", error);
    }
  }
}

/**
 * FX 引擎核心类
 * 提供游戏引擎的核心功能和系统管理
 */
export class fx {
  /** 测试实例 */
  static b = new B();

  /** 代码执行状态 */
  static code = false;

  // ==================== 数学工具函数 (委托到 MathUtils) ====================

  /**
   * 判断是否为数字
   * @param token 待检查的值
   * @returns 是否为有效数字
   * @see MathUtils.isNumber
   */
  static isNumber = MathUtils.isNumber;

  /**
   * 混合公式 - 线性插值
   * @param v1 起始值
   * @param v2 结束值
   * @param v3 混合系数 (0-1)
   * @returns 混合结果
   * @see MathUtils.mix
   */
  static mix = MathUtils.mix;

  /**
   * 线性插值 (lerp)
   * @see MathUtils.lerp
   */
  static lerp = MathUtils.lerp;

  /**
   * 计算向量的叉积
   * @param p1x 第一个向量的x分量
   * @param p1y 第一个向量的y分量
   * @param p2x 第二个向量的x分量
   * @param p2y 第二个向量的y分量
   * @returns 叉积结果
   * @see MathUtils.cross
   */
  static cross = MathUtils.cross;

  /**
   * 计算向量的点积
   * @param p1x 第一个向量的x分量
   * @param p1y 第一个向量的y分量
   * @param p2x 第二个向量的x分量
   * @param p2y 第二个向量的y分量
   * @returns 点积结果
   * @see MathUtils.dot
   */
  static dot = MathUtils.dot;

  /**
   * 计算两点之间的距离
   * @param p1x 第一个点的x坐标
   * @param p1y 第一个点的y坐标
   * @param p2x 第二个点的x坐标
   * @param p2y 第二个点的y坐标
   * @returns 距离值
   * @see MathUtils.distance
   */
  static distance = MathUtils.distance;

  /**
   * 计算向量的长度
   * @param a x分量
   * @param b y分量
   * @returns 向量长度
   * @see MathUtils.length
   */
  static length = MathUtils.length;

  /**
   * 将值限制在指定范围内
   * @see MathUtils.clamp
   */
  static clamp = MathUtils.clamp;

  /**
   * 向量归一化
   * @see MathUtils.normalize
   */
  static normalize = MathUtils.normalize;

  /**
   * 数学工具模块引用
   * 可直接访问完整的 MathUtils 模块
   */
  static MathUtils = MathUtils;
  // ==================== 系统状态属性 ====================

  /** 看板列表 */
  static billBoardList: any[] = [];

  /** 函数添加索引 */
  static functionAddIndex: number = 0;

  /** 视觉版本兼容性 */
  static visualVersionCompatibility: boolean = false;

  /** 单例实例 */
  static singletonInstance: any = null;

  /** 系统启动状态 */
  static isStart: boolean = false;
  // ==================== 模块引用 ====================

  /** 战斗中心模块 */
  static FXCentre: typeof FXCentre = FXCentre;

  /** 节点类型模块 */
  static NodeType: typeof NodeType = NodeType;

  /** 文件夹模块 */
  static Folder: typeof Folder = Folder;

  /** 事件管理器模块 */
  static Eve: typeof Eve = Eve;

  /** 调用中心模块 */
  static CallCenter: typeof CallCenter = CallCenter;

  /** 消息列表模块 */
  static MessageList: typeof MessageList = MessageList;

  /** 变量值模块 */
  static VariableValue: typeof VariableValue = VariableValue;

  /** 调用模块 */
  static Call: typeof Call = Call;

  /** 符号体模块 */
  static SymbolBody: typeof SymbolBody = SymbolBody;

  /** 基础体模块 */
  static BasicBody: typeof BasicBody = BasicBody;

  /** 运算体模块 */
  static OperationBody: typeof OperationBody = OperationBody;

  /** 玩家模块 */
  static Player: typeof Player = Player;

  /** 看板层模块 */
  static BillboardLayer: typeof BillboardLayer = BillboardLayer;

  /** 图表层模块 */
  static ChartsLayer: typeof ChartsLayer = ChartsLayer;

  /** 书签模块 */
  static Bookmark: typeof Bookmark = Bookmark;

  /** 公式数据模块 */
  static FormulaData: typeof FormulaData = FormulaData;

  /** 元数据模块 */
  static MetadataData: typeof MetadataData = MetadataData;

  /** 表格数据模块 */
  static SheetData: typeof SheetData = SheetData;

  /** 运算层数据模块 */
  static OperationLayerData: typeof OperationLayerData = OperationLayerData;

  /** 消息模块 */
  static Message: typeof Message = Message;

  /** 缓存控制 */
  static noCache: boolean = false;
  // ==================== 游戏状态属性 ====================

  /** 敌对玩家数据 */
  static enemyBody: any = null;

  /** 场景根目录文件夹 */
  static sceneFolder: any = null;

  /** 当前选择文件夹 */
  static targetFolder: any = null;

  /** 文件夹是否有重名 */
  static isFolderDuplicationOfName: boolean = false;

  /** 是否显示看板层 */
  static isBillboardLayerView: boolean = true;

  /** 是否显示运算体视图 */
  static isBodyView: boolean = true;

  /** 是否准备全局运算 */
  static isGlobalOperations: boolean = false;

  /**
   * 是否在拖拽运算体
   * @type {boolean}
   */
  static isDragBody: boolean = false;

  /**
   * 场景遮罩参数
   * @type {{}}
   */
  static stageMaskValue: any = {};

  /**
   * 场景顶级组
   * @type {null}
   */
  static stageGroup: any = null;

  /**
   * 当前点击运算体(场景)
   * @type {null}
   */
  static clickBody: any = null;

  /**
   * 当前选择运算体(场景)
   * @type {null}
   */
  static selectCellBody: any = null;

  /**
   * 当前编辑运算体(文件)
   * @type {null}
   */
  static editBody: any = null;

  /**
   * 当前选择运算体(文件)
   * @type {null}
   */
  static selectBody: any = null;

  /**
   * 场景显示存储池
   * @type {*[]}
   */
  static stageStoragePool: any[] = [];

  /**
   * 当前选择存储池
   * @type {*[]}
   */
  static targetStoragePool: any[] = fx.stageStoragePool;

  /**
   * 玩家实例对象
   * @type {null}
   */
  static player: any = null;

  /**
   * 是否发生了暴击
   * @type {boolean}
   */
  static isCrit: boolean = false;
  // constructor() { }

  // calculateArea() {
  //   return this.width * this.height;
  // }

  // calculatePerimeter() {
  //   return 2 * (this.width + this.height);
  // }

  /**
   *
   * @param 总数
   * @param 权重数组
   * @returns {*}
   */
  static distribute = function (total: number, weights: number[]): number[] {
    const sumOfWeights = weights.reduce((acc, val) => acc + val, 0);
    return weights.map((weight) => (total * weight) / sumOfWeights);
  };

  /**
   *
   * @param 总数
   * @param 切割数
   * @param 指数
   * @param 取整类型
   * @param 低指数
   * @param 高指数
   * @returns {[]}
   */
  static partitionCurve = function (
    totalConsumption: number,
    segmentCount: number,
    exponent: number,
    type: number | null,
    vlowerLimitRatio: number | null,
    vupperLimitRatio: number | null
  ): number[] {
    const ratioData: number[] = [];
    const outputData: number[] = [];
    let lowerLimitRatio = vlowerLimitRatio;
    let upperLimitRatio = vupperLimitRatio;
    if (lowerLimitRatio == null) {
      lowerLimitRatio = 0.382;
    }
    if (upperLimitRatio == null) {
      upperLimitRatio = 0.618;
    }
    let cumulativeConsumption = 0;
    for (let i = 1; i <= segmentCount; i++) {
      const maxLevel = Math.pow(segmentCount, exponent);
      const currentLevel = Math.pow(i, exponent);
      const incrementalRatio = currentLevel / maxLevel;
      const consumptionValue =
        (i * (10000 * lowerLimitRatio)) / segmentCount +
        incrementalRatio * (10000 * upperLimitRatio);
      ratioData.push(consumptionValue);
      cumulativeConsumption += consumptionValue;
    }
    for (let j = 0; j < ratioData.length; j++) {
      if (type == null) {
        outputData.push(
          (ratioData[j] / cumulativeConsumption) * totalConsumption
        );
      } else {
        switch (type) {
          case 0:
            outputData.push(
              (ratioData[j] / cumulativeConsumption) * totalConsumption
            );
            break;
          case 1:
            outputData.push(
              Math.floor(
                (ratioData[j] / cumulativeConsumption) * totalConsumption
              )
            );
            break;
          case 2:
            outputData.push(
              Math.floor(
                (ratioData[j] / cumulativeConsumption) * totalConsumption
              )
            );
            break;
        }
      }
    }
    return outputData;
  };

  static eval = function (str: string): any {
    return fx.evaluateExpression(str);
  };

  static recursionLibraryBody = function (
    array: any[],
    folder: any,
    address: string
  ): any {
    if (folder.tree == null) return null;
    for (let i = 0; i < folder.tree.length; i++) {
      if (folder.tree[i].absoluteAddress == address) {
        array.push(folder.tree[i]);
        return;
      }
      fx.recursionLibraryBody(array, folder.tree[i], address);
    }
    return null;
  };

  /**
   * 范围小数点后面几位
   * @param	value
   * @param	type
   * @return
   */
  static double = function (value: number, type: number): number {
    switch (type) {
      case 0:
        return Math.round(value * 1) / 1;
      case 1:
        return Math.round(value * 10) / 10;
      case 2:
        return Math.round(value * 100) / 100;
      case 3:
        return Math.round(value * 1000) / 1000;
      case 4:
        return Math.round(value * 10000) / 10000;
      case 5:
        return Math.round(value * 100000) / 100000;
      case 6:
        return Math.round(value * 1000000) / 1000000;
      case 7:
        return Math.round(value * 10000000) / 10000000;
    }
    return 0;
  };

  /**
   * 从库中获取元素
   * @param library
   * @param array
   * @param address
   */
  static getLibraryBody = function (
    library: any[],
    array: any[],
    address: string
  ): void {
    for (let i = 0; i < array.length; i++) {
      if (array[i].absoluteAddress == null) {
        array[i].absoluteAddress = fx.getAbsoluteAddress(array[i]);
      }

      if (array[i].absoluteAddress == address) {
        library.push(array[i]);
        return;
      }
      if (array[i].isFolder) {
        fx.getLibraryBody(library, array[i].tree, address);
      }
    }
  };

  static mapToJSON = function (map: Map<any, any>): string {
    if (!map) return "{}";
    return JSON.stringify(
      [...map].reduce((obj, [key, value]) => {
        const newValue = { ...value };
        const bodyTreeItem = newValue.source;
        if (bodyTreeItem) {
          const treeData = fx.createVarData(
            bodyTreeItem.TID,
            bodyTreeItem.name,
            bodyTreeItem.value,
            bodyTreeItem.type,
            bodyTreeItem.macros,
            bodyTreeItem.operator,
            bodyTreeItem.enemyFlag,
            bodyTreeItem.source,
            bodyTreeItem.tag,
            bodyTreeItem.statistics,
            bodyTreeItem.upDateValue,
            bodyTreeItem.demoteValue,
            bodyTreeItem.funcType,
            // 逻辑块数据
            bodyTreeItem.isLogicalOpen,
            bodyTreeItem.isDragging,
            bodyTreeItem.currentStep,
            bodyTreeItem.snNo,
            bodyTreeItem.minValue,
            bodyTreeItem.maxValue,
            bodyTreeItem.step,
            bodyTreeItem.logicalChildArray,
            bodyTreeItem.selectedOutputInfo
          );
          newValue.source = treeData;
        }
        obj[key] = newValue;
        return obj;
      }, {})
    );
  };

  /**
   * 递归添加库元素
   * @param saveArray
   * @param bodyArray
   */
  static addLibraryBody = function (saveArray: any[], bodyArray: any[]): void {
    for (let i = 0; i < bodyArray.length; i++) {
      const bodyItem = bodyArray[i];
      let newOriginData = bodyItem.sheetData?.originData;
      if (newOriginData) {
        newOriginData = { ...newOriginData };
        newOriginData.sheets = [
          ...newOriginData.sheets.map((item2) => {
            return { ...item2, data: fx.mapToJSON(item2.data) };
          }),
        ];
      }
      if (bodyItem instanceof fx.VariableValue) {
        var bodyData = fx.createOperationLayerData(
          bodyItem.name,
          bodyItem.type,
          bodyItem.value,
          bodyItem,
          bodyItem.tag,
          bodyItem.isSystemShow,
          bodyItem.sheetData ? JSON.stringify(newOriginData) : null,
          bodyItem.childCell
        );
        bodyData.id = bodyItem.id;
        saveArray.push(bodyData);
        fx.saveBody(
          bodyData.operationArray,
          fx.seekSource(bodyItem.childBodyArray)
        );
      }
      if (bodyItem instanceof fx.Folder) {
        var bodyData = fx.createFolderData(
          bodyItem.name,
          bodyItem.isFolder,
          bodyItem
        );

        bodyData.id = bodyItem.id;
        saveArray.push(bodyData);
        fx.addLibraryBody(bodyData.operationArray, bodyItem.tree);
      }

      if (fx.isBillboardLayerView) {
        if (bodyItem instanceof fx.BillboardLayer) {
          var bodyData = fx.createBillboarData(
            bodyItem.name,
            bodyItem,
            bodyItem.monitored
          );
          bodyData.id = bodyItem.id;
          saveArray.push(bodyData);
          for (var j = 0; j < bodyItem.operationArray.length; j++) {
            const bodyItemOperation = bodyItem.operationArray[j];
            const operationData = fx.createOperationLayerData(
              bodyItemOperation.body.name,
              bodyItemOperation.body.type,
              bodyItemOperation.body.value,
              bodyItemOperation.body.source,
              bodyItemOperation.body.tag,
              bodyItemOperation.body.isSystemShow,
              null,
              null
            );
            operationData.id = bodyItemOperation.body.id;
            bodyData.operationArray.push(operationData);
          }
          for (var j = 0; j < bodyItem.metadataArray.length; j++) {
            const bodyItemMetadata = bodyItem.metadataArray[j];
            const metadata = fx.createBillboarMetadataData(
              bodyItemMetadata.body.name,
              bodyItemMetadata.body.type,
              bodyItemMetadata.body.value,
              bodyItemMetadata.body.source,
              bodyItemMetadata
            );
            metadata.id = bodyItemMetadata.body.id;
            bodyData.metadataArray.push(metadata);
          }
        }
        if (bodyItem instanceof fx.ChartsLayer) {
          var bodyData = fx.createChartData(bodyItem);
          bodyData.id = bodyItem.id;
          saveArray.push(bodyData);
        }
      }
    }
  };

  /**
   * 解析运算层库内容
   * @param data
   * @param init
   */
  static parseLibraryBody = function (data: any[], init: boolean): void {
    for (let i = 0; i < data.length; i++) {
      const dataItem = data[i];
      if (dataItem.type == NodeType.CalculationLayer) {
        var bodyArray = [];
        fx.getLibraryBody(bodyArray, fx.targetFolder.tree, dataItem.site);
        fx.editBody = bodyArray[0];
        fx.selectBody = fx.editBody;

        fx.targetStoragePool = fx.editBody.childBodyArray;
        fx.editBody.isSystemShow = dataItem.isSystemShow;
        fx.parseStageBody(dataItem.operationArray);
      } else if (
        dataItem.type == 0 ||
        dataItem.type == NodeType.Variable ||
        dataItem.type == 2 ||
        dataItem.type == 3
      ) {
        var bodyArray = [];
        fx.getLibraryBody(bodyArray, fx.targetFolder.tree, dataItem.site);
        fx.editBody = bodyArray[0];
        fx.selectBody = fx.editBody;
        fx.targetStoragePool = fx.stageStoragePool;
        fx.parseStageBody(dataItem.operationArray);
      } else if (dataItem.isFile == true) {
        var bodyArray = [];
        fx.getLibraryBody(bodyArray, fx.targetFolder.tree, dataItem.site);
        fx.editBody = bodyArray[0];
        const parent = bodyArray[0];
        for (let j = 0; j < dataItem.operationArray.length; j++) {
          const dataItemOperation = dataItem.operationArray[j];
          if (dataItemOperation.type == NodeType.CalculationLayer) {
            var bodyArray = [];
            fx.getLibraryBody(
              bodyArray,
              fx.targetFolder.tree,
              dataItemOperation.site
            );
            fx.editBody = bodyArray[0];
            fx.selectBody = bodyArray[0];
            fx.targetStoragePool = (bodyArray[0] as any).childBodyArray;
            fx.parseStageBody(dataItemOperation.operationArray);
            fx.editBody = parent;
            fx.editBody.isSystemShow = dataItemOperation.isSystemShow;
          } else if (dataItemOperation.isBoard == true) {
            fx.selectBody = fx.editBody;
            dataItemOperation.index = j;
            fx.Call.send(fx.Eve.SHIFT_ADD_BOARD, dataItemOperation, null);
          } else if (dataItemOperation.isXlsx == true) {
            fx.selectBody = fx.editBody;
            dataItemOperation.index = j;
            fx.Call.send(fx.Eve.SHIFT_ADD_CHARTS, dataItemOperation, null);
          }
          if (dataItemOperation.isFile == true) {
            var bodyArray = [];
            fx.getLibraryBody(
              bodyArray,
              fx.targetFolder.tree,
              dataItemOperation.site
            );
            fx.editBody = bodyArray[0];
            fx.parseLibraryBody(dataItemOperation.operationArray, false);
          }
        }
        fx.editBody = null;
      } else if (dataItem.isBoard == true) {
        fx.selectBody = fx.editBody;
        fx.billBoardList.push(dataItem);
        fx.Call.send(fx.Eve.SHIFT_ADD_BOARD, dataItem, null);
      } else if (dataItem.isXlsx == true) {
        fx.selectBody = fx.editBody;
        fx.Call.send(fx.Eve.SHIFT_ADD_CHARTS, dataItem, null);
      }

      if (init) {
        fx.selectBody = null;
      }
    }
  };

  /**
   * 创建运算体库
   * @param data
   * @param init
   */
  static createLibraryBody = function (
    data: any[],
    init: boolean,
    isAI?: boolean,
    parent?: any
  ): void {
    for (let i = 0; i < data.length; i++) {
      const dataItem = data[i];
      if (dataItem.isFile == true) {
        var folder = new fx.Folder(dataItem.name);
        fx.Call.send(fx.Eve.CREATE_FILE_DATA, folder, null);
        if (parent != null) {
          fx.Call.send(fx.Eve.ADD_DATABASE_DATA, [folder, parent], null);
          fx.Call.send(
            fx.Eve.SHIFT_REFRESH_LIBRARY_COORDINATES,
            [folder, parent],
            null
          );
        } else {
          fx.Call.send(fx.Eve.ADD_DATABASE_DATA, [folder, fx.selectBody], null);
          fx.Call.send(
            fx.Eve.SHIFT_REFRESH_LIBRARY_COORDINATES,
            [folder, fx.selectBody],
            null
          );
        }

        fx.selectBody = folder;
        fx.selectBody.absoluteAddress = dataItem.site;
        for (let j = 0; j < dataItem.operationArray.length; j++) {
          const dataItemOperation = dataItem.operationArray[j];
          if (dataItemOperation.type == NodeType.CalculationLayer) {
            fx.editBody = new fx.VariableValue(dataItemOperation.name, null, 5);
            fx.editBody.tag = dataItemOperation.name.tag;
            fx.Call.send(fx.Eve.CREATE_OPERATION_DATA, fx.editBody, null);
            fx.Call.send(
              fx.Eve.ADD_DATABASE_DATA,
              [fx.editBody, fx.selectBody],
              null
            );
            fx.Call.send(
              fx.Eve.SHIFT_REFRESH_LIBRARY_COORDINATES,
              [fx.editBody, fx.selectBody],
              null
            );

            fx.editBody.absoluteAddress = dataItemOperation.site;
            fx.targetStoragePool = fx.editBody.childBodyArray;
          } else if (
            dataItemOperation.type == 0 ||
            dataItemOperation.type == NodeType.Variable ||
            dataItemOperation.type == 2 ||
            dataItemOperation.type == 3
          ) {
            var name: string =
              dataItemOperation.name + "=" + dataItemOperation.value;
            var variableValue = new fx.VariableValue(
              name.split("=")[0],
              name.split("=")[1],
              1
            );
            if (dataItemOperation.type == NodeType.Variable)
              variableValue.isAI = isAI || false;
            fx.editBody = variableValue;
            fx.editBody.tag = dataItemOperation.tag;
            fx.Call.send(fx.Eve.CREATE_METADATE_DATA, variableValue, null);
            fx.Call.send(
              fx.Eve.ADD_DATABASE_DATA,
              [fx.editBody, fx.selectBody],
              null
            );
            fx.Call.send(
              fx.Eve.SHIFT_REFRESH_LIBRARY_COORDINATES,
              [fx.editBody, fx.selectBody],
              null
            );

            fx.editBody.absoluteAddress = dataItemOperation.site;
            fx.targetStoragePool = fx.editBody.childBodyArray;
          } else if (dataItemOperation.type == NodeType.Sheet) {
            var name: string = dataItemOperation.name;
            var variableValue = new fx.VariableValue(
              name.split("=")[0],
              undefined,
              dataItemOperation.type
            );
            variableValue.selectedOutputInfo =
              dataItemOperation?.selectedOutputInfo
                ? JSON.parse(dataItemOperation?.selectedOutputInfo)
                : null;
            const parsedData =
              typeof dataItemOperation.sheetData === "string"
                ? JSON.parse(dataItemOperation.sheetData)
                : dataItemOperation.sheetData;
            if (parsedData?.sheets) {
              parsedData.sheets = parsedData.sheets.map((sheet) => {
                const data = JSON.parse(sheet.data);
                Object.values(data).forEach((item: any) => {
                  if (item?.source) {
                    const dataTreeItem = item.source;
                    const bodyArray = [];
                    fx.getLibraryBody(
                      bodyArray,
                      fx.targetFolder.tree,
                      fx.getAbsoluteAddress(dataTreeItem)
                    );
                    const bodydataVar = bodyArray[0] as any;
                    item.source = bodydataVar.copy();
                  }
                });
                return {
                  ...sheet,
                  data: new Map(Object.entries(data)),
                };
              });
            }
            variableValue.setSheetData(parsedData);
            (variableValue as any).childCell = dataItemOperation.childCell;
            fx.editBody = variableValue;
            fx.editBody.tag = dataItemOperation.tag;
            fx.Call.send(
              fx.Eve.ADD_DATABASE_DATA,
              [fx.editBody, fx.selectBody],
              null
            );
            fx.Call.send(
              fx.Eve.SHIFT_REFRESH_LIBRARY_COORDINATES,
              [fx.editBody, fx.selectBody],
              null
            );

            fx.editBody.absoluteAddress = dataItemOperation.site;
            fx.targetStoragePool = fx.editBody.childBodyArray;
          }

          if (dataItemOperation.isFile == true) {
            var folder = new fx.Folder(dataItemOperation.name);
            fx.Call.send(fx.Eve.CREATE_FILE_DATA, folder, null);
            fx.Call.send(
              fx.Eve.ADD_DATABASE_DATA,
              [folder, fx.selectBody],
              null
            );
            fx.Call.send(
              fx.Eve.SHIFT_REFRESH_LIBRARY_COORDINATES,
              [folder, fx.selectBody],
              null
            );
            fx.selectBody = folder;
            fx.selectBody.absoluteAddress = dataItemOperation.site;
            fx.createLibraryBody(
              dataItemOperation.operationArray,
              false,
              false,
              folder
            );
            fx.selectBody = (folder as any).parentFolder;
          }
        }
        fx.selectBody = (folder as any).parentFolder;
      }
      if (dataItem.type == NodeType.CalculationLayer) {
        fx.editBody = new fx.VariableValue(dataItem.name, null, 5);
        fx.editBody.tag = dataItem.tag;
        fx.editBody.isSystemShow = dataItem.isSystemShow;
        fx.Call.send(fx.Eve.CREATE_OPERATION_DATA, fx.editBody, null);
        fx.Call.send(
          fx.Eve.ADD_DATABASE_DATA,
          [fx.editBody, fx.selectBody],
          null
        );
        fx.Call.send(
          fx.Eve.SHIFT_REFRESH_LIBRARY_COORDINATES,
          [fx.editBody, fx.selectBody],
          null
        );

        fx.editBody.absoluteAddress = dataItem.site;
        fx.targetStoragePool = fx.editBody.childBodyArray;
      } else if (
        dataItem.type == 0 ||
        dataItem.type == NodeType.Variable ||
        dataItem.type == 2 ||
        dataItem.type == 3
      ) {
        var name: string = dataItem.name + "=" + dataItem.value;
        var variableValue = new fx.VariableValue(
          name.split("=")[0],
          name.split("=")[1],
          1
        );
        if (dataItem.type == NodeType.Variable)
          variableValue.isAI = isAI || false;
        fx.editBody = variableValue;
        fx.editBody.tag = dataItem.tag;
        fx.Call.send(fx.Eve.CREATE_METADATE_DATA, variableValue, null);
        fx.Call.send(
          fx.Eve.ADD_DATABASE_DATA,
          [fx.editBody, fx.selectBody],
          null
        );
        fx.Call.send(
          fx.Eve.SHIFT_REFRESH_LIBRARY_COORDINATES,
          [fx.editBody, fx.selectBody],
          null
        );

        fx.editBody.absoluteAddress = dataItem.site;
        fx.targetStoragePool = fx.editBody.childBodyArray;
      } else if (dataItem.type == NodeType.Sheet) {
        var name: string = dataItem.name;
        var variableValue = new fx.VariableValue(
          name.split("=")[0],
          undefined,
          dataItem.type
        );
        variableValue.selectedOutputInfo = dataItem?.selectedOutputInfo
          ? JSON.parse(dataItem?.selectedOutputInfo)
          : null;
        const parsedData =
          typeof dataItem.sheetData === "string"
            ? JSON.parse(dataItem.sheetData)
            : dataItem.sheetData;
        if (parsedData?.sheets) {
          parsedData.sheets = parsedData.sheets.map((sheet) => {
            const data = JSON.parse(sheet.data);
            Object.values(data).forEach((item: any) => {
              if (item?.source) {
                const dataTreeItem = item.source;
                const bodyArray = [];
                fx.getLibraryBody(
                  bodyArray,
                  fx.targetFolder.tree,
                  fx.getAbsoluteAddress(dataTreeItem)
                );
                const bodydataVar = bodyArray[0] as any;
                item.source = bodydataVar.copy();
              }
            });
            return {
              ...sheet,
              data: new Map(Object.entries(data)),
            };
          });
        }
        variableValue.setSheetData(parsedData);
        (variableValue as any).childCell = dataItem.childCell;
        fx.editBody = variableValue;
        fx.editBody.tag = dataItem.tag;
        fx.Call.send(
          fx.Eve.ADD_DATABASE_DATA,
          [fx.editBody, fx.selectBody],
          null
        );
        fx.Call.send(
          fx.Eve.SHIFT_REFRESH_LIBRARY_COORDINATES,
          [fx.editBody, fx.selectBody],
          null
        );

        fx.editBody.absoluteAddress = dataItem.site;
        fx.targetStoragePool = fx.editBody.childBodyArray;
      }

      if (init) {
        fx.selectBody = null;
      }
    }
  };

  /**
   * 获取元素
   * @param folder
   * @param address
   * @returns {*}
   */
  static getBody = function (folder: any, address: string, valuec?: any): any {
    const array = [];
    fx.recursionLibraryBody(array, folder, address);
    if (valuec != null) {
      (array[0] as any).body.setFunctionId(valuec);
    }
    return array[0];
  };

  static evaluateExpression = function (expression: string): any {
    // 将自然表达式转换为逆波兰表达式
    const rpn = fx.toRPN(expression);

    // 定义一个栈用于计算逆波兰表达式
    const stack: any[] = [];

    // 遍历逆波兰表达式
    for (const token of rpn) {
      if (fx.isNumber(token)) {
        // 如果是数字，则直接入栈
        stack.push(Number(token));
      } else {
        // 如果是运算符，则从栈中弹出两个操作数进行运算，并将结果入栈
        const operand2 = stack.pop();
        const operand1 = stack.pop();
        let result: any;

        if (operand1 !== undefined && operand2 !== undefined) {
          switch (token) {
            case "+":
              result = operand1 + operand2;
              break;
            case "-":
              result = operand1 - operand2;
              break;
            case "*":
              result = operand1 * operand2;
              break;
            case "/":
              result = operand1 / operand2;
              break;
            case "%":
              result = operand1 % operand2;
              break;
            case "^":
              result = Math.pow(operand1, operand2);
              break;
            case ">":
              result = operand1 > operand2;
              break;
            case "<":
              result = operand1 < operand2;
              break;
            case ">=":
              result = operand1 >= operand2;
              break;
            case "<=":
              result = operand1 <= operand2;
              break;
            case "==":
              result = operand1 === operand2;
              break;
            case "!=":
              result = operand1 !== operand2;
              break;
          }
        }

        // 将运算结果入栈
        stack.push(result);
      }
    }

    // 返回最终结果
    return stack.pop();
  };

  // 将自然表达式转换为逆波兰表达式
  static toRPN = function (expression: string): string[] {
    // 去掉空格expression，制表符，换行符
    expression = expression + "";
    expression = expression.replace(/\s+/g, "");
    const operators = {
      "+": 1,
      "-": 1,
      "*": 2,
      "/": 2,
      "%": 2,
      "^": 3,
      ">": 4,
      "<": 4,
      ">=": 4,
      "<=": 4,
      "==": 4,
      "!=": 4,
    };

    const output: any[] = [];
    const stack: any[] = [];

    // 添加符号到输出队列
    function addToOutput(token: string) {
      output.push(token);
    }

    // 弹出栈顶符号到输出队列
    function popFromStack() {
      const operator = stack.pop();

      if (operator) {
        addToOutput(operator);
      }
    }

    // 判断是否为运算符
    function isOperator(token: string) {
      return operators.hasOwnProperty(token);
    }

    // 判断是否为负数
    function isNegativeNumber(token: string, index: number) {
      if (token === "-" && index === 0) {
        return true;
      }

      if (
        token === "-" &&
        !fx.isNumber(expression[index - 1]) &&
        expression[index - 1] !== ")"
      ) {
        return true;
      }

      return false;
    }

    // 遍历表达式
    for (let i = 0; i < expression.length; i++) {
      const token = expression[i];

      if (fx.isNumber(token) || isNegativeNumber(token, i)) {
        // 如果是数字或者负数，则添加到输出队列
        let num = token;
        let j = i + 1;

        while (
          j < expression.length &&
          (fx.isNumber(expression[j]) || expression[j] === ".")
        ) {
          num += expression[j];
          j++;
        }

        addToOutput(num);
        i = j - 1;
      } else if (isOperator(token)) {
        // 如果是运算符
        var topOfStack = stack[stack.length - 1];

        while (
          isOperator(topOfStack) &&
          ((operators[token] <= operators[topOfStack] && token !== "^") ||
            (operators[token] < operators[topOfStack] && token === "^"))
        ) {
          popFromStack();
          topOfStack = stack[stack.length - 1];
        }

        stack.push(token);
      } else if (token === "(") {
        // 如果是左括号，则直接入栈
        stack.push(token);
      } else if (token === ")") {
        // 如果是右括号，则弹出栈顶符号到输出队列，直到遇到左括号
        var topOfStack = stack[stack.length - 1];

        while (topOfStack !== "(" && topOfStack !== undefined) {
          popFromStack();
          topOfStack = stack[stack.length - 1];
        }

        stack.pop(); // 弹出左括号
      }
    }

    // 将剩余的符号弹出栈到输出队列
    while (stack.length > 0) {
      popFromStack();
    }

    return output;
  };

  static Rectangle = class Rectangle {
    width: number;
    height: number;

    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
    }

    calculateArea() {
      return this.width * this.height;
    }

    calculatePerimeter() {
      return 2 * (this.width + this.height);
    }
  };

  /**
   * 递归同步运算体
   * @param 数组
   */
  static recursionSyncBody = function (body: any[]): void {
    for (let i = 0; i < body.length; i++) {
      if (body[i].type == NodeType.CalculationLayer) {
        body[i].syncBody();
      }
      if (body[i].isFolder) {
        fx.recursionSyncBody(body[i].tree);
      }
    }
  };

  /**
   * 清理运算缓存
   */
  static clearCache = function (): void {
    fx.clearCacheRecursion(fx.sceneFolder);
  };

  /**
   * 递归清理缓存
   * @param data
   * @param init
   */
  static clearCacheRecursion = function (data: any): void {
    for (let i = 0; i < data.tree.length; i++) {
      const treeItem = data.tree[i];
      if (treeItem.type == NodeType.CalculationLayer) {
        treeItem.cacheValue = null;
      }

      if (treeItem.isFolder == true) {
        fx.clearCacheRecursion(treeItem);
      }
    }
  };

  static initDataBase = function (json: string): void {
    fx.isBillboardLayerView = false;
    new fx.FXCentre();

    const stageData = JSON.parse(json).stage.operationArray;
    const libraryData = JSON.parse(json).library.operationArray;
    fx.editBody = null;
    fx.selectBody = null;
    fx.createLibraryBody(libraryData, true);
    fx.parseLibraryBody(libraryData, true);
  };

  /**
   * 解析绝对路径
   * @param address
   * @returns {*|void|string}
   */
  static parseAbsoluteAddress = function (address: string): string {
    return address.replace(/\./g, "");
  };

  /**
   * 获取看板
   * @param array
   * @param folder
   * @returns {null}
   */
  static recursionGetBillboard = function (array: any[], folder: any): any {
    if (folder.tree == null) return null;
    for (let i = 0; i < folder.tree.length; i++) {
      if (folder.tree[i] instanceof fx.BillboardLayer) {
        array.push(folder.tree[i]);
      }
      fx.recursionGetBillboard(array, folder.tree[i]);
    }
    return null;
  };

  /**
   * 存储运算体元素
   * @param saveArray
   * @param bodyArray
   */
  static saveBody = function (saveArray: any[], bodyArray: any[]): void {
    for (let i = 0; i < bodyArray.length; i++) {
      const bodyItem = bodyArray[i];
      if (bodyItem.type == NodeType.OperationBody) {
        var cx = 0;
        var cy = 0;
        if (bodyItem.view != null) {
          // cx = bodyItem.view.layerGroup.getX();
          // cy = bodyItem.view.layerGroup.getY();
          cx = bodyItem.view.getX();
          cy = bodyItem.view.getY();
        }

        const operationBodySaveData = fx.createBodyData(
          bodyItem.type,
          bodyItem.isFunction,
          bodyItem.isBindingOperation,
          cx,
          cy,
          bodyItem.isWeight,
          bodyItem.isAdvance,
          bodyItem.funcType
        );
        if (bodyItem.isBindingFormula) {
          operationBodySaveData.isFormula = true;
          operationBodySaveData.formulaName = bodyItem.formulaBody.name;
          operationBodySaveData.formulaX = bodyItem.formulaBody.x;
          operationBodySaveData.formulaY = bodyItem.formulaBody.y;
        }
        operationBodySaveData.id = bodyItem.id;
        saveArray.push(operationBodySaveData);
        for (var j = 0; j < bodyItem.tree.length; j++) {
          const bodyTreeItem = bodyItem.tree[j];
          const treeData = fx.createVarData(
            bodyTreeItem.TID,
            bodyTreeItem.name,
            bodyTreeItem.value,
            bodyTreeItem.type,
            bodyTreeItem.macros,
            bodyTreeItem.operator,
            bodyTreeItem.enemyFlag,
            bodyTreeItem.source,
            bodyTreeItem.tag,
            bodyTreeItem.statistics,
            bodyTreeItem.upDateValue,
            bodyTreeItem.demoteValue,
            bodyTreeItem.funcType,
            // 逻辑块数据
            bodyTreeItem.isLogicalOpen,
            bodyTreeItem.isDragging,
            bodyTreeItem.currentStep,
            bodyTreeItem.snNo,
            bodyTreeItem.minValue,
            bodyTreeItem.maxValue,
            bodyTreeItem.step,
            bodyTreeItem.logicalChildArray,
            bodyTreeItem.selectedOutputInfo
          );
          treeData.id = bodyTreeItem.id;
          operationBodySaveData.tree.push(treeData);
        }
      } else if (bodyItem.type == NodeType.SymbolBody) {
        var cx = 0;
        var cy = 0;
        if (bodyItem.view != null) {
          // cx = bodyItem.view.layerGroup.getX();
          // cy = bodyItem.view.layerGroup.getY();
          cx = bodyItem.view.getX();
          cy = bodyItem.view.getY();
        }
        const symbolBodySaveData = fx.createSymbolData(
          bodyItem.type,
          bodyItem.operator,
          bodyItem.isFunctionId,
          bodyItem.isBindingOperation,
          cx,
          cy,
          bodyItem.isWeight,
          bodyItem.funcType
        );
        if (bodyItem.isBindingFormula) {
          symbolBodySaveData.isFormula = true;
          symbolBodySaveData.formulaName = bodyItem.formulaBody.name;
          symbolBodySaveData.formulaX = bodyItem.formulaBody.x;
          symbolBodySaveData.formulaY = bodyItem.formulaBody.y;
        }
        symbolBodySaveData.id = bodyItem.id;
        saveArray.push(symbolBodySaveData);
        for (var j = 0; j < bodyItem.tree.length; j++) {
          const bodyTreeItem = bodyItem.tree[j];
          switch (bodyTreeItem.type) {
            case "OperationBody":
              var cx = 0;
              var cy = 0;
              if (bodyTreeItem.view != null) {
                // cx = bodyTreeItem.view.layerGroup.getX();
                // cy = bodyTreeItem.view.layerGroup.getY();
                cx = bodyTreeItem.view.getX();
                cy = bodyTreeItem.view.getY();
              }

              var childSaveData = fx.createBodyData(
                bodyTreeItem.type,
                bodyTreeItem.isFunction,
                bodyTreeItem.isBindingOperation,
                cx,
                cy,
                bodyTreeItem.isWeight,
                bodyTreeItem.isAdvance,
                bodyTreeItem.funcType
              );
              childSaveData.id = bodyTreeItem.id;
              symbolBodySaveData.tree.push(childSaveData);
              for (let n = 0; n < bodyTreeItem.tree.length; n++) {
                const bodyTreeItemChildTreeItem = bodyTreeItem.tree[n];
                const treeData = fx.createVarData(
                  bodyTreeItemChildTreeItem.TID,
                  bodyTreeItemChildTreeItem.name,
                  bodyTreeItemChildTreeItem.value,
                  bodyTreeItemChildTreeItem.type,
                  bodyTreeItemChildTreeItem.macros,
                  bodyTreeItemChildTreeItem.operator,
                  bodyTreeItemChildTreeItem.enemyFlag,
                  bodyTreeItemChildTreeItem.source,
                  bodyTreeItemChildTreeItem.tag,
                  bodyTreeItemChildTreeItem.statistics,
                  bodyTreeItemChildTreeItem.upDateValue,
                  bodyTreeItemChildTreeItem.demoteValue,
                  bodyTreeItemChildTreeItem.funcType,
                  // 逻辑块数据
                  bodyTreeItemChildTreeItem.isLogicalOpen,
                  bodyTreeItemChildTreeItem.isDragging,
                  bodyTreeItemChildTreeItem.currentStep,
                  bodyTreeItemChildTreeItem.snNo,
                  bodyTreeItemChildTreeItem.minValue,
                  bodyTreeItemChildTreeItem.maxValue,
                  bodyTreeItemChildTreeItem.step,
                  bodyTreeItemChildTreeItem.logicalChildArray,
                  bodyTreeItemChildTreeItem.selectedOutputInfo
                );
                treeData.id = bodyTreeItemChildTreeItem.id;
                childSaveData.tree.push(treeData);
              }
              break;
            case "SymbolBody":
              var cx = 0;
              var cy = 0;
              if (bodyTreeItem.view != null) {
                // cx = bodyTreeItem.view.layerGroup.getX();
                // cy = bodyTreeItem.view.layerGroup.getY();
                cx = bodyTreeItem.view.getX();
                cy = bodyTreeItem.view.getY();
              }
              var childSaveData = fx.createSymbolData(
                bodyTreeItem.type,
                bodyTreeItem.operator,
                bodyTreeItem.isFunctionId,
                bodyTreeItem.isBindingOperation,
                cx,
                cy,
                bodyTreeItem.isWeight,
                bodyTreeItem.funcType
              );
              childSaveData.id = bodyTreeItem.id;
              symbolBodySaveData.tree.push(childSaveData);
              fx.recursionSeekBody(childSaveData.tree, bodyTreeItem.tree);
              break;
          }
        }
      } else if (bodyItem.type == NodeType.Bookmark) {
        const bodyData = fx.createBookmarkData(bodyItem);
        bodyData.id = bodyItem.id;
        saveArray.push(bodyData);
      }
    }
  };

  static coordinateDetection = function (view: any): { x: number; y: number } {
    if (view != null) {
      // return { x: view.layerGroup.getX(), y: view.layerGroup.getY() };
      return { x: view.getX(), y: view.getY() };
    } else {
      return { x: 0, y: 0 };
    }
  };

  /**
   * 递归生成元素
   * @param 上级
   * @param tree
   */
  static recursionSeekBody = function (parent: any[], tree: any[]): void {
    for (let i = 0; i < tree.length; i++) {
      const treeItem = tree[i];
      switch (treeItem.type) {
        case "OperationBody":
          var xy = fx.coordinateDetection(treeItem.view);

          var bodyView = fx.createBodyData(
            treeItem.type,
            treeItem.isFunction,
            treeItem.isBindingOperation,
            xy.x,
            xy.y,
            treeItem.isWeight,
            treeItem.isAdvance,
            treeItem.funcType
          );
          parent.push(bodyView);
          for (let n = 0; n < treeItem.tree.length; n++) {
            const treeTreeItem = treeItem.tree[n];
            bodyView.tree.push(
              fx.createVarData(
                treeTreeItem.TID,
                treeTreeItem.name,
                treeTreeItem.value,
                treeTreeItem.type,
                treeTreeItem.macros,
                treeTreeItem.operator,
                treeTreeItem.enemyFlag,
                treeTreeItem.source,
                treeTreeItem.tag,
                treeTreeItem.statistics,
                treeTreeItem.upDateValue,
                treeTreeItem.demoteValue,
                treeTreeItem.funcType,
                // 逻辑块数据
                treeTreeItem.isLogicalOpen,
                treeTreeItem.isDragging,
                treeTreeItem.currentStep,
                treeTreeItem.snNo,
                treeTreeItem.minValue,
                treeTreeItem.maxValue,
                treeTreeItem.step,
                treeTreeItem.logicalChildArray,
                treeTreeItem.selectedOutputInfo
              )
            );
          }
          break;
        case "SymbolBody":
          var xy = fx.coordinateDetection(treeItem.view);
          var bodyView = fx.createSymbolData(
            treeItem.type,
            treeItem.operator,
            treeItem.isFunctionId,
            treeItem.isBindingOperation,
            xy.x,
            xy.y,
            treeItem.isWeight,
            treeItem.funcType
          );
          parent.push(bodyView);
          fx.recursionSeekBody(bodyView.tree, treeItem.tree);
          break;
      }
    }
  };

  /**
   * 获取绝对路径
   * @param body
   * @returns {string}
   */
  static getAbsoluteAddress = function (body: any, copy?: boolean): string {
    if (copy) {
      var address = [];
      fx.getStepData(body, address, copy);
      var addressString = "";
      for (var i = 0; i < address.length; i++) {
        addressString += address[i];
      }
      return addressString;
    }

    if (body.site != null && body.site != undefined) {
      return body.site;
    } else {
      if (body.parentFolder == null) {
        if (body.source != null) {
          return body.source.absoluteAddress;
        } else {
          return body.name;
        }
      } else {
        var address = [];
        fx.getStepData(body, address, copy);
        var addressString = "";
        for (var i = 0; i < address.length; i++) {
          addressString += address[i];
        }
        return addressString;
      }
    }
  };

  static copyHeadFun = function (body: any): boolean {
    if (body.copyHead) {
      return true;
    }
    if (body.parentFolder != null && body.parentFolder.name != null) {
      return fx.copyHeadFun(body.parentFolder);
    }
    return false;
  };

  /**
   * 获取层级信息
   * @param body
   * @param array
   */
  static getStepData = function (
    body: any,
    array: string[],
    copy?: boolean
  ): void {
    array.unshift(body.name);
    if (body.parentFolder != null && body.parentFolder.name != null) {
      fx.getStepData(body.parentFolder, array, copy);
    }
  };

  /**
   * 获取层级信息
   * @param body
   * @param array
   */
  static getStepDataAll = function (body: any, array: string[]): void {
    array.unshift(body.name);

    if (body.parentFolder.name != null) {
      fx.getStepDataAll(body.parentFolder, array);
    }
  };

  /**
   * 创建变量存储数据
   * @param name
   * @param value
   * @param type
   * @param macro
   * @param operator
   * @param enemy
   * @param address
   * @returns {{}}
   */
  static createVarData = function (
    TID: any,
    name: string,
    value: any,
    type: any,
    macros: any,
    operator: any,
    enemy: any,
    address: any,
    tag: any,
    statistics: any,
    upDateValue: any,
    demoteValue: any,
    funcType: any,
    // 逻辑块数据
    isLogicalOpen: any,
    isDragging: any,
    currentStep: any,
    snNo: any,
    minValue: any,
    maxValue: any,
    step: any,
    logicalChildArray: any,
    selectedOutputInfo?: any
  ): any {
    const saveData: any = {};

    if (fx.code) {
      saveData.TID = TID;
    } else {
      saveData.TID = TID;
      //saveData.TID=new Date().getTime()+fx.functionAddIndex;
      //fx.functionAddIndex++;
    }

    saveData.name = name;
    saveData.value = value;
    saveData.type = type;
    saveData.macros = macros;
    saveData.operator = operator;
    saveData.enemy = enemy;
    saveData.tag = tag;

    saveData.site = fx.getAbsoluteAddress(address);

    saveData.statistics = statistics;
    saveData.upDateValue = upDateValue;
    saveData.demoteValue = demoteValue;
    saveData.funcType = funcType;
    saveData.isLogicalOpen = isLogicalOpen;
    saveData.isDragging = isDragging;
    saveData.currentStep = currentStep;
    saveData.snNo = snNo;
    saveData.minValue = minValue;
    saveData.maxValue = maxValue;
    saveData.step = step;
    saveData.logicalChildArray = [];
    saveData.selectedOutputInfo =
      typeof selectedOutputInfo === "object"
        ? JSON.stringify(selectedOutputInfo)
        : "";

    if (logicalChildArray && logicalChildArray.length) {
      logicalChildArray.forEach((logicalItem) => {
        const varData = fx.createVarData(
          logicalItem.TID,
          logicalItem.name,
          logicalItem.value,
          logicalItem.type,
          logicalItem.macros,
          logicalItem.operator,
          logicalItem.enemyFlag,
          logicalItem.source,
          logicalItem.tag,
          logicalItem.statistics,
          logicalItem.upDateValue,
          logicalItem.demoteValue,
          logicalItem.funcType,
          // 逻辑块数据
          logicalItem.isLogicalOpen,
          logicalItem.isDragging,
          logicalItem.currentStep,
          logicalItem.snNo,
          logicalItem.minValue,
          logicalItem.maxValue,
          logicalItem.step,
          logicalItem.logicalChildArray
        );
        saveData.logicalChildArray.push(varData);
      });
    }
    return saveData;
  };

  /**
   * 创建运算体存储数据
   * @param type
   * @param isFunction
   * @param isBoundOutput
   * @param x
   * @param y
   * @returns {{}}
   */
  static createBodyData = function (
    type: any,
    isFunction: boolean,
    isBoundOutput: boolean,
    x: number,
    y: number,
    isWeight: boolean,
    isAdvance: boolean,
    funcType: any
  ): any {
    const saveData: any = {};
    saveData.tree = [];
    saveData.type = type;
    saveData.isFunction = isFunction;
    saveData.isBoundOutput = isBoundOutput;
    saveData.x = x;
    saveData.y = y;
    saveData.isWeight = isWeight;
    saveData.isAdvance = isAdvance;
    saveData.funcType = funcType;

    return saveData;
  };

  /**
   * 创建符号体存储数据
   * @param type
   * @param operator
   * @param isFunctionId
   * @param isBoundOutput
   * @param x
   * @param y
   * @returns {{}}
   */
  static createSymbolData = function (
    type: any,
    operator: any,
    isFunctionId: boolean,
    isBoundOutput: boolean,
    x: number,
    y: number,
    isWeight: boolean,
    funcType: any
  ): any {
    const saveData: any = {};
    saveData.tree = [];
    saveData.type = type;
    saveData.operator = operator;
    saveData.isFunctionId = isFunctionId;
    saveData.isBoundOutput = isBoundOutput;
    saveData.x = x;
    saveData.y = y;
    saveData.isWeight = isWeight;
    saveData.funcType = funcType;
    return saveData;
  };

  /**
   * 创建标签存储数据
   * @param name
   * @param address
   * @returns {{}}
   */
  static createBookmarkData = function (address: any) {
    const saveData: any = {};
    saveData.x = address.x;
    saveData.y = address.y;
    saveData.width = address.width;
    saveData.height = address.height;
    saveData.text = address.text;
    saveData.type = address.type;
    return saveData;
  };

  /**
   * 创建图表存储数据
   * @param name
   * @param address
   * @returns {{}}
   */
  static createChartData = function (data: any) {
    const saveData: any = {};
    saveData.name = data.name;
    saveData.minValue = data.minValue;
    saveData.maxValue = data.maxValue;
    saveData.intervalValue = data.intervalValue;
    saveData.operationlayer = [];
    saveData.metadataArray = [];
    saveData.isXlsx = true;
    if (data.operationArray != null)
      for (var i = 0; i < data.operationArray.length; i++) {
        saveData.operationlayer.push(
          fx.getAbsoluteAddress(data.operationArray[i].source)
        );
      }
    if (data.body != null || data.metadata != null)
      saveData.metadata = fx.getAbsoluteAddress(data.metadata.source);

    for (var i = 0, len = data.metadataArray.length; i < len; i++) {
      const metadata = data.metadataArray[i];
      const source = metadata.source;
      const itemData: any = {
        site: fx.getAbsoluteAddress(source),
      };
      if (metadata.minValue != 1) {
        itemData.minValue = metadata.minValue;
      }

      if (metadata.intervalValue != 1) {
        itemData.intervalValue = metadata.intervalValue;
      }
      saveData.metadataArray.push(itemData);
    }
    saveData.site = fx.getAbsoluteAddress(data);
    return saveData;
  };

  /**
   * 寻找运算体根级
   * @param 寻找运算体数组
   * @returns {[]}
   */
  static seekSource = function (bodyArray) {
    const parentArray: any[] = [];
    for (let i = 0; i < bodyArray.length; i++) {
      const bodyItem = bodyArray[i];
      if (bodyItem.parent == null) {
        if (parentArray.length == 0) {
          parentArray.push(bodyItem);
        } else {
          for (let j = 0; j < parentArray.length; j++) {
            if (parentArray[j] != bodyItem) {
              parentArray.push(bodyItem);
              break;
            }
          }
        }
      }
    }
    return parentArray;
  };

  /**
   * 创建看板层元数据存储数据
   * @param name
   * @param type
   * @param value
   * @param address
   * @param module
   * @returns {{}}
   */
  static createBillboarMetadataData = function (
    name: any,
    type: any,
    value: any,
    address: any,
    module: any
  ) {
    const saveData: any = {};
    saveData.name = name;
    saveData.type = type;
    saveData.value = value;
    saveData.site = fx.getAbsoluteAddress(address);
    saveData.componentType = module.type;
    saveData.componentValue = module.body.value;
    saveData.componentMinValue = module.minValue;
    saveData.componentMaxValue = module.maxValue;
    saveData.componentIntervalValue = module.intervalValue;
    saveData.list = module.list;
    return saveData;
  };

  /**
   * 创建运算层存储数据
   * @param name
   * @param type
   * @param value
   * @param address
   * @returns {{}}
   */
  static createOperationLayerData = function (
    name: any,
    type: any,
    value: any,
    address: any,
    tag: any,
    isSystemShow: any,
    sheetData: any,
    childCell: any
  ) {
    const saveData: any = {};

    saveData.name = name;
    saveData.type = type;
    saveData.value = value;
    saveData.site = fx.getAbsoluteAddress(address);
    saveData.tag = tag;
    saveData.operationArray = [];
    if (type === NodeType.Sheet && sheetData) {
      saveData.sheetData = sheetData;
      saveData.childCell = childCell;
    }
    saveData.isSystemShow = isSystemShow;
    return saveData;
  };

  /**
   * 创建看板存储数据
   * @param name
   * @param address
   * @returns {{}}
   */
  static createBillboarData = function (
    name: any,
    address: any,
    monitored: any
  ) {
    const saveData: any = {};
    saveData.name = name;
    saveData.site = fx.getAbsoluteAddress(address);
    saveData.isBoard = true;
    saveData.operationArray = [];
    saveData.metadataArray = [];
    saveData.monitored = monitored;
    return saveData;
  };

  /**
   * 创建文件夹存储数据
   * @param name
   * @param isFolder
   * @param address
   * @returns {{}}
   */
  static createFolderData = function (name: any, isFolder: any, address: any) {
    const saveData: any = {};
    saveData.name = name;
    saveData.isFile = isFolder;
    saveData.operationArray = [];
    saveData.site = fx.getAbsoluteAddress(address);
    return saveData;
  };

  /**
   * 获得回合数
   * @param body
   * @returns {number[]}
   */
  static getBout = function (body: any): number[] {
    if (body.tree.length > 1) {
      if (body.tree[0].getValue() != 0 && body.tree[1].getValue() != 0)
        if (Number(body.tree[0].getValue()) > Number(body.tree[1].getValue())) {
          let baseValue = Number(body.tree[0].getValue());
          let accumulatedValue = 0;

          for (let i = 1; i < body.tree.length; i++) {
            accumulatedValue += Number(body.treeItem.getValue());
          }
          let boutValue = 0;
          let overlayValue = 0;
          while (baseValue >= accumulatedValue) {
            overlayValue += accumulatedValue;
            baseValue -= accumulatedValue;
            boutValue++;
          }
          return [boutValue, overlayValue / boutValue];
        }
      return [0, 0];
    }
    return [0, 0];
  };

  /**
   * 深度复制
   * @param source
   * @returns {{}}
   */
  static copy = function (source: any): any {
    const result = {};
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        result[key] =
          typeof source[key] === "object" ? fx.copy(source[key]) : source[key];
      }
    }
    return result;
  };

  static getIsBoundOutput = function (child: any, boolean?: any): boolean {
    if (boolean != null) {
      return false;
    }
    if (child.isBoundOutput != null) {
      return child.isBoundOutput;
    }
    return child.isBindingOperation;
  };

  static coordinate = function (child: any, restriction?: any): number[] {
    let s = 1;
    if (fx.visualVersionCompatibility) {
      s = 0.5;
    }
    if (child.view != null) {
      if (child.parent == null) {
        return [
          0, 0,
          // (fx.SabApp.mouseX - child.view.layerGroup.getParent().getX()) * s,
          // (fx.SabApp.mouseY - child.view.layerGroup.getParent().getY()) * s,
        ];
      }
      return [child.view.getX() * s, child.view.getY() * s];
    }
    return [child.x * s, child.y * s];
  };

  /**
   * 解析场景数据
   * @param 解析数据
   * @param 是否是场景
   */
  static parseStageBody = function (
    data: any[],
    stageShow?: any,
    restriction?: any,
    copy?: boolean
  ): any {
    let rootDirectory = null;
    for (let i = 0; i < data.length; i++) {
      const dataItem = data[i];
      if (restriction == null)
        if (dataItem.parent != null) {
          return;
        }
      if (
        dataItem.type == NodeType.OperationBody ||
        dataItem.type == "运算体类"
      ) {
        var bodyView;

        if (dataItem.isFunction) {
          bodyView = fx.createOperationBody(
            fx.coordinate(data[i], restriction)[0],
            fx.coordinate(data[i], restriction)[1],
            1,
            dataItem.isWeight,
            dataItem.isAdvance,
            dataItem.funcType
          );
          bodyView.isBindingOperation = fx.getIsBoundOutput(
            data[i],
            restriction
          );
          fx.operationBindBody(bodyView);

          if (rootDirectory == null) {
            rootDirectory = bodyView;
          }
          for (var j = 0; j < dataItem.tree.length; j++) {
            const dataTreeItem = dataItem.tree[j];
            if (dataTreeItem.type == NodeType.Macro) {
              var bodydata = new fx.VariableValue(
                dataTreeItem.name,
                null,
                dataTreeItem.type
              );
              if (copy) {
                (bodydata as any).TID = dataTreeItem.TID;
                //bodydata.TID=new Date().getTime();
              } else {
                (bodydata as any).TID = dataTreeItem.TID;
              }
              if ((bodydata as any).TID == undefined) {
                (bodydata as any).TID =
                  new Date().getTime() + fx.functionAddIndex;
                fx.functionAddIndex++;
              }
              let bodydataView = fx.createFunctionBody(bodyView, bodydata);

              bodydataView.setMacros(fx.amendMacros(dataTreeItem));

              bodydataView.enemyFlag = dataTreeItem.enemy;
              bodydataView.funcType = dataTreeItem.funcType;

              if (bodydataView.funcType == undefined) bodydataView.funcType = 0;
              bodydataView.statistics = dataTreeItem.statistics;
              bodydataView.upDateValue = dataTreeItem.upDateValue;

              bodydataView.demoteValue = dataTreeItem.demoteValue;

              fx.symbolicLink(bodydataView, dataTreeItem.operator);
              fx.Call.send(
                fx.Eve.SHIFT_SHOW_VIEW,
                [bodydataView, dataTreeItem.operator, stageShow],
                null
              );
            } else if (
              [
                NodeType.LogicalBasic,
                NodeType.LogicalBool,
                NodeType.LogicalSlider,
              ].includes(dataTreeItem.type)
            ) {
              var bodydata = new fx.VariableValue(
                dataTreeItem.name,
                dataTreeItem.value,
                dataTreeItem.type
              );
              if (copy) {
                (bodydata as any).TID = dataTreeItem.TID;
                //bodydata.TID=new Date().getTime();
              } else {
                (bodydata as any).TID = dataTreeItem.TID;
              }
              if ((bodydata as any).TID == undefined) {
                (bodydata as any).TID =
                  new Date().getTime() + fx.functionAddIndex;
                fx.functionAddIndex++;
              }
              let bodydataView = fx.createFunctionBody(bodyView, bodydata);

              bodydataView.enemyFlag = dataTreeItem.enemy;
              bodydataView.funcType = dataTreeItem.funcType;

              if (bodydataView.funcType == undefined) bodydataView.funcType = 0;
              if (dataTreeItem.type == NodeType.Sheet)
                bodydataView.selectedOutputInfo =
                  dataTreeItem.selectedOutputInfo
                    ? JSON.parse(dataTreeItem.selectedOutputInfo)
                    : "";
              bodydataView.statistics = dataTreeItem.statistics;
              bodydataView.upDateValue = dataTreeItem.upDateValue;
              bodydataView.demoteValue = dataTreeItem.demoteValue;
              bodydataView.isLogicalOpen = dataTreeItem.isLogicalOpen;
              bodydataView.isDragging = dataTreeItem.isDragging;
              bodydataView.snNo = dataTreeItem.snNo;
              bodydataView.logicalNumberList = dataTreeItem.logicalNumberList;
              bodydataView.currentStep = dataTreeItem.currentStep;
              bodydataView.snNo = dataTreeItem.snNo;
              bodydataView.minValue = dataTreeItem.minValue;
              bodydataView.maxValue = dataTreeItem.maxValue;
              bodydataView.step = dataTreeItem.step;
              bodydataView.logicalChildArray = [];
              dataTreeItem.logicalChildArray.forEach((variable) => {
                const bodyArray = [];
                fx.getLibraryBody(
                  bodyArray,
                  fx.targetFolder.tree,
                  fx.getAbsoluteAddress(variable)
                );
                const bodydataCp = bodyArray[0] as any;
                const bodydataViewCp = (bodydataCp as any).copy();

                bodydataViewCp.enemyFlag = dataTreeItem.enemy;
                bodydataViewCp.funcType = dataTreeItem.funcType;
                if (bodydataViewCp.funcType == undefined)
                  bodydataViewCp.funcType = 0;
                bodydataViewCp.statistics = dataTreeItem.statistics;
                bodydataViewCp.upDateValue = dataTreeItem.upDateValue;
                bodydataViewCp.demoteValue = dataTreeItem.demoteValue;
                bodydataView.logicalChildArray.push(bodydataViewCp);
              });

              fx.symbolicLink(bodydataView, dataTreeItem.operator);
              fx.Call.send(
                fx.Eve.SHIFT_SHOW_VIEW,
                [bodydataView, dataTreeItem.operator, stageShow],
                null
              );
            } else {
              var bodyArray = [];
              if (copy) {
                fx.getLibraryBody(
                  bodyArray,
                  fx.targetFolder.tree,
                  fx.getAbsoluteAddress(dataTreeItem.source)
                );
              } else {
                fx.getLibraryBody(
                  bodyArray,
                  fx.targetFolder.tree,
                  fx.getAbsoluteAddress(dataTreeItem)
                );
              }
              let bodydataVar = bodyArray[0] as any;
              let bodydataView = fx.createVariableBody(bodyView, bodydataVar);

              bodydataView.enemyFlag = dataTreeItem.enemy;
              bodydataView.funcType = dataTreeItem.funcType;
              if (bodydataView.funcType == undefined) bodydataView.funcType = 0;
              if (dataTreeItem.type == NodeType.Sheet)
                bodydataView.selectedOutputInfo =
                  dataTreeItem.selectedOutputInfo
                    ? JSON.parse(dataTreeItem.selectedOutputInfo)
                    : "";
              bodydataView.statistics = dataTreeItem.statistics;
              bodydataView.upDateValue = dataTreeItem.upDateValue;
              bodydataView.demoteValue = dataTreeItem.demoteValue;
              fx.symbolicLink(bodydataView, dataTreeItem.operator);
              fx.Call.send(
                fx.Eve.SHIFT_SHOW_VIEW,
                [bodydataView, dataTreeItem.operator, stageShow],
                null
              );
            }
          }
          fx.Call.send(fx.Eve.SHIFT_SHOW_VIEW_ON, [bodyView, stageShow], null);
        } else {
          bodyView = fx.createOperationBody(
            fx.coordinate(data[i], restriction)[0],
            fx.coordinate(data[i], restriction)[1],
            0,
            dataItem.isWeight,
            dataItem.isAdvance,
            dataItem.funcType
          );
          bodyView.isBindingOperation = fx.getIsBoundOutput(
            data[i],
            restriction
          );
          fx.operationBindBody(bodyView);

          if (rootDirectory == null) {
            rootDirectory = bodyView;
          }
          for (var j = 0; j < dataItem.tree.length; j++) {
            const dataTreeItem = dataItem.tree[j];
            if (dataTreeItem.type == NodeType.Macro) {
              var bodydata = new fx.VariableValue(
                dataTreeItem.name,
                null,
                dataTreeItem.type
              );

              if (copy) {
                //bodydata.TID=new Date().getTime();
                (bodydata as any).TID = dataTreeItem.TID;
              } else {
                (bodydata as any).TID = dataTreeItem.TID;
              }
              if ((bodydata as any).TID == undefined) {
                (bodydata as any).TID =
                  new Date().getTime() + fx.functionAddIndex;
                fx.functionAddIndex++;
              }
              let bodydataView = fx.createFunctionBody(bodyView, bodydata);
              bodydataView.setMacros(fx.amendMacros(dataTreeItem));
              bodydataView.enemyFlag = dataTreeItem.enemy;
              bodydataView.funcType = dataTreeItem.funcType;
              if (bodydataView.funcType == undefined) bodydataView.funcType = 0;
              bodydataView.statistics = dataTreeItem.statistics;
              bodydataView.upDateValue = dataTreeItem.upDateValue;
              bodydataView.demoteValue = dataTreeItem.demoteValue;
              fx.symbolicLink(bodydataView, dataTreeItem.operator);
              fx.Call.send(
                fx.Eve.SHIFT_SHOW_VIEW,
                [bodydataView, dataTreeItem.operator, stageShow],
                null
              );
            } else if (
              [
                NodeType.LogicalBasic,
                NodeType.LogicalBool,
                NodeType.LogicalSlider,
              ].includes(dataTreeItem.type)
            ) {
              var bodydata = new fx.VariableValue(
                dataTreeItem.name,
                dataTreeItem.value,
                dataTreeItem.type
              );
              if (copy) {
                (bodydata as any).TID = dataTreeItem.TID;
                //bodydata.TID=new Date().getTime();
              } else {
                (bodydata as any).TID = dataTreeItem.TID;
              }
              if ((bodydata as any).TID == undefined) {
                (bodydata as any).TID =
                  new Date().getTime() + fx.functionAddIndex;
                fx.functionAddIndex++;
              }
              let bodydataView = fx.createFunctionBody(bodyView, bodydata);

              bodydataView.enemyFlag = dataTreeItem.enemy;
              bodydataView.funcType = dataTreeItem.funcType;

              if (bodydataView.funcType == undefined) bodydataView.funcType = 0;
              if (dataTreeItem.type == NodeType.Sheet)
                bodydataView.selectedOutputInfo =
                  dataTreeItem.selectedOutputInfo
                    ? JSON.parse(dataTreeItem.selectedOutputInfo)
                    : "";
              bodydataView.statistics = dataTreeItem.statistics;
              bodydataView.upDateValue = dataTreeItem.upDateValue;
              bodydataView.demoteValue = dataTreeItem.demoteValue;
              bodydataView.isLogicalOpen = dataTreeItem.isLogicalOpen;
              bodydataView.isDragging = dataTreeItem.isDragging;
              bodydataView.snNo = dataTreeItem.snNo;
              bodydataView.logicalNumberList = dataTreeItem.logicalNumberList;
              bodydataView.currentStep = dataTreeItem.currentStep;
              bodydataView.snNo = dataTreeItem.snNo;
              bodydataView.minValue = dataTreeItem.minValue;
              bodydataView.maxValue = dataTreeItem.maxValue;
              bodydataView.step = dataTreeItem.step;
              bodydataView.logicalChildArray = [];
              dataTreeItem.logicalChildArray.forEach((variable) => {
                const bodyArray = [];
                fx.getLibraryBody(
                  bodyArray,
                  fx.targetFolder.tree,
                  fx.getAbsoluteAddress(variable)
                );
                const bodydataCp = bodyArray[0] as any;
                const bodydataViewCp = (bodydataCp as any).copy();

                bodydataViewCp.enemyFlag = dataTreeItem.enemy;
                bodydataViewCp.funcType = dataTreeItem.funcType;
                if (bodydataViewCp.funcType == undefined)
                  bodydataViewCp.funcType = 0;
                bodydataViewCp.statistics = dataTreeItem.statistics;
                bodydataViewCp.upDateValue = dataTreeItem.upDateValue;
                bodydataViewCp.demoteValue = dataTreeItem.demoteValue;
                bodydataView.logicalChildArray.push(bodydataViewCp);
              });

              fx.symbolicLink(bodydataView, dataTreeItem.operator);
              fx.Call.send(
                fx.Eve.SHIFT_SHOW_VIEW,
                [bodydataView, dataTreeItem.operator, stageShow],
                null
              );
            } else {
              var bodyArray = [];

              if (copy) {
                fx.getLibraryBody(
                  bodyArray,
                  fx.targetFolder.tree,
                  fx.getAbsoluteAddress(dataTreeItem.source)
                );
              } else {
                if (dataTreeItem.source) {
                  fx.getLibraryBody(
                    bodyArray,
                    fx.targetFolder.tree,
                    fx.getAbsoluteAddress(dataTreeItem.source)
                  );
                } else {
                  fx.getLibraryBody(
                    bodyArray,
                    fx.targetFolder.tree,
                    fx.getAbsoluteAddress(dataTreeItem)
                  );
                }
              }

              let bodydataVar = bodyArray[0] as any;

              let bodydataView = fx.createVariableBody(bodyView, bodydataVar);

              bodydataView.enemyFlag = dataTreeItem.enemy;
              bodydataView.funcType = dataTreeItem.funcType;
              if (bodydataView.funcType == undefined) bodydataView.funcType = 0;
              if (dataTreeItem.type == NodeType.Sheet)
                bodydataView.selectedOutputInfo =
                  dataTreeItem.selectedOutputInfo
                    ? JSON.parse(dataTreeItem.selectedOutputInfo)
                    : "";
              bodydataView.statistics = dataTreeItem.statistics;
              bodydataView.upDateValue = dataTreeItem.upDateValue;
              bodydataView.demoteValue = dataTreeItem.demoteValue;
              fx.symbolicLink(bodydataView, dataTreeItem.operator);
              fx.Call.send(
                fx.Eve.SHIFT_SHOW_VIEW,
                [bodydataView, dataTreeItem.operator, stageShow],
                null
              );
            }
          }
          fx.Call.send(fx.Eve.SHIFT_SHOW_VIEW_ON, [bodyView, stageShow], null);
        }

        if (dataItem.isFormula) {
          var formulaData = new fx.FormulaData(
            dataItem.formulaName,
            dataItem.formulaX,
            dataItem.formulaY
          );
          formulaData.body = bodyView;
          //formulaData.isBindingFormula=true;
          if (formulaData.body) {
            formulaData.body.isBindingFormula = true;
          }
          bodyView.formulaBody = formulaData;
          fx.Call.send(
            fx.Eve.SHIFT_ADD_FORMULA,
            [formulaData, bodyView.view, stageShow],
            null
          );
        }
      } else if (
        dataItem.type == NodeType.SymbolBody ||
        dataItem.type == "符号运算体类"
      ) {
        const symbolBody = fx.createSymbolBody(
          null,
          null,
          dataItem.operator,
          dataItem.isFunctionId,
          dataItem.isWeight,
          dataItem.funcType
        );
        symbolBody.isBindingOperation = fx.getIsBoundOutput(
          data[i],
          restriction
        );
        fx.operationBindBody(symbolBody);
        if (rootDirectory == null) {
          rootDirectory = symbolBody;
        }
        if (symbolBody.view != null) {
          symbolBody.view.setX(fx.coordinate(data[i], restriction)[0]);
          symbolBody.view.setY(fx.coordinate(data[i], restriction)[1]);
        }

        for (var j = 0; j < dataItem.tree.length; j++) {
          const dataTreeItem = dataItem.tree[j];
          if (
            dataTreeItem.type == NodeType.OperationBody ||
            dataTreeItem.type == "运算体类"
          ) {
            if (dataTreeItem.isFunction) {
              var bodyView = fx.createOperationBody(
                fx.coordinate(dataTreeItem, restriction)[0],
                fx.coordinate(dataTreeItem, restriction)[1],
                1,
                dataTreeItem.isWeight,
                dataTreeItem.isAdvance,
                dataTreeItem.funcType
              );

              bodyView.isBindingOperation = fx.getIsBoundOutput(
                dataTreeItem,
                restriction
              );
              fx.operationBindBody(bodyView);
              fx.addBody(symbolBody, bodyView, false);
              for (var n = 0; n < dataTreeItem.tree.length; n++) {
                const dataTreeTreeItem = dataTreeItem.tree[n];
                if (dataTreeTreeItem.type == NodeType.Macro) {
                  var bodydata = new fx.VariableValue(
                    dataTreeTreeItem.name,
                    null,
                    4
                  );
                  if (copy) {
                    //bodydata.TID=new Date().getTime();
                    bodydata.TID = dataTreeTreeItem.TID;
                  } else {
                    bodydata.TID = dataTreeTreeItem.TID;
                  }
                  if (bodydata.TID == undefined) {
                    bodydata.TID = new Date().getTime() + fx.functionAddIndex;
                    fx.functionAddIndex++;
                  }
                  let bodydataView = fx.createFunctionBody(bodyView, bodydata);
                  bodydataView.macros = fx.amendMacros(dataTreeTreeItem);
                  bodydataView.enemyFlag = dataTreeTreeItem.enemy;
                  bodydataView.funcType = dataTreeTreeItem.funcType;
                  if (bodydataView.funcType == undefined)
                    bodydataView.funcType = 0;
                  bodydataView.statistics = dataTreeTreeItem.statistics;
                  bodydataView.upDateValue = dataTreeTreeItem.upDateValue;
                  bodydataView.demoteValue = dataTreeTreeItem.demoteValue;
                  fx.symbolicLink(bodydataView, dataTreeTreeItem.operator);
                  fx.Call.send(
                    fx.Eve.SHIFT_SHOW_VIEW,
                    [bodydataView, dataTreeTreeItem.operator, stageShow],
                    null
                  );
                } else if (
                  [
                    NodeType.LogicalBasic,
                    NodeType.LogicalBool,
                    NodeType.LogicalSlider,
                  ].includes(dataTreeTreeItem.type)
                ) {
                  var bodydata = new fx.VariableValue(
                    dataTreeItem.name,
                    dataTreeItem.value,
                    dataTreeItem.type
                  );
                  if (copy) {
                    (bodydata as any).TID = dataTreeItem.TID;
                    //bodydata.TID=new Date().getTime();
                  } else {
                    (bodydata as any).TID = dataTreeItem.TID;
                  }
                  if ((bodydata as any).TID == undefined) {
                    (bodydata as any).TID =
                      new Date().getTime() + fx.functionAddIndex;
                    fx.functionAddIndex++;
                  }
                  let bodydataView = fx.createFunctionBody(bodyView, bodydata);

                  bodydataView.enemyFlag = dataTreeItem.enemy;
                  bodydataView.funcType = dataTreeItem.funcType;

                  if (bodydataView.funcType == undefined)
                    bodydataView.funcType = 0;
                  if (dataTreeItem.type == NodeType.Sheet)
                    bodydataView.selectedOutputInfo =
                      dataTreeItem.selectedOutputInfo
                        ? JSON.parse(dataTreeItem.selectedOutputInfo)
                        : "";
                  bodydataView.statistics = dataTreeItem.statistics;
                  bodydataView.upDateValue = dataTreeItem.upDateValue;
                  bodydataView.demoteValue = dataTreeItem.demoteValue;
                  bodydataView.isLogicalOpen = dataTreeItem.isLogicalOpen;
                  bodydataView.isDragging = dataTreeItem.isDragging;
                  bodydataView.snNo = dataTreeItem.snNo;
                  bodydataView.logicalNumberList =
                    dataTreeItem.logicalNumberList;
                  bodydataView.currentStep = dataTreeItem.currentStep;
                  bodydataView.snNo = dataTreeItem.snNo;
                  bodydataView.minValue = dataTreeItem.minValue;
                  bodydataView.maxValue = dataTreeItem.maxValue;
                  bodydataView.step = dataTreeItem.step;
                  bodydataView.logicalChildArray = [];
                  dataTreeItem.logicalChildArray.forEach((variable) => {
                    const bodyArray = [];
                    fx.getLibraryBody(
                      bodyArray,
                      fx.targetFolder.tree,
                      fx.getAbsoluteAddress(variable)
                    );
                    const bodydataCp = bodyArray[0] as any;
                    const bodydataViewCp = (bodydataCp as any).copy();

                    bodydataViewCp.enemyFlag = dataTreeItem.enemy;
                    bodydataViewCp.funcType = dataTreeItem.funcType;
                    if (bodydataViewCp.funcType == undefined)
                      bodydataViewCp.funcType = 0;
                    bodydataViewCp.statistics = dataTreeItem.statistics;
                    bodydataViewCp.upDateValue = dataTreeItem.upDateValue;
                    bodydataViewCp.demoteValue = dataTreeItem.demoteValue;
                    bodydataView.logicalChildArray.push(bodydataViewCp);
                  });

                  fx.symbolicLink(bodydataView, dataTreeItem.operator);
                  fx.Call.send(
                    fx.Eve.SHIFT_SHOW_VIEW,
                    [bodydataView, dataTreeItem.operator, stageShow],
                    null
                  );
                } else {
                  var bodyArray = [];

                  if (copy) {
                    fx.getLibraryBody(
                      bodyArray,
                      fx.targetFolder.tree,
                      fx.getAbsoluteAddress(dataTreeTreeItem.source)
                    );
                  } else {
                    fx.getLibraryBody(
                      bodyArray,
                      fx.targetFolder.tree,
                      fx.getAbsoluteAddress(dataTreeTreeItem)
                    );
                  }

                  let bodydataVar = bodyArray[0];
                  let bodydataView = fx.createVariableBody(
                    bodyView,
                    bodydataVar
                  );
                  bodydataView.enemyFlag = dataTreeTreeItem.enemy;
                  bodydataView.funcType = dataTreeTreeItem.funcType;
                  if (bodydataView.funcType == undefined)
                    bodydataView.funcType = 0;
                  if (dataTreeTreeItem.type == NodeType.Sheet)
                    bodydataView.selectedOutputInfo =
                      dataTreeTreeItem.selectedOutputInfo
                        ? JSON.parse(dataTreeTreeItem.selectedOutputInfo)
                        : "";
                  bodydataView.statistics = dataTreeTreeItem.statistics;
                  bodydataView.upDateValue = dataTreeTreeItem.upDateValue;
                  bodydataView.demoteValue = dataTreeTreeItem.demoteValue;
                  fx.symbolicLink(bodydataView, dataTreeTreeItem.operator);
                  fx.Call.send(
                    fx.Eve.SHIFT_SHOW_VIEW,
                    [bodydataView, dataTreeTreeItem.operator, stageShow],
                    null
                  );
                }
              }
              fx.Call.send(
                fx.Eve.SHIFT_SHOW_VIEW_ON,
                [bodyView, stageShow],
                null
              );
            } else {
              var bodyView = fx.createOperationBody(
                fx.coordinate(dataTreeItem, restriction)[0],
                fx.coordinate(dataTreeItem, restriction)[1],
                0,
                dataTreeItem.isWeight,
                dataTreeItem.isAdvance,
                dataTreeItem.funcType
              );

              bodyView.isBindingOperation = fx.getIsBoundOutput(
                dataTreeItem,
                restriction
              );
              fx.operationBindBody(bodyView);
              fx.addBody(symbolBody, bodyView, false);
              if (dataTreeItem.tree == null) {
                return null;
              }
              for (var n = 0; n < dataTreeItem.tree.length; n++) {
                const dataTreeTreeItem = dataTreeItem.tree[n];
                if (dataTreeTreeItem.type == NodeType.Macro) {
                  var bodydata = new fx.VariableValue(
                    dataTreeTreeItem.name,
                    null,
                    dataTreeTreeItem.type
                  );
                  if (copy) {
                    //bodydata.TID=new Date().getTime();
                    bodydata.TID = dataTreeTreeItem.TID;
                  } else {
                    bodydata.TID = dataTreeTreeItem.TID;
                  }
                  if (bodydata.TID == undefined) {
                    bodydata.TID = new Date().getTime() + fx.functionAddIndex;
                    fx.functionAddIndex++;
                  }
                  let bodydataView = fx.createFunctionBody(bodyView, bodydata);
                  bodydataView.setMacros(fx.amendMacros(dataTreeTreeItem));
                  bodydataView.enemyFlag = dataTreeTreeItem.enemy;
                  bodydataView.funcType = dataTreeTreeItem.funcType;
                  if (bodydataView.funcType == undefined)
                    bodydataView.funcType = 0;
                  bodydataView.statistics = dataTreeTreeItem.statistics;
                  bodydataView.upDateValue = dataTreeTreeItem.upDateValue;
                  bodydataView.demoteValue = dataTreeTreeItem.demoteValue;
                  fx.symbolicLink(bodydataView, dataTreeTreeItem.operator);
                  fx.Call.send(
                    fx.Eve.SHIFT_SHOW_VIEW,
                    [bodydataView, dataTreeTreeItem.operator, stageShow],
                    null
                  );
                } else if (
                  [
                    NodeType.LogicalBasic,
                    NodeType.LogicalBool,
                    NodeType.LogicalSlider,
                  ].includes(dataTreeTreeItem.type)
                ) {
                  var bodydata = new fx.VariableValue(
                    dataTreeTreeItem.name,
                    dataTreeTreeItem.value,
                    dataTreeTreeItem.type
                  );
                  if (copy) {
                    (bodydata as any).TID = dataTreeTreeItem.TID;
                    //bodydata.TID=new Date().getTime();
                  } else {
                    (bodydata as any).TID = dataTreeTreeItem.TID;
                  }
                  if ((bodydata as any).TID == undefined) {
                    (bodydata as any).TID =
                      new Date().getTime() + fx.functionAddIndex;
                    fx.functionAddIndex++;
                  }
                  let bodydataView = fx.createFunctionBody(bodyView, bodydata);

                  bodydataView.enemyFlag = dataTreeTreeItem.enemy;
                  bodydataView.funcType = dataTreeTreeItem.funcType;

                  if (bodydataView.funcType == undefined)
                    bodydataView.funcType = 0;
                  if (dataTreeTreeItem.type == NodeType.Sheet)
                    bodydataView.selectedOutputInfo =
                      dataTreeTreeItem.selectedOutputInfo
                        ? JSON.parse(dataTreeTreeItem.selectedOutputInfo)
                        : "";
                  bodydataView.statistics = dataTreeTreeItem.statistics;
                  bodydataView.upDateValue = dataTreeTreeItem.upDateValue;
                  bodydataView.demoteValue = dataTreeTreeItem.demoteValue;
                  bodydataView.isLogicalOpen = dataTreeTreeItem.isLogicalOpen;
                  bodydataView.isDragging = dataTreeTreeItem.isDragging;
                  bodydataView.snNo = dataTreeTreeItem.snNo;
                  bodydataView.logicalNumberList =
                    dataTreeTreeItem.logicalNumberList;
                  bodydataView.currentStep = dataTreeTreeItem.currentStep;
                  bodydataView.snNo = dataTreeTreeItem.snNo;
                  bodydataView.minValue = dataTreeTreeItem.minValue;
                  bodydataView.maxValue = dataTreeTreeItem.maxValue;
                  bodydataView.step = dataTreeTreeItem.step;
                  bodydataView.logicalChildArray = [];
                  dataTreeTreeItem.logicalChildArray.forEach((variable) => {
                    const bodyArray = [];
                    fx.getLibraryBody(
                      bodyArray,
                      fx.targetFolder.tree,
                      fx.getAbsoluteAddress(variable)
                    );
                    const bodydataCp = bodyArray[0] as any;
                    const bodydataViewCp = (bodydataCp as any).copy();

                    bodydataViewCp.enemyFlag = dataTreeTreeItem.enemy;
                    bodydataViewCp.funcType = dataTreeTreeItem.funcType;
                    if (bodydataViewCp.funcType == undefined)
                      bodydataViewCp.funcType = 0;
                    bodydataViewCp.statistics = dataTreeTreeItem.statistics;
                    bodydataViewCp.upDateValue = dataTreeTreeItem.upDateValue;
                    bodydataViewCp.demoteValue = dataTreeTreeItem.demoteValue;
                    bodydataView.logicalChildArray.push(bodydataViewCp);
                  });

                  fx.symbolicLink(bodydataView, dataTreeTreeItem.operator);
                  fx.Call.send(
                    fx.Eve.SHIFT_SHOW_VIEW,
                    [bodydataView, dataTreeTreeItem.operator, stageShow],
                    null
                  );
                } else {
                  var bodyArray = [];

                  if (copy) {
                    fx.getLibraryBody(
                      bodyArray,
                      fx.targetFolder.tree,
                      fx.getAbsoluteAddress(dataTreeTreeItem.source)
                    );
                  } else {
                    if (dataTreeTreeItem.source) {
                      fx.getLibraryBody(
                        bodyArray,
                        fx.targetFolder.tree,
                        fx.getAbsoluteAddress(dataTreeTreeItem.source)
                      );
                    } else {
                      fx.getLibraryBody(
                        bodyArray,
                        fx.targetFolder.tree,
                        fx.getAbsoluteAddress(dataTreeTreeItem)
                      );
                    }
                  }

                  let bodydataVar = bodyArray[0];
                  let bodydataView = fx.createVariableBody(
                    bodyView,
                    bodydataVar
                  );
                  bodydataView.enemyFlag = dataTreeTreeItem.enemy;
                  bodydataView.funcType = dataTreeTreeItem.funcType;
                  if (bodydataView.funcType == undefined)
                    bodydataView.funcType = 0;
                  if (dataTreeTreeItem.type == NodeType.Sheet)
                    bodydataView.selectedOutputInfo =
                      dataTreeTreeItem.selectedOutputInfo
                        ? JSON.parse(dataTreeTreeItem.selectedOutputInfo)
                        : "";
                  bodydataView.statistics = dataTreeTreeItem.statistics;
                  bodydataView.upDateValue = dataTreeTreeItem.upDateValue;
                  bodydataView.demoteValue = dataTreeTreeItem.demoteValue;
                  fx.symbolicLink(bodydataView, dataTreeTreeItem.operator);
                  fx.Call.send(
                    fx.Eve.SHIFT_SHOW_VIEW,
                    [bodydataView, dataTreeTreeItem.operator, stageShow],
                    null
                  );
                }
              }
              fx.Call.send(
                fx.Eve.SHIFT_SHOW_VIEW_ON,
                [bodyView, stageShow],
                null
              );
            }
          } else if (
            dataTreeItem.type == NodeType.SymbolBody ||
            dataTreeItem.type == "符号运算体类"
          ) {
            var bodyView = fx.createSymbolBody(
              null,
              null,
              dataTreeItem.operator,
              dataTreeItem.isFunctionId,
              dataTreeItem.isWeight,
              dataTreeItem.funcType
            );
            bodyView.isBindingOperation = fx.getIsBoundOutput(
              dataTreeItem,
              restriction
            );
            fx.operationBindBody(bodyView);
            if (bodyView.view != null) {
              // bodyView.view.layerGroup.setX(
              //   fx.coordinate(dataTreeItem, restriction)[0]
              // );
              // bodyView.view.layerGroup.setY(
              //   fx.coordinate(dataTreeItem, restriction)[1]
              // );
              bodyView.view.setX(fx.coordinate(dataTreeItem, restriction)[0]);
              bodyView.view.setY(fx.coordinate(dataTreeItem, restriction)[1]);
            }

            fx.loopGenerateBody(bodyView, dataTreeItem.tree, stageShow);
            fx.addBody(symbolBody, bodyView, false);
            fx.Call.send(
              fx.Eve.SHIFT_SHOW_VIEW_ON,
              [bodyView, stageShow],
              null
            );
          }
        }
        fx.Call.send(fx.Eve.SHIFT_SHOW_VIEW_ON, [symbolBody, stageShow], null);
        if (dataItem.isFormula) {
          var formulaData = new fx.FormulaData(
            dataItem.formulaName,
            dataItem.formulaX,
            dataItem.formulaY
          );
          formulaData.body = symbolBody;
          if (formulaData.body) {
            formulaData.body.isBindingFormula = true;
          }
          symbolBody.formulaBody = formulaData;

          fx.Call.send(
            fx.Eve.SHIFT_ADD_FORMULA,
            [formulaData, symbolBody.view, stageShow],
            null
          );
        }
      } else if (dataItem.type == NodeType.Bookmark) {
        var bodyView = fx.createBookmark(
          dataItem.x,
          dataItem.y,
          dataItem.width,
          dataItem.height,
          dataItem.text
        );
        fx.Call.send(fx.Eve.SHIFT_SHOW_VIEW_ON, [bodyView, stageShow], null);
      }
    }
    return rootDirectory;
  };

  static amendMacros = function (body: any): any {
    if (body.macros == null) {
      return body.macro;
    }
    return body.macros;
  };

  /**
   * 修正小数点
   * @param value
   * @param type
   * @returns {number}
   */
  static fixedDecimal = function (value: number, type: number): number {
    switch (type) {
      case 0:
        return Math.round(value);
      case 1:
        return Math.round(value * 10) / 10;
      case 2:
        return Math.round(value * 100) / 100;
      case 3:
        return Math.round(value * 1000) / 1000;
      case 4:
        return Math.round(value * 10000) / 10000;
    }
    return 0;
  };

  static currencyConversion = function (value: number): number[] {
    const copperCoin = value % 100;
    const silverCoin = parseInt(String((value / 100) % 100));
    let goldCoin = 0;
    if (value < 100000) {
      goldCoin = parseInt(String((value / 100 / 100) % 100));
    } else {
      goldCoin = parseInt(String(value / 100 / 100));
    }
    return [goldCoin, silverCoin, copperCoin];
  };

  /**
   * 替换变量字段
   * @param parent
   * @param clickBody
   * @returns {*}
   */
  static replaceVariableBody = function (
    parent: any,
    clickBody: any,
    index: number
  ): any {
    const body = clickBody.copy();
    parent.replace(body, index);
    let backView = null;
    fx.Call.send(
      fx.Eve.SHIFT_ADD_VARIABLEBODY,
      [parent, body],
      function (e) {
        backView = e;
      }.bind(this)
    );
    return body;
  };

  /**
   * 创建变量字段
   * @param parent
   * @param clickBody
   * @returns {*}
   */
  static createVariableBody = function (parent: any, clickBody: any): any {
    const body = clickBody.copy();
    parent.addBody(body);
    let backView = null;
    fx.Call.send(
      fx.Eve.SHIFT_ADD_VARIABLEBODY,
      [parent, body],
      function (e) {
        backView = e;
      }.bind(this)
    );
    return body;
  };

  /**
   * 创建宏变量
   * @param parent
   * @param clickBody
   * @returns {*}
   */
  static createFunctionBody = function (parent: any, clickBody: any): any {
    const body = clickBody.copy();
    parent.addBody(body);
    let backView = null;
    fx.Call.send(
      fx.Eve.SHIFT_ADD_FUNCTION,
      [parent, body],
      function (e) {
        backView = e;
      }.bind(this)
    );
    return body;
  };

  /**
   * 替换宏变量
   * @param parent
   * @param clickBody
   * @returns {*}
   */
  static replaceFunctionBody = function (
    parent: any,
    clickBody: any,
    index: number
  ): any {
    const body = clickBody.copy();
    parent.replace(body, index);
    let backView = null;
    fx.Call.send(
      fx.Eve.SHIFT_ADD_FUNCTION,
      [parent, body],
      function (e) {
        backView = e;
      }.bind(this)
    );
    return body;
  };

  /**
   * 生成运算体/函数体
   * @param x
   * @param y
   * @param type
   * @returns {*}
   */
  static createOperationBody = function (
    x: number,
    y: number,
    type: number,
    isWeight: boolean,
    isAdvance: boolean,
    funcType: any
  ): any {
    const body = new fx.OperationBody();
    body.isFunction = !!type;
    fx.targetStoragePool.push(body);
    body.isWeight = isWeight;
    body.isAdvance = isAdvance;
    body.funcType = funcType;
    if (body.funcType == undefined || body.funcType == null) body.funcType = 0;
    body.x = x;
    body.y = y;
    let backView = null;
    fx.Call.send(
      fx.Eve.SHIFT_ADD_OPERATIONBODY,
      [x, y, type, body],
      function (e) {
        backView = e;
        if (isWeight && backView) {
          (backView as any).openWeight();
        }
        if (isAdvance && backView) {
          (backView as any).openAdvance();
        }
      }.bind(this)
    );
    return body;
  };

  /**
   * 生成书签
   * @param x
   * @param y
   * @param type
   * @returns {*}
   */
  static createBookmark = function (
    x: number,
    y: number,
    width: number,
    height: number,
    text: string
  ): any {
    const body = new fx.Bookmark();
    body.x = x;
    body.y = y;
    body.width = width;
    body.id = ++Eve.IDINDEX;
    if (body.width == null) {
      body.width = 256;
    }
    body.height = height;
    if (body.height == null) {
      body.height = 256;
    }
    body.text = text;
    fx.targetStoragePool.push(body);
    let backView = null;
    fx.Call.send(
      fx.Eve.SHIFT_ADD_BOOKMARK,
      [body],
      function (e) {
        backView = e;
      }.bind(this)
    );
    return body;
  };

  /**
   * 生成符号体
   * @param lbody
   * @param rbody
   * @param symbol
   * @param fid
   * @returns {*}
   */
  static createSymbolBody = function (
    lbody: any,
    rbody: any,
    symbol: any,
    fid: number,
    isWeight: boolean,
    funcType: any
  ): any {
    const body = new fx.SymbolBody();
    body.isWeight = isWeight;
    body.isFunctionId = fid;
    body.funcType = funcType;
    if (body.funcType == undefined || body.funcType == null) body.funcType = 0;
    body.operator = symbol;
    if (body.isFunctionId == null) {
      body.isFunctionId = 1;
    }

    if (lbody != null) {
      body.addBody(lbody);
    }
    if (rbody != null) {
      body.addBody(rbody);
    }
    fx.targetStoragePool.push(body);

    fx.Call.send(
      fx.Eve.SHIFT_ADD_SYMBOLBODY,
      [lbody, rbody, symbol, fid, body],
      null
    );

    return body;
  };

  /**
   * 运算层绑定运算体操作
   * @param body
   */
  static operationBindBody = function (body: any): void {
    if (body.isBindingOperation) {
      if (fx.editBody != null) {
        fx.editBody.body = body;
      }
    }
  };

  /**
   * 添加运算体
   * @param parentBody
   * @param body
   * @param coord
   */
  static addBody = function (parentBody: any, body: any, coord: boolean): void {
    fx.Call.send(fx.Eve.ADD_OPERAND_DATA, [parentBody, body, coord], null);
  };

  /**
   * 字段菜单操作
   * @param body
   * @param operator
   */
  static symbolicLink = function (body: any, operator: string): void {
    if (operator == null) return;
    if (operator == "删除符号") {
    } else if (operator == "删除运算体") {
    } else if (operator == "导出公式") {
    } else if (operator == "敌方标记") {
    } else {
      body.operator = operator;
    }
  };

  static loopGenerateBody = function (
    parent: any,
    tree: any[],
    stageShow: any
  ): void {
    for (let i = 0; i < tree.length; i++) {
      const treeItem = tree[i];
      switch (treeItem.type) {
        case "OperationBody":
          if (treeItem.isFunction) {
            var operationBody = fx.createOperationBody(
              fx.coordinate(tree[i])[0],
              fx.coordinate(tree[i])[1],
              1,
              treeItem.isWeight,
              treeItem.isAdvance,
              treeItem.funcType
            );
            operationBody.isBindingOperation = fx.getIsBoundOutput(tree[i]);
            fx.operationBindBody(operationBody);
            fx.addBody(parent, operationBody, false);

            for (var n = 0; n < treeItem.tree.length; n++) {
              const treeTreeItem = treeItem.tree[n];
              if (treeTreeItem.type == NodeType.Macro) {
                var bodydata = new fx.VariableValue(
                  treeTreeItem.name,
                  null,
                  treeTreeItem.type
                );
                (bodydata as any).TID = treeTreeItem.TID;
                if ((bodydata as any).TID == undefined) {
                  (bodydata as any).TID =
                    new Date().getTime() + fx.functionAddIndex;
                  fx.functionAddIndex++;
                }
                let bodydataView = fx.createFunctionBody(
                  operationBody,
                  bodydata
                );
                bodydataView.macros = fx.amendMacros(treeTreeItem);
                bodydataView.enemyFlag = treeTreeItem.enemy;
                bodydataView.funcType = treeTreeItem.funcType;
                if (bodydataView.funcType == undefined)
                  bodydataView.funcType = 0;
                bodydataView.statistics = treeTreeItem.statistics;
                bodydataView.upDateValue = treeTreeItem.upDateValue;
                bodydataView.demoteValue = treeTreeItem.demoteValue;
                fx.symbolicLink(bodydataView, treeTreeItem.operator);
                fx.clickBody = bodydataView;
                fx.Call.send(
                  fx.Eve.SHIFT_SHOW_VIEW,
                  [bodydataView, treeTreeItem.operator, stageShow],
                  null
                );
              } else if (
                [
                  NodeType.LogicalBasic,
                  NodeType.LogicalBool,
                  NodeType.LogicalSlider,
                ].includes(treeTreeItem.type)
              ) {
                var bodydata = new fx.VariableValue(
                  treeTreeItem.name,
                  treeTreeItem.value,
                  treeTreeItem.type
                );
                (bodydata as any).TID = treeTreeItem.TID;
                if ((bodydata as any).TID == undefined) {
                  (bodydata as any).TID =
                    new Date().getTime() + fx.functionAddIndex;
                  fx.functionAddIndex++;
                }
                let bodydataView = fx.createFunctionBody(operationBody, bodydata);

                bodydataView.enemyFlag = treeTreeItem.enemy;
                bodydataView.funcType = treeTreeItem.funcType;

                if (bodydataView.funcType == undefined)
                  bodydataView.funcType = 0;
                if (treeTreeItem.type == NodeType.Sheet)
                  bodydataView.selectedOutputInfo =
                    treeTreeItem.selectedOutputInfo
                      ? JSON.parse(treeTreeItem.selectedOutputInfo)
                      : "";
                bodydataView.statistics = treeTreeItem.statistics;
                bodydataView.upDateValue = treeTreeItem.upDateValue;
                bodydataView.demoteValue = treeTreeItem.demoteValue;
                bodydataView.isLogicalOpen = treeTreeItem.isLogicalOpen;
                bodydataView.isDragging = treeTreeItem.isDragging;
                bodydataView.snNo = treeTreeItem.snNo;
                bodydataView.logicalNumberList = treeTreeItem.logicalNumberList;
                bodydataView.currentStep = treeTreeItem.currentStep;
                bodydataView.snNo = treeTreeItem.snNo;
                bodydataView.minValue = treeTreeItem.minValue;
                bodydataView.maxValue = treeTreeItem.maxValue;
                bodydataView.step = treeTreeItem.step;
                bodydataView.logicalChildArray = [];
                treeTreeItem.logicalChildArray.forEach((variable) => {
                  const bodyArray = [];
                  fx.getLibraryBody(
                    bodyArray,
                    fx.targetFolder.tree,
                    fx.getAbsoluteAddress(variable)
                  );
                  const bodydataCp = bodyArray[0] as any;
                  const bodydataViewCp = (bodydataCp as any).copy();

                  bodydataViewCp.enemyFlag = treeTreeItem.enemy;
                  bodydataViewCp.funcType = treeTreeItem.funcType;
                  if (bodydataViewCp.funcType == undefined)
                    bodydataViewCp.funcType = 0;
                  bodydataViewCp.statistics = treeTreeItem.statistics;
                  bodydataViewCp.upDateValue = treeTreeItem.upDateValue;
                  bodydataViewCp.demoteValue = treeTreeItem.demoteValue;
                  bodydataView.logicalChildArray.push(bodydataViewCp);
                });

                fx.symbolicLink(bodydataView, treeTreeItem.operator);
                fx.Call.send(
                  fx.Eve.SHIFT_SHOW_VIEW,
                  [bodydataView, treeTreeItem.operator, stageShow],
                  null
                );
              } else {
                var bodyArray = [];
                fx.getLibraryBody(
                  bodyArray,
                  fx.targetFolder.tree,
                  fx.getAbsoluteAddress(treeTreeItem)
                );
                let bodydataVar = bodyArray[0] as any;
                let bodydataView = fx.createVariableBody(
                  operationBody,
                  bodydataVar
                );
                bodydataView.enemyFlag = treeTreeItem.enemy;
                bodydataView.funcType = treeTreeItem.funcType;
                if (bodydataView.funcType == undefined)
                  bodydataView.funcType = 0;
                if (treeTreeItem.type == NodeType.Sheet)
                  bodydataView.selectedOutputInfo =
                    treeTreeItem.selectedOutputInfo
                      ? JSON.parse(treeTreeItem.selectedOutputInfo)
                      : "";
                bodydataView.statistics = treeTreeItem.statistics;
                bodydataView.upDateValue = treeTreeItem.upDateValue;
                bodydataView.demoteValue = treeTreeItem.demoteValue;
                fx.symbolicLink(bodydataView, treeTreeItem.operator);
                fx.Call.send(
                  fx.Eve.SHIFT_SHOW_VIEW,
                  [bodydataView, treeTreeItem.operator, stageShow],
                  null
                );
              }
            }
            fx.Call.send(
              fx.Eve.SHIFT_SHOW_VIEW_ON,
              [operationBody, stageShow],
              null
            );
          } else {
            var operationBody = fx.createOperationBody(
              fx.coordinate(tree[i])[0],
              fx.coordinate(tree[i])[1],
              0,
              treeItem.isWeight,
              treeItem.isAdvance,
              treeItem.funcType
            );

            operationBody.isBindingOperation = fx.getIsBoundOutput(tree[i]);
            fx.operationBindBody(operationBody);
            fx.addBody(parent, operationBody, false);

            for (var n = 0; n < treeItem.tree.length; n++) {
              const treeTreeItem = treeItem.tree[n];
              if (treeTreeItem.type == NodeType.Macro) {
                var bodydata = new fx.VariableValue(
                  treeTreeItem.name,
                  null,
                  treeTreeItem.type
                );
                (bodydata as any).TID = treeTreeItem.TID;
                if ((bodydata as any).TID == undefined) {
                  (bodydata as any).TID =
                    new Date().getTime() + fx.functionAddIndex;
                  fx.functionAddIndex++;
                }
                let bodydataView = fx.createFunctionBody(
                  operationBody,
                  bodydata
                );
                bodydataView.setMacros(fx.amendMacros(treeTreeItem));
                bodydataView.enemyFlag = treeTreeItem.enemy;
                bodydataView.funcType = treeTreeItem.funcType;
                if (bodydataView.funcType == undefined)
                  bodydataView.funcType = 0;
                bodydataView.statistics = treeTreeItem.statistics;
                bodydataView.upDateValue = treeTreeItem.upDateValue;
                bodydataView.demoteValue = treeTreeItem.demoteValue;
                fx.symbolicLink(bodydataView, treeTreeItem.operator);
                fx.Call.send(
                  fx.Eve.SHIFT_SHOW_VIEW,
                  [bodydataView, treeTreeItem.operator, stageShow],
                  null
                );
              }else if (
                [
                  NodeType.LogicalBasic,
                  NodeType.LogicalBool,
                  NodeType.LogicalSlider,
                ].includes(treeTreeItem.type)
              ) {
                var bodydata = new fx.VariableValue(
                  treeTreeItem.name,
                  treeTreeItem.value,
                  treeTreeItem.type
                );
                (bodydata as any).TID = treeTreeItem.TID;
                if ((bodydata as any).TID == undefined) {
                  (bodydata as any).TID =
                    new Date().getTime() + fx.functionAddIndex;
                  fx.functionAddIndex++;
                }
                let bodydataView = fx.createFunctionBody(operationBody, bodydata);

                bodydataView.enemyFlag = treeTreeItem.enemy;
                bodydataView.funcType = treeTreeItem.funcType;

                if (bodydataView.funcType == undefined)
                  bodydataView.funcType = 0;
                if (treeTreeItem.type == NodeType.Sheet)
                  bodydataView.selectedOutputInfo =
                    treeTreeItem.selectedOutputInfo
                      ? JSON.parse(treeTreeItem.selectedOutputInfo)
                      : "";
                bodydataView.statistics = treeTreeItem.statistics;
                bodydataView.upDateValue = treeTreeItem.upDateValue;
                bodydataView.demoteValue = treeTreeItem.demoteValue;
                bodydataView.isLogicalOpen = treeTreeItem.isLogicalOpen;
                bodydataView.isDragging = treeTreeItem.isDragging;
                bodydataView.snNo = treeTreeItem.snNo;
                bodydataView.logicalNumberList = treeTreeItem.logicalNumberList;
                bodydataView.currentStep = treeTreeItem.currentStep;
                bodydataView.snNo = treeTreeItem.snNo;
                bodydataView.minValue = treeTreeItem.minValue;
                bodydataView.maxValue = treeTreeItem.maxValue;
                bodydataView.step = treeTreeItem.step;
                bodydataView.logicalChildArray = [];
                treeTreeItem.logicalChildArray.forEach((variable) => {
                  const bodyArray = [];
                  fx.getLibraryBody(
                    bodyArray,
                    fx.targetFolder.tree,
                    fx.getAbsoluteAddress(variable)
                  );
                  const bodydataCp = bodyArray[0] as any;
                  const bodydataViewCp = (bodydataCp as any).copy();

                  bodydataViewCp.enemyFlag = treeTreeItem.enemy;
                  bodydataViewCp.funcType = treeTreeItem.funcType;
                  if (bodydataViewCp.funcType == undefined)
                    bodydataViewCp.funcType = 0;
                  bodydataViewCp.statistics = treeTreeItem.statistics;
                  bodydataViewCp.upDateValue = treeTreeItem.upDateValue;
                  bodydataViewCp.demoteValue = treeTreeItem.demoteValue;
                  bodydataView.logicalChildArray.push(bodydataViewCp);
                });

                fx.symbolicLink(bodydataView, treeTreeItem.operator);
                fx.Call.send(
                  fx.Eve.SHIFT_SHOW_VIEW,
                  [bodydataView, treeTreeItem.operator, stageShow],
                  null
                );
              } else {
                var bodyArray = [];
                fx.getLibraryBody(
                  bodyArray,
                  fx.targetFolder.tree,
                  fx.getAbsoluteAddress(treeTreeItem)
                );
                let bodydataVar = bodyArray[0] as any;
                let bodydataView = fx.createVariableBody(
                  operationBody,
                  bodydataVar
                );
                bodydataView.enemyFlag = treeTreeItem.enemy;
                bodydataView.funcType = treeTreeItem.funcType;
                if (bodydataView.funcType == undefined)
                  bodydataView.funcType = 0;
                if (treeTreeItem.type == NodeType.Sheet)
                  bodydataView.selectedOutputInfo =
                    treeTreeItem.selectedOutputInfo
                      ? JSON.parse(treeTreeItem.selectedOutputInfo)
                      : "";
                bodydataView.statistics = treeTreeItem.statistics;
                bodydataView.upDateValue = treeTreeItem.upDateValue;
                bodydataView.demoteValue = treeTreeItem.demoteValue;
                fx.symbolicLink(bodydataView, treeTreeItem.operator);
                fx.Call.send(
                  fx.Eve.SHIFT_SHOW_VIEW,
                  [bodydataView, treeTreeItem.operator, stageShow],
                  null
                );
              }
            }
            fx.Call.send(
              fx.Eve.SHIFT_SHOW_VIEW_ON,
              [operationBody, stageShow],
              null
            );
          }

          break;
        case "SymbolBody":
          var symbolBody = fx.createSymbolBody(
            null,
            null,
            treeItem.operator,
            treeItem.isFunctionId,
            treeItem.isWeight,
            treeItem.funcType
          );
          symbolBody.isBindingOperation = fx.getIsBoundOutput(tree[i]);
          fx.operationBindBody(symbolBody);
          if (symbolBody.view != null) {
            // symbolBody.view.layerGroup.setX(fx.coordinate(tree[i])[0]);
            // symbolBody.view.layerGroup.setY(fx.coordinate(tree[i])[1]);
            symbolBody.view.setX(fx.coordinate(tree[i])[0]);
            symbolBody.view.setY(fx.coordinate(tree[i])[1]);
          }
          fx.loopGenerateBody(symbolBody, treeItem.tree, stageShow);
          fx.addBody(parent, symbolBody, false);
          fx.Call.send(
            fx.Eve.SHIFT_SHOW_VIEW_ON,
            [symbolBody, stageShow],
            null
          );
          break;
      }
    }
  };

  static saveFXTree = function (tree: any[], codeobj: any[]): void {
    if (tree != null)
      for (let i = 0; i < tree.length; i++) {
        const treeItem = tree[i];
        if (treeItem.type == NodeType.Macro) {
          const code = {
            TID: treeItem.TID,
            name: treeItem.name,
            code: treeItem.macros,
          };
          codeobj.push(code);
        } else {
          fx.saveFXTree(treeItem.tree, codeobj);
        }
      }
  };

  static recursiveStorage = function (array: any, codeobj: any[]): void {
    if (array.operationArray != null) {
      for (let i = 0; i < array.operationArray.length; i++) {
        const arrayOperationItem = array.operationArray[i];
        if (arrayOperationItem.tree != null) {
          for (let j = 0; j < arrayOperationItem.tree.length; j++) {
            const arrayOperationItemTreeItem = arrayOperationItem.tree[j];
            if (arrayOperationItemTreeItem.type == NodeType.Macro) {
              const code = {
                TID: arrayOperationItemTreeItem.TID,
                name: arrayOperationItemTreeItem.name,
                code: arrayOperationItemTreeItem.macros,
              };
              codeobj.push(code);
            } else {
              fx.saveFXTree(arrayOperationItemTreeItem.tree, codeobj);
            }
          }
        }
        if (arrayOperationItem.operationArray != null)
          fx.recursiveStorage(arrayOperationItem, codeobj);
      }
    }
  };

  /**
   * 初始化系统
   * 启动 FX 引擎核心功能
   */
  static init = function (): void {
    try {
      if (fx.isStart === false) {
        fx.isStart = true;
        fx.code = true;

        // 初始化战斗中心
        new fx.FXCentre();

        // 注释掉的库体创建和解析功能
        // fx.createLibraryBody(fx_json_data.library.operationArray, true);
        // fx.parseLibraryBody(fx_json_data.library.operationArray, true);
      }
    } catch (error) {
      console.error("Error initializing FX system:", error);
      fx.isStart = false;
      fx.code = false;
    }
  };

  /**
   * 递归读取数据
   * 遍历对象树结构，分类收集不同类型的数据
   * @param obj 要遍历的对象
   * @param valist 变量列表
   * @param lflist 层列表
   * @param brlist 看板列表
   */
  static recursiveDataReading(
    obj: any,
    valist: any[],
    lflist: any[],
    brlist: any[]
  ): void {
    try {
      if (!obj || !obj.tree || !Array.isArray(obj.tree)) {
        throw new Error("Invalid object structure for recursive reading");
      }

      for (let i = 0; i < obj.tree.length; i++) {
        const objTreeItem = obj.tree[i];
        if (objTreeItem != null) {
          if (objTreeItem.isFolder) {
            this.recursiveDataReading(objTreeItem, valist, lflist, brlist);
          } else if (objTreeItem.type == NodeType.Variable) {
            valist.push(objTreeItem);
          } else if (objTreeItem.type == NodeType.CalculationLayer) {
            lflist.push(objTreeItem);
          } else if (objTreeItem instanceof fx.BillboardLayer) {
            brlist.push(objTreeItem);
          }
        }
      }
    } catch (error) {
      console.error("Error in recursive data reading:", error);
    }
  }
}
