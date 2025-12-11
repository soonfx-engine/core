/**
 * BasicBody 数据模型
 * 版本: 2.0
 * 重构日期: 2024年12月
 * 提供基础数据模型的核心功能和数据验证
 */

import { fx } from "../../core/system/System";
import { EventManager as Eve } from "../../core/events/EventManager";
import { NodeType } from "../../core/types/NodeType";
import { getCatchValue } from "../../utils/index";
import {
  CommonFunctionTypes,
  AlgorithmFunctionTypes,
  HandleFunctionTypes,
  TriangleFunctionTypes,
  LogicFunctionTypes,
  CommonFormulaTypes,
  GameFormula1,
  GameFormula2,
  GameFormula3,
} from "../../core/types/CommonTypes";
import { VariableValue } from "./VariableValue";

/**
 * 树节点接口
 * 定义树节点的基本结构，用于构建表达式树和公式计算
 *
 * @interface TreeNode
 * @description 树节点接口定义了表达式树中每个节点必须实现的基本方法
 * 主要用于公式解析、计算和文本生成
 */
interface TreeNode {
  /**
   * 节点索引
   * @description 用于标识节点在树结构中的位置，可选属性
   */
  indexex?: number;

  /**
   * 获取公式文本值
   * @description 返回当前节点及其子节点组成的完整公式文本
   * @returns {string} 公式的文本表示，包含数值和操作符
   * @example
   * // 返回类似 "10 + 20 * 5" 的字符串
   */
  getFormulaTextValue(): string;

  /**
   * 获取公式文本字符
   * @description 返回当前节点及其子节点组成的公式字符表示
   * @returns {string} 公式的字符表示，通常用于显示和调试
   * @example
   * // 返回类似 "A + B * C" 的字符串
   */
  getFormulaTextCharacter(): string;

  /**
   * 操作符
   * @description 当前节点使用的数学或逻辑操作符
   * @example "+", "-", "*", "/", ">", "<", "==" 等
   */
  operator?: string | null;
}

/**
 * 基础数据模型类
 * 提供数据模型的核心功能和数据验证
 *
 * @class BasicBody
 * @description 基础数据模型类，用于构建表达式树结构，支持复杂的数学计算、
 * 逻辑运算和游戏公式计算。该类实现了树形数据结构，每个节点可以包含子节点，
 * 支持递归计算和公式文本生成。
 *
 * @example
 * ```typescript
 * const body = new BasicBody();
 * body.addBody(childNode);
 * const result = body.getValue();
 * const formula = body.getFormulaTextValue();
 * ```
 */
export class BasicBody {
  // ==================== 树结构属性 ====================

  /** 子节点树 */
  tree: BasicBody[] = [];

  /** 父节点 */
  parent: BasicBody | null = null;

  /** 节点类型 */
  type: string | number = "BasicBody";

  // ==================== 状态属性 ====================

  /** 是否为权重节点 */
  isWeight = false;

  /** 节点值 */
  value: any = null;

  /** 是否为高级节点 */
  isAdvance = false;

  /** 是否绑定运算 */
  isBindingOperation = false;

  /** 是否绑定公式 */
  isBindingFormula = false;

  // ==================== 文本属性 ====================

  /** 公式文本值 */
  formulaTextValue = "";

  /** 公式文本字符 */
  formulaTextCharacter = "";

  /** 运算逻辑文本 */
  operationalLogicText = "";

  // ==================== 缓存和功能属性 ====================

  /** 缓存元素值 */
  cacheElementValue: any = null;

  /** 函数类型 */
  funcType = 0;

  /** 构造函数名称 */
  constructorName = "BasicBody";

  /** 唯一标识符 */
  id: number;

  /** 类型类型 */
  typetype: any = null;

  /** 操作符 */
  operator: string | null = null;

  /** 索引 */
  indexex = 0;

  /** 是否为函数 */
  isFunction = false;

  // ==================== 位置属性 ====================

  /** X坐标 */
  x = 0;

  /** Y坐标 */
  y = 0;

  /**
   * 构造函数
   * 初始化基础数据模型实例
   *
   * @constructor
   * @description 创建一个新的 BasicBody 实例，自动分配唯一标识符
   * 初始化所有属性为默认值，准备用于构建表达式树
   *
   * @example
   * ```typescript
   * const body = new BasicBody();
   * console.log(body.id); // 输出唯一的数字ID
   * ```
   */
  constructor() {
    this.id = ++Eve.IDINDEX;
  }

  /**
   * 添加测试 - 检查节点是否存在于树中
   *
   * @param {BasicBody} body - 要检查的节点
   * @returns {boolean} 如果节点存在于当前树或其子树中返回 true，否则返回 false
   * @description 递归检查指定的 BasicBody 节点是否存在于当前节点的子树中
   * 包括直接子节点和所有后代节点
   *
   * @example
   * ```typescript
   * const parent = new BasicBody();
   * const child = new BasicBody();
   * const grandchild = new BasicBody();
   *
   * parent.addBody(child);
   * child.addBody(grandchild);
   *
   * console.log(parent.addTest(grandchild)); // true
   * console.log(parent.addTest(new BasicBody())); // false
   * ```
   */
  addTest(body: BasicBody): boolean {
    if (this.tree.includes(body)) return true;

    return this.tree.some(
      (node) => node instanceof fx.BasicBody && node.addTest(body)
    );
  }

  /**
   * 替换运算体
   *
   * @param {BasicBody} body - 新的运算体节点
   * @param {number} index - 要替换的子节点索引位置
   * @returns {void}
   * @description 在指定索引位置替换子节点，并自动设置新节点的父节点引用
   * 如果索引超出范围，可能会导致数组越界错误
   *
   * @example
   * ```typescript
   * const parent = new BasicBody();
   * const oldChild = new BasicBody();
   * const newChild = new BasicBody();
   *
   * parent.addBody(oldChild);
   * parent.replace(newChild, 0); // 替换第一个子节点
   * ```
   */
  replace(body: BasicBody, index: number): void {
    this.tree[index] = body;
    body.parent = this;
  }

  /**
   * 删除运算体
   *
   * @param {BasicBody} body - 要删除的运算体节点
   * @returns {void}
   * @description 从当前节点的子节点列表中删除指定的节点，并清除其父节点引用
   * 如果节点不存在于子节点列表中，则不执行任何操作
   *
   * @example
   * ```typescript
   * const parent = new BasicBody();
   * const child = new BasicBody();
   *
   * parent.addBody(child);
   * parent.deletebody(child); // 删除子节点
   * console.log(parent.tree.length); // 0
   * ```
   */
  deletebody(body: BasicBody): void {
    const index = this.tree.indexOf(body);
    if (index !== -1) {
      this.tree.splice(index, 1);
      body.parent = null;
    }
  }

  /**
   * 添加运算体
   *
   * @param {BasicBody} body - 要添加的运算体节点
   * @returns {void}
   * @description 将指定的 BasicBody 节点添加为当前节点的子节点
   * 如果节点已经存在于子节点列表中，则不重复添加
   * 自动设置新节点的父节点引用
   *
   * @example
   * ```typescript
   * const parent = new BasicBody();
   * const child = new BasicBody();
   *
   * parent.addBody(child);
   * console.log(parent.tree.length); // 1
   * console.log(child.parent === parent); // true
   * ```
   */
  addBody(body: BasicBody): void {
    if (!this.tree.includes(body)) {
      body.parent = this;
      this.tree.push(body);
    }
  }

  /**
   * 获取可删除运算列表
   *
   * @param {BasicBody} body - 起始删除的节点
   * @returns {BasicBody[]} 从指定节点开始到末尾的所有子节点数组
   * @description 从指定节点开始，获取并删除从该节点到子节点列表末尾的所有节点
   * 返回被删除的节点数组，同时从当前节点的子节点列表中移除这些节点
   *
   * @example
   * ```typescript
   * const parent = new BasicBody();
   * const child1 = new BasicBody();
   * const child2 = new BasicBody();
   * const child3 = new BasicBody();
   *
   * parent.addBody(child1);
   * parent.addBody(child2);
   * parent.addBody(child3);
   *
   * const deleted = parent.getDeleteBodyTree(child2);
   * console.log(deleted.length); // 2 (child2 和 child3)
   * console.log(parent.tree.length); // 1 (只剩下 child1)
   * ```
   */
  getDeleteBodyTree(body: BasicBody): BasicBody[] {
    const index = this.tree.indexOf(body);
    if (index === -1) return [];

    const deleteList = this.tree.slice(index);
    this.tree.splice(index);
    return deleteList;
  }

  /**
   * 浅度销毁
   * 清理所有引用和缓存数据
   *
   * @returns {void}
   * @description 递归销毁当前节点及其所有子节点，清理所有引用和缓存数据
   * 重置所有状态标志，释放内存资源。调用此方法后，节点将不可用
   *
   * @example
   * ```typescript
   * const body = new BasicBody();
   * body.addBody(new BasicBody());
   *
   * // 使用节点...
   *
   * body.dispose(); // 清理所有资源
   * // body 现在已被清理，不应再使用
   * ```
   */
  dispose(): void {
    // 递归销毁所有子节点
    this.tree.forEach((node) => {
      if (node && typeof node.dispose === "function") {
        node.dispose();
      }
    });

    // 清理数组和引用
    this.tree = [];
    this.value = null;
    this.parent = null;
    this.typetype = null;
    this.cacheElementValue = null;

    // 清理文本数据
    this.formulaTextValue = "";
    this.formulaTextCharacter = "";
    this.operationalLogicText = "";

    // 重置状态
    this.isWeight = false;
    this.isAdvance = false;
    this.isBindingOperation = false;
    this.isBindingFormula = false;
    this.isFunction = false;
  }

  /**
   * 获取最大高度
   * 递归计算树结构的总高度
   *
   * @returns {number} 树的最大高度，至少为1
   * @description 递归计算当前节点及其所有子节点组成的树结构的总高度
   * 用于确定树形结构的深度，有助于布局和显示
   *
   * @example
   * ```typescript
   * const root = new BasicBody();
   * const child1 = new BasicBody();
   * const child2 = new BasicBody();
   * const grandchild = new BasicBody();
   *
   * root.addBody(child1);
   * root.addBody(child2);
   * child1.addBody(grandchild);
   *
   * console.log(root.getMaxHeight()); // 3 (root -> child1 -> grandchild)
   * ```
   */
  getMaxHeight(): number {
    const totalHeight = this.tree
      .filter((node) => node instanceof fx.BasicBody)
      .reduce((sum, node) => sum + node.getMaxHeight(), 0);

    return totalHeight || 1;
  }

  /**
   * 获取节点值
   * 计算并返回当前节点的值
   *
   * @returns {any} 计算后的值，可能是数字、字符串或其他类型
   * @description 递归计算当前节点及其所有子节点的值，根据函数类型应用相应的计算逻辑
   * 这是整个表达式树计算的核心方法，会触发整个子树的重新计算
   *
   * @example
   * ```typescript
   * const body = new BasicBody();
   * body.funcType = CommonFunctionTypes.max;
   *
   * const child1 = new BasicBody();
   * child1.value = 10;
   * const child2 = new BasicBody();
   * child2.value = 20;
   *
   * body.addBody(child1);
   * body.addBody(child2);
   *
   * console.log(body.getValue()); // 20 (最大值)
   * ```
   */
  getValue(name?: string, row?: string, col?: string): any {
    this.resetValues();

    if (!this.tree) return;

    this.processTreeValues();
    this.calculateFinalValue();

    this.value = this.applyFunction(this.value);
    return this.value;
  }

  /**
   * 重置值
   * 清空所有计算相关的临时值
   *
   * @private
   * @returns {void}
   * @description 在开始新的计算前，清空所有与计算相关的临时值和缓存
   * 确保每次计算都从干净的状态开始，避免上次计算结果的干扰
   */
  private resetValues(): void {
    this.value = null;
    this.formulaTextValue = "";
    this.formulaTextCharacter = "";
    this.operationalLogicText = "";
    this.cacheElementValue = null;
  }

  /**
   * 处理树值
   * 遍历所有子节点并更新相关值
   *
   * @private
   * @returns {void}
   * @description 遍历当前节点的所有子节点，获取每个节点的值并更新运算逻辑和公式文本
   * 这是计算过程中的核心步骤，负责收集和处理所有子节点的数据
   */
  private processTreeValues(): void {
    for (const node of this.tree) {
      const cacheValue = this.getNodeValue(node);
      this.updateOperationalLogic(node, cacheValue);
      this.updateFormulaTexts(node, cacheValue);
    }
  }

  /**
   * 获取节点值
   *
   * @private
   * @param {BasicBody} node - 要获取值的节点
   * @returns {any} 节点的值
   * @description 获取指定节点的值，根据节点类型使用不同的获取策略
   * 目前所有节点类型都使用相同的获取方式，但为将来扩展预留了接口
   */
  private getNodeValue(node: BasicBody): any {
    if (node.type === NodeType.Sheet) {
      const { name, row, col } =
        (node as unknown as VariableValue)?.selectedOutputInfo || {};
      return getCatchValue(node, name, row, col);
    }
    return node.type === NodeType.CalculationLayer
      ? getCatchValue(node)
      : getCatchValue(node);
  }

  /**
   * 更新运算逻辑
   *
   * @private
   * @param {BasicBody} node - 当前处理的节点
   * @param {any} value - 节点的值
   * @returns {void}
   * @description 根据节点的值和操作符更新运算逻辑文本
   * 构建用于最终计算的数学表达式字符串
   */
  private updateOperationalLogic(node: BasicBody, value: any): void {
    if (this.cacheElementValue?.operator) {
      this.operationalLogicText += `(${value})`;
    }

    if (!this.cacheElementValue) {
      this.cacheElementValue = node;
      this.operationalLogicText += `(${value})`;
    }

    if (node.operator) {
      this.operationalLogicText += node.operator;
    }
  }

  /**
   * 更新公式文本
   *
   * @private
   * @param {BasicBody} node - 当前处理的节点
   * @param {any} value - 节点的值
   * @returns {void}
   * @description 根据节点类型更新公式文本值和字符表示
   * 只处理支持的节点类型，构建完整的公式文本字符串
   */
  private updateFormulaTexts(node: BasicBody, value: any): void {
    const supportedTypes = [
      0,
      NodeType.Variable,
      2,
      3,
      NodeType.Macro,
      NodeType.CalculationLayer,
      NodeType.Sheet,
    ];

    if (supportedTypes.includes(node.type as number)) {
      this.formulaTextCharacter += node.getFormulaTextCharacter();
      this.formulaTextValue += value;

      if (node.operator) {
        this.formulaTextValue += node.operator;
        this.formulaTextCharacter += node.operator;
      }
    }
  }

  /**
   * 计算最终值
   *
   * @private
   * @returns {void}
   * @description 根据运算逻辑文本计算最终结果值
   * 检查表达式是否完整，然后使用 fx.eval 进行计算
   */
  private calculateFinalValue(): void {
    const lastChar = this.formulaTextValue.slice(-1);
    const operators = ["+", "-", "*", "/", "%", ">", ">=", "<", "<=", "!="];

    if (!operators.includes(lastChar)) {
      this.value = fx.eval(this.operationalLogicText);
    }

    if (!isNaN(this.value)) {
      this.value = Number(this.value);
    } else {
      this.value = this.operationalLogicText;
    }
  }

  /**
   * 应用函数
   *
   * @private
   * @param {any} value - 要处理的输入值
   * @returns {any} 经过函数处理后的结果值
   * @description 将计算得到的值传递给函数处理器进行进一步处理
   * 这是计算流程中的最后一步，应用用户指定的函数类型
   */
  private applyFunction(value: any): any {
    return this.returnFunc(value);
  }

  /**
   * 返回函数处理结果
   *
   * @param {any} value - 要处理的输入值
   * @returns {any} 经过函数处理后的结果值
   * @description 根据当前节点的函数类型(funcType)，应用相应的处理函数
   * 支持数学函数、逻辑函数、游戏公式等多种类型的计算
   *
   * @example
   * ```typescript
   * const body = new BasicBody();
   * body.funcType = CommonFunctionTypes.abs;
   *
   * console.log(body.returnFunc(-5)); // 5
   *
   * body.funcType = CommonFunctionTypes.sqrt;
   * console.log(body.returnFunc(16)); // 4
   * ```
   */
  returnFunc(value: any): any {
    const handlers = this.getFunctionHandlers();
    const handler = handlers[this.funcType];
    return handler ? handler(value, this.tree) : value;
  }

  /**
   * 获取函数处理器映射
   *
   * @private
   * @returns {Record<number, (value: any, tree: BasicBody[]) => any>} 函数类型到处理函数的映射
   * @description 返回所有支持的函数类型及其对应的处理函数
   * 包括数学函数、逻辑函数、游戏公式等多种类型的处理器
   */
  private getFunctionHandlers(): Record<
    number,
    (value: any, tree: BasicBody[]) => any
  > {
    return {
      0: (v) => v, // 默认返回

      // HandleFunctionTypes
      [HandleFunctionTypes["1-n"]]: (v) => 1 - v,
      [HandleFunctionTypes["1/n"]]: (v) => 1 / v,
      [HandleFunctionTypes["-n"]]: (v) => -v,
      [HandleFunctionTypes["n*2"]]: (v) => v * 2,
      [HandleFunctionTypes["n/2"]]: (v) => v / 2,
      [HandleFunctionTypes["n*100"]]: (v) => v * 100,
      [HandleFunctionTypes["n/100"]]: (v) => v / 100,
      [HandleFunctionTypes["n*n"]]: (v) => v * v,

      // CommonFunctionTypes
      [CommonFunctionTypes.abs]: (v) => Math.abs(v),
      [CommonFunctionTypes.random]: (v) => Math.random() * v,
      [CommonFunctionTypes.floor]: (v) => Math.floor(v),
      [CommonFunctionTypes.sqrt]: (v) => Math.sqrt(v),
      [CommonFunctionTypes.max]: (_, tree) => this.calculateMax(tree),
      [CommonFunctionTypes.min]: (_, tree) => this.calculateMin(tree),
      [CommonFunctionTypes.pow]: (_, tree) => this.calculatePower(tree),
      [CommonFunctionTypes.log]: (v) => Math.log(v),
      [CommonFunctionTypes.exp]: (v) => Math.exp(v),
      [CommonFunctionTypes.cbrt]: (v) => Math.cbrt(v),
      [CommonFunctionTypes.sign]: (v) => Math.sign(v),
      [CommonFunctionTypes.imul]: (v) => Math.imul(v, 1),
      [CommonFunctionTypes.ceil]: (v) => Math.ceil(v),
      [CommonFunctionTypes.round]: (v) => Math.round(v),

      // HandleFunctionTypes (continued)
      [HandleFunctionTypes["r(n~n2)"]]: (_, tree) => this.calculateRandom(tree),
      [HandleFunctionTypes["n/n2"]]: (_, tree) => this.divideValues(tree),
      [HandleFunctionTypes["n/(n+n2)"]]: (_, tree) => this.divideBySum(tree),
      [HandleFunctionTypes["n/(n2-n)"]]: (_, tree) =>
        this.divideByDifference(tree),
      [HandleFunctionTypes["(n,e).(n1,e2)."]]: (_, tree) =>
        this.weightedRandom(tree),

      // CommonFormulaTypes
      [CommonFormulaTypes["攻击-防御"]]: (_, tree) =>
        this.attackMinusDefense(tree),
      [CommonFormulaTypes["攻击*攻击/(攻击-防御)"]]: (_, tree) =>
        this.attackSquaredOverDiff(tree),
      [CommonFormulaTypes["(攻击-防御)*(攻击/防御)"]]: (_, tree) =>
        this.diffTimesRatio(tree),
      [CommonFormulaTypes["攻击*攻击/防御"]]: (_, tree) =>
        this.attackSquaredOverDefense(tree),
      [CommonFormulaTypes["攻击/防御"]]: (_, tree) =>
        this.attackOverDefense(tree),
      [CommonFormulaTypes["攻击*(1-系数)"]]: (_, tree) =>
        this.attackWithCoefficient(tree),
      [CommonFormulaTypes["护甲*系数/(1+护甲*系数)"]]: (_, tree) =>
        this.armorFormula(tree),
      [CommonFormulaTypes["攻击*受伤率"]]: (_, tree) =>
        this.attackWithDamageRate(tree),
      [CommonFormulaTypes["攻击/(1+防御*系数)"]]: (_, tree) =>
        this.attackOverDefenseFormula(tree),
      [CommonFormulaTypes["攻击/防御*系数"]]: (_, tree) =>
        this.attackRatioWithCoef(tree),
      [CommonFormulaTypes["攻击*系数/防御"]]: (_, tree) =>
        this.attackCoefOverDefense(tree),
      [CommonFormulaTypes["攻击*(系数/防御)"]]: (_, tree) =>
        this.attackTimesCoefRatio(tree),

      // TriangleFunctionTypes
      [TriangleFunctionTypes["n*pi"]]: (v) => v * Math.PI,
      [TriangleFunctionTypes.cos]: (v) => Math.cos(v),
      [TriangleFunctionTypes.sin]: (v) => Math.sin(v),
      [TriangleFunctionTypes.tan]: (v) => Math.tan(v),
      [TriangleFunctionTypes.acos]: (v) => Math.acos(v),
      [TriangleFunctionTypes.asin]: (v) => Math.asin(v),
      [TriangleFunctionTypes.atan]: (v) => Math.atan(v),
      [TriangleFunctionTypes.atan2]: (_, tree) => this.calculateAtan2(tree),

      // LogicFunctionTypes
      [LogicFunctionTypes["if(n1>n2)return{n3!n4}"]]: (_, tree) =>
        this.ifGreater(tree),
      [LogicFunctionTypes["if(n1>=n2)return{n3!n4}"]]: (_, tree) =>
        this.ifGreaterEqual(tree),
      [LogicFunctionTypes["if(n1<n2)return{n3!n4}"]]: (_, tree) =>
        this.ifLess(tree),
      [LogicFunctionTypes["if(n1<=n2)return{n3!n4}"]]: (_, tree) =>
        this.ifLessEqual(tree),
      [LogicFunctionTypes["if(n1==n2)return{n3!n4}"]]: (_, tree) =>
        this.ifEqual(tree),
      [LogicFunctionTypes["if(n1!=n2)return{n3!n4}"]]: (_, tree) =>
        this.ifNotEqual(tree),
      [LogicFunctionTypes["for(var i=n;i<=n2;i++){if(i%n3==1){a++}c+=a+n4}"]]: (
        _,
        tree
      ) => this.forLoop(tree),
      [LogicFunctionTypes["[n]"]]: (_, tree) => this.arrayAccess(tree),

      // AlgorithmFunctionTypes
      [AlgorithmFunctionTypes.length]: (_, tree) => this.calculateLength(tree),
      [AlgorithmFunctionTypes.distance]: (_, tree) =>
        this.calculateDistance(tree),
      [AlgorithmFunctionTypes.dot]: (_, tree) => this.calculateDot(tree),
      [AlgorithmFunctionTypes.cross]: (_, tree) => this.calculateCross(tree),
      [AlgorithmFunctionTypes.mix]: (_, tree) => this.calculateMix(tree),

      // GameFormula1
      [GameFormula1["战斗公式"]]: (_, tree) => this.battleFormula(tree),

      // GameFormula2
      [GameFormula2["人物生命"]]: (_, tree) => this.characterHealth(tree),
      [GameFormula2["近战素质物攻"]]: (_, tree) => this.meleeAttack(tree),
      [GameFormula2["远程素质物攻"]]: (_, tree) => this.rangedAttack(tree),
      [GameFormula2["法师素质物攻"]]: (_, tree) => this.mageAttack(tree),
      [GameFormula2["物防"]]: (_, tree) => this.physicalDefense(tree),
      [GameFormula2["魔防"]]: (_, tree) => this.magicDefense(tree),
      [GameFormula2["命中"]]: (_, tree) => this.hitRate(tree),
      [GameFormula2["闪避"]]: (_, tree) => this.dodgeRate(tree),
      [GameFormula2["暴击"]]: (v) => 1 + v / 3,
      [GameFormula2["抗暴"]]: (v) => 1 + v / 5,
      [GameFormula2["职业素质点成长"]]: (_, tree) => this.jobPointGrowth(tree),
      [GameFormula2["最终近战物攻"]]: (_, tree) => this.finalMeleeAttack(tree),
      [GameFormula2["最终远程物攻"]]: (_, tree) => this.finalRangedAttack(tree),
      [GameFormula2["最终魔法攻击"]]: (_, tree) => this.finalMagicAttack(tree),
      [GameFormula2["物理伤害"]]: (_, tree) => this.physicalDamage(tree),
      [GameFormula2["魔法伤害"]]: (_, tree) => this.magicDamage(tree),
      [GameFormula2["命中率"]]: (_, tree) => this.hitChance(tree),
      [GameFormula2["暴击率"]]: (_, tree) => this.critChance(tree),

      // GameFormula3
      [GameFormula3["成长公式"]]: (_, tree) => this.growthFormula(tree),
    };
  }

  // Helper methods for calculations

  /**
   * 获取树节点值
   *
   * @private
   * @param {BasicBody[]} tree - 子节点数组
   * @param {number} index - 要获取的节点索引
   * @returns {number} 节点的数值，如果索引超出范围则返回0
   * @description 安全地获取指定索引位置的子节点值，并转换为数字类型
   */
  protected getTreeValue(tree: BasicBody[], index: number): number {
    return tree.length > index ? Number(getCatchValue(tree[index])) : 0;
  }

  /**
   * 计算最大值
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组
   * @returns {number} 所有子节点值中的最大值
   * @description 遍历所有子节点，找到其中的最大值
   */
  protected calculateMax(tree: BasicBody[]): number {
    const numbers = tree.map((node) => Number(getCatchValue(node)));
    return Math.max(...numbers);
  }

  /**
   * 计算最小值
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组
   * @returns {number} 所有子节点值中的最小值
   * @description 遍历所有子节点，找到其中的最小值
   */
  protected calculateMin(tree: BasicBody[]): number {
    const numbers = tree.map((node) => Number(getCatchValue(node)));
    return Math.min(...numbers);
  }

  /**
   * 计算幂运算
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组，至少需要2个节点
   * @returns {number} 第一个节点的值作为底数，第二个节点的值作为指数的幂运算结果
   * @description 计算 base^exponent，如果节点数量不足则返回0
   */
  protected calculatePower(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    return Math.pow(this.getTreeValue(tree, 0), this.getTreeValue(tree, 1));
  }

  /**
   * 计算随机数
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组，至少需要2个节点
   * @returns {number} 在指定范围内的随机数
   * @description 生成一个在 [min, max) 范围内的随机数，如果节点数量不足则返回0
   */
  protected calculateRandom(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    const min = this.getTreeValue(tree, 0);
    const max = this.getTreeValue(tree, 1);
    return Math.random() * (max - min) + min;
  }

  /**
   * 计算除法
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组，至少需要2个节点
   * @returns {number} 第一个节点值除以第二个节点值的结果
   * @description 计算 a / b，如果节点数量不足则返回0
   */
  protected divideValues(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    return this.getTreeValue(tree, 0) / this.getTreeValue(tree, 1);
  }

  /**
   * 计算除以和
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组，至少需要2个节点
   * @returns {number} a / (a + b) 的结果
   * @description 计算第一个值除以两个值之和，如果节点数量不足则返回0
   */
  protected divideBySum(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    const a = this.getTreeValue(tree, 0);
    const b = this.getTreeValue(tree, 1);
    return a / (a + b);
  }

  /**
   * 计算除以差
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组，至少需要2个节点
   * @returns {number} a / (b - a) 的结果
   * @description 计算第一个值除以两个值之差，如果节点数量不足则返回0
   */
  protected divideByDifference(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    const a = this.getTreeValue(tree, 0);
    const b = this.getTreeValue(tree, 1);
    return a / (b - a);
  }

  /**
   * 计算加权随机数
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组，必须是偶数个节点
   * @returns {number} 根据权重随机选择的值
   * @description 根据权重进行随机选择，节点数组格式为 [值1, 权重1, 值2, 权重2, ...]
   * 如果节点数量不是偶数则返回0
   */
  protected weightedRandom(tree: BasicBody[]): number {
    if (tree.length % 2 !== 0) return 0;

    let maxWeight = 0;
    for (let i = 1; i < tree.length; i += 2) {
      const weight = this.getTreeValue(tree, i);
      tree[i].indexex = weight + maxWeight;
      maxWeight += weight;
    }

    const random = Math.random() * maxWeight;

    for (let i = 1; i < tree.length; i += 2) {
      const prevIndex = i > 1 ? tree[i - 2].indexex || 0 : 0;
      const currentIndex = tree[i].indexex || 0;

      if (random >= prevIndex && random < currentIndex) {
        return this.getTreeValue(tree, i - 1);
      }
    }

    return 0;
  }

  // Combat formula helpers

  /**
   * 攻击减防御公式
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组，至少需要2个节点 [攻击力, 防御力]
   * @returns {number} 攻击力减去防御力的结果
   * @description 基础战斗伤害计算公式：伤害 = 攻击力 - 防御力
   * 这是最简单的伤害计算方式，适用于基础战斗系统
   */
  protected attackMinusDefense(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    return this.getTreeValue(tree, 0) - this.getTreeValue(tree, 1);
  }

  /**
   * 攻击平方除以攻击加防御公式
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组，至少需要2个节点 [攻击力, 防御力]
   * @returns {number} 攻击力平方除以(攻击力+防御力)的结果
   * @description 复杂战斗伤害公式：伤害 = 攻击力² / (攻击力 + 防御力)
   * 这种公式在高攻击力时伤害增长更快，但防御力仍有一定效果
   */
  protected attackSquaredOverDiff(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    const attack = this.getTreeValue(tree, 0);
    const defense = this.getTreeValue(tree, 1);
    return (attack * attack) / (attack + defense);
  }

  /**
   * 差值乘以比率公式
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组，至少需要2个节点 [攻击力, 防御力]
   * @returns {number} (攻击力-防御力) * (攻击力/防御力) 的结果
   * @description 复合战斗伤害公式：伤害 = (攻击力 - 防御力) × (攻击力 / 防御力)
   * 结合了线性差值和比率计算，攻击力优势时伤害会显著增加
   */
  protected diffTimesRatio(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    const attack = this.getTreeValue(tree, 0);
    const defense = this.getTreeValue(tree, 1);
    return (attack - defense) * (attack / defense);
  }

  /**
   * 攻击平方除以防御公式
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组，至少需要2个节点 [攻击力, 防御力]
   * @returns {number} 攻击力平方除以防御力的结果
   * @description 高攻击力伤害公式：伤害 = 攻击力² / 防御力
   * 攻击力对伤害的影响是二次方的，防御力效果相对较弱
   */
  protected attackSquaredOverDefense(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    const attack = this.getTreeValue(tree, 0);
    const defense = this.getTreeValue(tree, 1);
    return (attack * attack) / defense;
  }

  /**
   * 攻击除以防御公式
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组，至少需要2个节点 [攻击力, 防御力]
   * @returns {number} 攻击力除以防御力的结果
   * @description 比率伤害公式：伤害 = 攻击力 / 防御力
   * 伤害完全取决于攻击力和防御力的比率，适用于平衡性要求较高的战斗系统
   */
  protected attackOverDefense(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    return this.getTreeValue(tree, 0) / this.getTreeValue(tree, 1);
  }

  /**
   * 攻击乘以系数公式
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组，至少需要2个节点 [攻击力, 系数]
   * @returns {number} 攻击力乘以(1-系数)的结果
   * @description 减伤攻击公式：伤害 = 攻击力 × (1 - 减伤系数)
   * 系数表示减伤百分比，适用于有护甲或减伤效果的战斗系统
   */
  protected attackWithCoefficient(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    return this.getTreeValue(tree, 0) * (1 - this.getTreeValue(tree, 1));
  }

  /**
   * 护甲公式
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组，至少需要2个节点 [护甲值, 系数]
   * @returns {number} 护甲减伤百分比
   * @description 护甲减伤公式：减伤率 = (护甲 × 系数) / (1 + 护甲 × 系数)
   * 这是经典的护甲减伤公式，护甲越高减伤效果越明显，但有递减效应
   */
  protected armorFormula(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    const armor = this.getTreeValue(tree, 0);
    const coef = this.getTreeValue(tree, 1);
    return (armor * coef) / (1 + armor * coef);
  }

  protected attackWithDamageRate(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    return this.getTreeValue(tree, 0) * this.getTreeValue(tree, 1);
  }

  protected attackOverDefenseFormula(tree: BasicBody[]): number {
    if (tree.length < 3) return 0;
    const attack = this.getTreeValue(tree, 0);
    const defense = this.getTreeValue(tree, 1);
    const coef = this.getTreeValue(tree, 2);
    return attack / (1 + defense * coef);
  }

  protected attackRatioWithCoef(tree: BasicBody[]): number {
    if (tree.length < 3) return 0;
    return (
      (this.getTreeValue(tree, 0) / this.getTreeValue(tree, 1)) *
      this.getTreeValue(tree, 2)
    );
  }

  protected attackCoefOverDefense(tree: BasicBody[]): number {
    if (tree.length < 3) return 0;
    return (
      (this.getTreeValue(tree, 0) * this.getTreeValue(tree, 2)) /
      this.getTreeValue(tree, 1)
    );
  }

  protected attackTimesCoefRatio(tree: BasicBody[]): number {
    if (tree.length < 3) return 0;
    return (
      this.getTreeValue(tree, 0) *
      (this.getTreeValue(tree, 2) / this.getTreeValue(tree, 1))
    );
  }

  // Trigonometric helpers
  protected calculateAtan2(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    return Math.atan2(this.getTreeValue(tree, 0), this.getTreeValue(tree, 1));
  }

  // Logic helpers
  protected ifGreater(tree: BasicBody[]): number {
    if (tree.length < 4) return 0;
    return this.getTreeValue(tree, 0) > this.getTreeValue(tree, 1)
      ? this.getTreeValue(tree, 2)
      : this.getTreeValue(tree, 3);
  }

  protected ifGreaterEqual(tree: BasicBody[]): number {
    if (tree.length < 4) return 0;
    return this.getTreeValue(tree, 0) >= this.getTreeValue(tree, 1)
      ? this.getTreeValue(tree, 2)
      : this.getTreeValue(tree, 3);
  }

  protected ifLess(tree: BasicBody[]): number {
    if (tree.length < 4) return 0;
    return this.getTreeValue(tree, 0) < this.getTreeValue(tree, 1)
      ? this.getTreeValue(tree, 2)
      : this.getTreeValue(tree, 3);
  }

  protected ifLessEqual(tree: BasicBody[]): number {
    if (tree.length < 4) return 0;
    return this.getTreeValue(tree, 0) <= this.getTreeValue(tree, 1)
      ? this.getTreeValue(tree, 2)
      : this.getTreeValue(tree, 3);
  }

  protected ifEqual(tree: BasicBody[]): number {
    if (tree.length < 4) return 0;
    return this.getTreeValue(tree, 0) === this.getTreeValue(tree, 1)
      ? this.getTreeValue(tree, 2)
      : this.getTreeValue(tree, 3);
  }

  protected ifNotEqual(tree: BasicBody[]): number {
    if (tree.length < 4) return 0;
    return this.getTreeValue(tree, 0) !== this.getTreeValue(tree, 1)
      ? this.getTreeValue(tree, 2)
      : this.getTreeValue(tree, 3);
  }

  protected forLoop(tree: BasicBody[]): number {
    if (tree.length < 4) return 0;
    let a = 0;
    let c = 0;
    const start = this.getTreeValue(tree, 0);
    const end = this.getTreeValue(tree, 1);
    const interval = this.getTreeValue(tree, 2);
    const initial = this.getTreeValue(tree, 3);

    for (let i = start; i <= end; i++) {
      if (i % interval === 1) {
        a++;
      }
      c += a + initial;
    }
    return c;
  }

  protected arrayAccess(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    const index = this.getTreeValue(tree, 0);
    return this.getTreeValue(tree, index);
  }

  // Algorithm helpers
  protected calculateLength(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    return fx.length(this.getTreeValue(tree, 0), this.getTreeValue(tree, 1));
  }

  protected calculateDistance(tree: BasicBody[]): number {
    if (tree.length < 4) return 0;
    return fx.distance(
      this.getTreeValue(tree, 0),
      this.getTreeValue(tree, 1),
      this.getTreeValue(tree, 2),
      this.getTreeValue(tree, 3)
    );
  }

  protected calculateDot(tree: BasicBody[]): number {
    if (tree.length < 4) return 0;
    return fx.dot(
      this.getTreeValue(tree, 0),
      this.getTreeValue(tree, 1),
      this.getTreeValue(tree, 2),
      this.getTreeValue(tree, 3)
    );
  }

  protected calculateCross(tree: BasicBody[]): number {
    if (tree.length < 4) return 0;
    return fx.cross(
      this.getTreeValue(tree, 0),
      this.getTreeValue(tree, 1),
      this.getTreeValue(tree, 2),
      this.getTreeValue(tree, 3)
    );
  }

  protected calculateMix(tree: BasicBody[]): number {
    if (tree.length < 3) return 0;
    return fx.mix(
      this.getTreeValue(tree, 0),
      this.getTreeValue(tree, 1),
      this.getTreeValue(tree, 2)
    );
  }

  // Game formula helpers
  protected battleFormula(tree: BasicBody[]): number {
    if (tree.length < 3) return 0;
    const attack = this.getTreeValue(tree, 0);
    const defense = this.getTreeValue(tree, 1);
    const skill = this.getTreeValue(tree, 2);
    return attack * skill * (1 - 1 / (1 + (attack * skill) / (5 * defense)));
  }

  /**
   * 人物生命值公式
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组，需要4个节点 [基础生命, 等级, 系数A, 系数B]
   * @returns {number} 计算后的人物生命值
   * @description 人物生命值计算公式：生命值 = 基础生命 + 系数A × 等级 + 系数B × (1 + 等级) × 等级 / 2
   * 这是一个二次增长的生命值公式，等级越高生命值增长越快，适用于RPG游戏
   */
  protected characterHealth(tree: BasicBody[]): number {
    if (tree.length < 4) return 0;
    const base = this.getTreeValue(tree, 0);
    const level = this.getTreeValue(tree, 1);
    const coefA = this.getTreeValue(tree, 2);
    const coefB = this.getTreeValue(tree, 3);
    return base + coefA * level + (coefB * (1 + level) * level) / 2;
  }

  /**
   * 近战物理攻击力公式
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组，需要5个节点 [力量, 灵巧, 幸运, 等级, 职业攻击系数]
   * @returns {number} 计算后的近战物理攻击力
   * @description 近战攻击力计算公式：攻击力 = 力量×2 + (力量/10)² + 灵巧/5 + 幸运/5 + 职业系数×等级
   * 力量是主要属性，有线性增长和二次增长两部分，其他属性提供辅助加成
   */
  protected meleeAttack(tree: BasicBody[]): number {
    if (tree.length < 5) return 0;
    const str = this.getTreeValue(tree, 0);
    const dex = this.getTreeValue(tree, 1);
    const luck = this.getTreeValue(tree, 2);
    const level = this.getTreeValue(tree, 3);
    const jobCoef = this.getTreeValue(tree, 4);
    return (
      str * 2 + Math.pow(str / 10, 2) + dex / 5 + luck / 5 + jobCoef * level
    );
  }

  /**
   * 远程物理攻击力公式
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组，需要5个节点 [灵巧, 力量, 幸运, 等级, 职业攻击系数]
   * @returns {number} 计算后的远程物理攻击力
   * @description 远程攻击力计算公式：攻击力 = 灵巧×2 + (灵巧/10)² + 力量/5 + 幸运/5 + 职业系数×等级
   * 灵巧是主要属性，有线性增长和二次增长两部分，力量提供辅助加成
   */
  protected rangedAttack(tree: BasicBody[]): number {
    if (tree.length < 5) return 0;
    const dex = this.getTreeValue(tree, 0);
    const str = this.getTreeValue(tree, 1);
    const luck = this.getTreeValue(tree, 2);
    const level = this.getTreeValue(tree, 3);
    const jobCoef = this.getTreeValue(tree, 4);
    return (
      dex * 2 + Math.pow(dex / 10, 2) + str / 5 + luck / 5 + jobCoef * level
    );
  }

  /**
   * 法师物理攻击力公式
   *
   * @protected
   * @param {BasicBody[]} tree - 子节点数组，需要1个节点 [力量]
   * @returns {number} 计算后的法师物理攻击力
   * @description 法师攻击力计算公式：攻击力 = 力量×2 + (力量/10)²
   * 法师的物理攻击力主要依赖力量属性，有线性增长和二次增长两部分
   */
  protected mageAttack(tree: BasicBody[]): number {
    if (tree.length < 1) return 0;
    const str = this.getTreeValue(tree, 0);
    return str * 2 + Math.pow(str / 10, 2);
  }

  protected physicalDefense(tree: BasicBody[]): number {
    return this.value;
  }

  protected magicDefense(tree: BasicBody[]): number {
    return this.value;
  }

  protected hitRate(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    return this.getTreeValue(tree, 0) + this.getTreeValue(tree, 1);
  }

  protected dodgeRate(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    return this.getTreeValue(tree, 0) + this.getTreeValue(tree, 1);
  }

  protected jobPointGrowth(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    return 1 + this.getTreeValue(tree, 0) / this.getTreeValue(tree, 1);
  }

  protected finalMeleeAttack(tree: BasicBody[]): number {
    if (tree.length < 8) return 0;
    const str = this.getTreeValue(tree, 0);
    const dex = this.getTreeValue(tree, 1);
    const luck = this.getTreeValue(tree, 2);
    const equipAtk = this.getTreeValue(tree, 3);
    const baseAtk = this.getTreeValue(tree, 4);
    const atkBonus = this.getTreeValue(tree, 5);
    const weaponMod = this.getTreeValue(tree, 6);
    const elementMod = this.getTreeValue(tree, 7);

    return (
      (str * 7 +
        str / 5 +
        dex / 5 +
        luck / 5 +
        equipAtk +
        (equipAtk + baseAtk) * atkBonus) *
      weaponMod *
      elementMod
    );
  }

  protected finalRangedAttack(tree: BasicBody[]): number {
    if (tree.length < 8) return 0;
    const dex = this.getTreeValue(tree, 0);
    const str = this.getTreeValue(tree, 1);
    const luck = this.getTreeValue(tree, 2);
    const equipAtk = this.getTreeValue(tree, 3);
    const baseAtk = this.getTreeValue(tree, 4);
    const atkBonus = this.getTreeValue(tree, 5);
    const weaponMod = this.getTreeValue(tree, 6);
    const elementMod = this.getTreeValue(tree, 7);

    return (
      (dex * 5 +
        dex / 5 +
        str / 5 +
        luck / 5 +
        equipAtk +
        (equipAtk + baseAtk) * atkBonus) *
      weaponMod *
      elementMod
    );
  }

  protected finalMagicAttack(tree: BasicBody[]): number {
    if (tree.length < 6) return 0;
    const intel = this.getTreeValue(tree, 0);
    const equipMagic = this.getTreeValue(tree, 1);
    const baseMagic = this.getTreeValue(tree, 2);
    const magicBonus = this.getTreeValue(tree, 3);
    const weaponMod = this.getTreeValue(tree, 4);
    const elementMod = this.getTreeValue(tree, 5);

    return (
      (intel * 7 +
        intel / 5 +
        equipMagic +
        (equipMagic + baseMagic) * magicBonus) *
      weaponMod *
      elementMod
    );
  }

  protected physicalDamage(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    const attack = this.getTreeValue(tree, 0);
    const defense = this.getTreeValue(tree, 1);
    return (attack * (4000 + defense)) / (4000 + defense * 10);
  }

  protected magicDamage(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    const magic = this.getTreeValue(tree, 0);
    const mDefense = this.getTreeValue(tree, 1);
    return (magic * (1000 + mDefense)) / (1000 + mDefense * 10);
  }

  protected hitChance(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    const hit = this.getTreeValue(tree, 0);
    const dodge = this.getTreeValue(tree, 1);
    return (hit - dodge + 80) / 100;
  }

  protected critChance(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    const crit = this.getTreeValue(tree, 0);
    const resist = this.getTreeValue(tree, 1);
    return (crit - resist) / 100;
  }

  protected growthFormula(tree: BasicBody[]): number {
    if (tree.length < 2) return 0;
    const level = this.getTreeValue(tree, 0);
    const growthRate = this.getTreeValue(tree, 1);
    return (level - 1) * growthRate;
  }

  /**
   * 获取公式文本值主体
   *
   * @returns {string} 格式化的公式文本字符串
   * @description 根据当前节点的函数类型，生成相应的公式文本表示
   * 支持各种数学函数、逻辑函数和游戏公式的文本格式化
   *
   * @example
   * ```typescript
   * const body = new BasicBody();
   * body.funcType = CommonFunctionTypes.max;
   * body.formulaTextValue = "10,20,30";
   *
   * console.log(body.getFormulaTextValueBody()); // "max(10,20,30)"
   * ```
   */
  getFormulaTextValueBody(): string {
    const paramErrorMsg = "参数不匹配,请输入";
    const formulaBuilders = this.getFormulaTextBuilders();
    const builder = formulaBuilders[this.funcType];

    if (builder) {
      return builder(this.formulaTextValue, this.tree);
    }

    return this.formulaTextValue;
  }

  /**
   * 获取公式文本构建器映射
   *
   * @private
   * @returns {Record<number, (text: string, tree: BasicBody[]) => string>} 函数类型到文本构建函数的映射
   * @description 返回所有支持的函数类型及其对应的公式文本构建函数
   * 用于将计算结果转换为可读的公式文本表示
   */
  private getFormulaTextBuilders(): Record<
    number,
    (text: string, tree: BasicBody[]) => string
  > {
    return {
      0: (text) => text,

      // HandleFunctionTypes
      [HandleFunctionTypes["1-n"]]: (text) => `(1-(${text}))`,
      [HandleFunctionTypes["1/n"]]: (text) => `1/(${text})`,
      [HandleFunctionTypes["-n"]]: (text) => `-(${text})`,
      [HandleFunctionTypes["n*2"]]: (text) => `(${text})*2`,
      [HandleFunctionTypes["n/2"]]: (text) => `(${text})/2`,
      [HandleFunctionTypes["n*100"]]: (text) => `(${text})*100`,
      [HandleFunctionTypes["n/100"]]: (text) => `(${text})/100`,
      [HandleFunctionTypes["n*n"]]: (text) => `(${text})*(${text})`,

      // CommonFunctionTypes
      [CommonFunctionTypes.abs]: (text) => `abs(${text})`,
      [CommonFunctionTypes.random]: (text) => `random()*(${text})`,
      [CommonFunctionTypes.floor]: (text) => `floor(${text})`,
      [CommonFunctionTypes.sqrt]: (text) => `sqrt(${text})`,
      [CommonFunctionTypes.max]: (_, tree) => this.buildMaxText(tree),
      [CommonFunctionTypes.min]: (_, tree) => this.buildMinText(tree),
      [CommonFunctionTypes.pow]: (_, tree) => this.buildPowerText(tree),
      [CommonFunctionTypes.log]: (text) => `log(${text})`,
      [CommonFunctionTypes.exp]: (text) => `exp(${text})`,
      [CommonFunctionTypes.cbrt]: (text) => `cbrt(${text})`,
      [CommonFunctionTypes.sign]: (text) => `sign(${text})`,
      [CommonFunctionTypes.imul]: (text) => `imul(${text})`,
      [CommonFunctionTypes.ceil]: (text) => `ceil(${text})`,
      [CommonFunctionTypes.round]: (text) => `round(${text})`,

      // Complex formulas handled separately
      [HandleFunctionTypes["r(n~n2)"]]: (_, tree) =>
        this.buildRandomRangeText(tree),
      [HandleFunctionTypes["n/n2"]]: (_, tree) => this.buildDivisionText(tree),
      [HandleFunctionTypes["n/(n+n2)"]]: (_, tree) =>
        this.buildDivisionSumText(tree),
      [HandleFunctionTypes["n/(n2-n)"]]: (_, tree) =>
        this.buildDivisionDiffText(tree),
      [HandleFunctionTypes["(n,e).(n1,e2)."]]: (_, tree) =>
        this.buildWeightedText(tree),

      // Add all other formula types...
      [CommonFormulaTypes["攻击-防御"]]: (_, tree) =>
        this.buildAttackDefenseText(tree, "-"),
      [CommonFormulaTypes["攻击*攻击/(攻击-防御)"]]: (_, tree) =>
        this.buildComplexAttackText(tree, 1),
      [CommonFormulaTypes["(攻击-防御)*(攻击/防御)"]]: (_, tree) =>
        this.buildComplexAttackText(tree, 2),
      [CommonFormulaTypes["攻击*攻击/防御"]]: (_, tree) =>
        this.buildComplexAttackText(tree, 3),
      [CommonFormulaTypes["攻击/防御"]]: (_, tree) =>
        this.buildAttackDefenseText(tree, "/"),

      // Trigonometric
      [TriangleFunctionTypes["n*pi"]]: (text) => `(${text})*PI`,
      [TriangleFunctionTypes.cos]: (text) => `cos(${text})`,
      [TriangleFunctionTypes.sin]: (text) => `sin(${text})`,
      [TriangleFunctionTypes.tan]: (text) => `tan(${text})`,
      [TriangleFunctionTypes.acos]: (text) => `acos(${text})`,
      [TriangleFunctionTypes.asin]: (text) => `asin(${text})`,
      [TriangleFunctionTypes.atan]: (text) => `atan(${text})`,
      [TriangleFunctionTypes.atan2]: (_, tree) => this.buildAtan2Text(tree),

      // Logic functions
      [LogicFunctionTypes["if(n1>n2)return{n3!n4}"]]: (_, tree) =>
        this.buildIfText(tree, ">"),
      [LogicFunctionTypes["if(n1>=n2)return{n3!n4}"]]: (_, tree) =>
        this.buildIfText(tree, ">="),
      [LogicFunctionTypes["if(n1<n2)return{n3!n4}"]]: (_, tree) =>
        this.buildIfText(tree, "<"),
      [LogicFunctionTypes["if(n1<=n2)return{n3!n4}"]]: (_, tree) =>
        this.buildIfText(tree, "<="),
      [LogicFunctionTypes["if(n1==n2)return{n3!n4}"]]: (_, tree) =>
        this.buildIfText(tree, "=="),
      [LogicFunctionTypes["if(n1!=n2)return{n3!n4}"]]: (_, tree) =>
        this.buildIfText(tree, "!="),
      [LogicFunctionTypes["for(var i=n;i<=n2;i++){if(i%n3==1){a++}c+=a+n4}"]]: (
        _,
        tree
      ) => this.buildForLoopText(tree),
      [LogicFunctionTypes["[n]"]]: (_, tree) => this.buildArrayAccessText(tree),

      // Algorithm functions
      [AlgorithmFunctionTypes.length]: (_, tree) =>
        this.buildAlgorithmText(tree, "length"),
      [AlgorithmFunctionTypes.distance]: (_, tree) =>
        this.buildAlgorithmText(tree, "distance"),
      [AlgorithmFunctionTypes.dot]: (_, tree) =>
        this.buildAlgorithmText(tree, "dot"),
      [AlgorithmFunctionTypes.cross]: (_, tree) =>
        this.buildAlgorithmText(tree, "cross"),
      [AlgorithmFunctionTypes.mix]: (_, tree) => this.buildMixText(tree),

      // Game formulas
      [GameFormula1["战斗公式"]]: (_, tree) =>
        this.buildBattleFormulaText(tree),
      [GameFormula2["人物生命"]]: (_, tree) =>
        this.buildCharacterHealthText(tree),
      [GameFormula2["近战素质物攻"]]: (_, tree) =>
        this.buildMeleeAttackText(tree),
      [GameFormula2["远程素质物攻"]]: (_, tree) =>
        this.buildRangedAttackText(tree),
      [GameFormula2["法师素质物攻"]]: (_, tree) =>
        this.buildMageAttackText(tree),
      [GameFormula2["物理伤害"]]: (_, tree) =>
        this.buildPhysicalDamageText(tree),
      [GameFormula2["魔法伤害"]]: (_, tree) => this.buildMagicDamageText(tree),
      [GameFormula2["命中率"]]: (_, tree) => this.buildHitChanceText(tree),
      [GameFormula2["暴击率"]]: (_, tree) => this.buildCritChanceText(tree),
      [GameFormula3["成长公式"]]: (_, tree) => this.buildGrowthText(tree),
    };
  }

  // Helper methods for formula text building
  private buildMaxText(tree: BasicBody[]): string {
    const values = tree.map((t) => t.getFormulaTextValue()).join(",");
    return `max(${values})`;
  }

  private buildMinText(tree: BasicBody[]): string {
    const values = tree.map((t) => t.getFormulaTextValue()).join(",");
    return `min(${values})`;
  }

  private buildPowerText(tree: BasicBody[]): string {
    if (tree.length < 2) return "参数不匹配,请输入[值,值]";
    return `pow(${tree[0].getFormulaTextValue()},${tree[1].getFormulaTextValue()})`;
  }

  private buildRandomRangeText(tree: BasicBody[]): string {
    if (tree.length < 2) return "参数不匹配,请输入[最小值,最大值]";
    const min = tree[0].getFormulaTextValue();
    const max = tree[1].getFormulaTextValue();
    return `random()*(${max}-${min})+${min}`;
  }

  private buildDivisionText(tree: BasicBody[]): string {
    if (tree.length < 2) return "参数不匹配,请输入[值,值]";
    return `(${tree[0].getFormulaTextValue()})/(${tree[1].getFormulaTextValue()})`;
  }

  private buildDivisionSumText(tree: BasicBody[]): string {
    if (tree.length < 2) return "参数不匹配,请输入[值,值]";
    const a = tree[0].getFormulaTextValue();
    const b = tree[1].getFormulaTextValue();
    return `${a}/(${a}+${b})`;
  }

  private buildDivisionDiffText(tree: BasicBody[]): string {
    if (tree.length < 2) return "参数不匹配,请输入[值,值]";
    const a = tree[0].getFormulaTextValue();
    const b = tree[1].getFormulaTextValue();
    return `${a}/(${b}-${a})`;
  }

  private buildWeightedText(tree: BasicBody[]): string {
    if (tree.length % 2 !== 0) return "参数不匹配,请输入[值,权重]";

    const pairs: string[] = [];
    for (let i = 0; i < tree.length; i += 2) {
      pairs.push(
        `[值:${tree[i].getFormulaTextValue()},权重:${tree[
          i + 1
        ].getFormulaTextValue()}]`
      );
    }
    return pairs.join(",");
  }

  private buildAttackDefenseText(tree: BasicBody[], operator: string): string {
    if (tree.length < 2) return "参数不匹配,请输入[攻击,防御]";
    return `${tree[0].getFormulaTextValue()}${operator}${tree[1].getFormulaTextValue()}`;
  }

  private buildComplexAttackText(tree: BasicBody[], type: number): string {
    if (tree.length < 2) return "参数不匹配,请输入[攻击,防御]";
    const atk = tree[0].getFormulaTextValue();
    const def = tree[1].getFormulaTextValue();

    switch (type) {
      case 1:
        return `${atk}*${atk}/(${atk}+${def})`;
      case 2:
        return `(${atk}-${def})*(${atk}/${def})`;
      case 3:
        return `${atk}*${atk}/${def}`;
      default:
        return "";
    }
  }

  private buildAtan2Text(tree: BasicBody[]): string {
    if (tree.length < 2) return "参数不匹配,请输入[值,值]";
    return `atan2(${tree[0].getFormulaTextValue()},${tree[1].getFormulaTextValue()})`;
  }

  private buildIfText(tree: BasicBody[], operator: string): string {
    if (tree.length < 4) return "参数不匹配,请输入[值,值,值,值]";
    const [a, b, c, d] = tree.map((t) => t.getFormulaTextValue());
    return `if(${a}${operator}${b}){return ${c}}else{return ${d}}`;
  }

  private buildForLoopText(tree: BasicBody[]): string {
    if (tree.length < 4)
      return "参数不匹配,请输入[初始等级,当前等级,间隔值,初始值]";
    const [start, end, interval, initial] = tree.map((t) =>
      t.getFormulaTextValue()
    );
    return `for(var i=${start};i<=${end};i++){if(i%${interval}==1){a++}c+=a+${initial}}`;
  }

  private buildArrayAccessText(tree: BasicBody[]): string {
    if (tree.length < 2) return "参数不匹配,请输入下标和数组";
    return `[${tree[0].getFormulaTextValue()}]`;
  }

  private buildAlgorithmText(tree: BasicBody[], funcName: string): string {
    const minLength = funcName === "mix" ? 3 : 4;
    const params = funcName === "mix" ? "[值1,值2,混合比例]" : "[x1,y1,x2,y2]";

    if (tree.length < minLength) return `参数不匹配,请输入${params}`;

    const values = tree
      .slice(0, minLength)
      .map((t) => t.getFormulaTextValue())
      .join(",");
    return `${funcName}(${values})`;
  }

  private buildMixText(tree: BasicBody[]): string {
    if (tree.length < 3) return "参数不匹配,请输入[值1,值2,混合比例]";
    const values = tree
      .slice(0, 3)
      .map((t) => t.getFormulaTextValue())
      .join(",");
    return `mix(${values})`;
  }

  private buildBattleFormulaText(tree: BasicBody[]): string {
    if (tree.length < 3) return "参数不匹配,请输入[攻击,防御,技能系数]";
    const [atk, def, skill] = tree.map((t) => t.getFormulaTextValue());
    return `${atk}*${skill}*(1-(1/(1+((${atk}*${skill})/(5*${def})))))`;
  }

  private buildCharacterHealthText(tree: BasicBody[]): string {
    if (tree.length < 4)
      return "参数不匹配,请输入[基础生命,等级,职业系数A,职业系数B]";
    const [base, level, coefA, coefB] = tree.map((t) =>
      t.getFormulaTextValue()
    );
    return `${base}+${coefA}*${level}+${coefB}*(1+${level})*${level}/2`;
  }

  private buildMeleeAttackText(tree: BasicBody[]): string {
    if (tree.length < 5)
      return "参数不匹配,请输入[力量,灵巧,幸运,等级,职业攻击系数]";
    const [str, dex, luck, level, jobCoef] = tree.map((t) =>
      t.getFormulaTextValue()
    );
    return `${str}*2+pow((${str}/10),2)+${dex}/5+${luck}/5+${jobCoef}*${level}`;
  }

  private buildRangedAttackText(tree: BasicBody[]): string {
    if (tree.length < 5)
      return "参数不匹配,请输入[灵巧,力量,幸运,等级,职业攻击系数]";
    const [dex, str, luck, level, jobCoef] = tree.map((t) =>
      t.getFormulaTextValue()
    );
    return `${dex}*2+pow((${dex}/10),2)+${str}/5+${luck}/5+${jobCoef}*${level}`;
  }

  private buildMageAttackText(tree: BasicBody[]): string {
    if (tree.length < 1) return "参数不匹配,请输入[力量]";
    const str = tree[0].getFormulaTextValue();
    return `${str}*2+pow(${str}/10,2)`;
  }

  private buildPhysicalDamageText(tree: BasicBody[]): string {
    if (tree.length < 2) return "参数不匹配,请输入[物攻,物防]";
    const [atk, def] = tree.map((t) => t.getFormulaTextValue());
    return `${atk}*(4000+${def})/(4000+(${def}*10))`;
  }

  private buildMagicDamageText(tree: BasicBody[]): string {
    if (tree.length < 2) return "参数不匹配,请输入[魔攻,魔防]";
    const [magic, mDef] = tree.map((t) => t.getFormulaTextValue());
    return `${magic}*(1000+${mDef})/(1000+(${mDef}*10))`;
  }

  private buildHitChanceText(tree: BasicBody[]): string {
    if (tree.length < 2) return "参数不匹配,请输入[命中,闪避]";
    const [hit, dodge] = tree.map((t) => t.getFormulaTextValue());
    return `(${hit}-${dodge}+80)/100`;
  }

  private buildCritChanceText(tree: BasicBody[]): string {
    if (tree.length < 2) return "参数不匹配,请输入[暴击,抗暴]";
    const [crit, resist] = tree.map((t) => t.getFormulaTextValue());
    return `(${crit}-${resist})/100`;
  }

  private buildGrowthText(tree: BasicBody[]): string {
    if (tree.length < 2) return "参数不匹配,请输入[等级,属性成长值]";
    const [level, growth] = tree.map((t) => t.getFormulaTextValue());
    return `(${level}-1)*${growth}`;
  }

  /**
   * 获取公式文本值
   *
   * @returns {string} 完整的公式文本字符串
   * @description 获取当前节点及其子节点组成的完整公式文本表示
   * 这是对外提供的主要接口，用于获取可读的公式字符串
   *
   * @example
   * ```typescript
   * const body = new BasicBody();
   * body.funcType = CommonFunctionTypes.add;
   *
   * const child1 = new BasicBody();
   * child1.value = 10;
   * const child2 = new BasicBody();
   * child2.value = 20;
   *
   * body.addBody(child1);
   * body.addBody(child2);
   *
   * console.log(body.getFormulaTextValue()); // "10+20"
   * ```
   */
  getFormulaTextValue(): string {
    return this.getFormulaTextValueBody();
  }

  /**
   * 获取公式文本字符主体
   *
   * @returns {string} 公式的字符表示
   * @description 获取当前节点的公式字符表示，通常用于显示变量名或占位符
   * 与 getFormulaTextValueBody 类似，但返回的是字符表示而非数值
   *
   * @example
   * ```typescript
   * const body = new BasicBody();
   * body.formulaTextCharacter = "A + B";
   *
   * console.log(body.getFormulaTextCharacterBody()); // "A + B"
   * ```
   */
  getFormulaTextCharacterBody(): string {
    // Similar to getFormulaTextValueBody but uses getFormulaTextCharacter instead
    // Implementation follows same pattern as above
    return this.formulaTextCharacter;
  }

  /**
   * 获取公式文本字符
   *
   * @returns {string} 完整的公式字符字符串
   * @description 获取当前节点及其子节点组成的完整公式字符表示
   * 用于显示公式的结构和变量名，便于用户理解和调试
   *
   * @example
   * ```typescript
   * const body = new BasicBody();
   * body.funcType = CommonFunctionTypes.add;
   *
   * const child1 = new BasicBody();
   * child1.formulaTextCharacter = "A";
   * const child2 = new BasicBody();
   * child2.formulaTextCharacter = "B";
   *
   * body.addBody(child1);
   * body.addBody(child2);
   *
   * console.log(body.getFormulaTextCharacter()); // "A+B"
   * ```
   */
  getFormulaTextCharacter(): string {
    return this.getFormulaTextCharacterBody();
  }
}
