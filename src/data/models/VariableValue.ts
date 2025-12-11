import { BasicBody } from "./BasicBody";
import { NodeType } from "../../core/types/NodeType";
import { EventManager as Eve } from "../../core/events/EventManager";
import { getCatchValue } from "../../utils/index";
import { fx } from "../../core/system/System";
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

/**
 * 获取全局对象的辅助函数
 * 兼容不同环境下的全局对象访问
 * @returns 全局对象
 */
const getGlobalThis = () => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof window !== "undefined") return window;
  // if (typeof global !== 'undefined') return global;
  if (typeof self !== "undefined") return self;
  return {};
};

/**
 * 变量值数据模型类
 * 提供变量值的存储、计算和函数处理功能
 * 支持多种数据类型：宏、表格、逻辑列表、滑块等
 */
export class VariableValue extends BasicBody {
  // ==================== 基础属性 ====================

  /** 变量名称 */
  name: string;

  /** 类型标识符 */
  TID: string | number;

  /** 变量值 */
  value: any = 0;

  /** excel节点输出信息 */
  selectedOutputInfo: any = 0;

  /** 节点类型 */
  type: any;

  // ==================== AI相关 ====================

  /** 是否为AI标识 */
  isAI: boolean = false;

  // ==================== 宏定义和表格 ====================

  /** 宏定义字符串 */
  macros: string = "";

  /** 表格数据 */
  sheetData: any = null;

  // ==================== 逻辑控制 ====================

  /** 序列号 */
  snNo: number = 1;

  /** 是否逻辑开启 */
  isLogicalOpen: boolean = false;

  /** 是否正在拖拽 */
  isDragging: boolean = false;

  /** 逻辑数字列表 */
  logicalNumberList: Array<{ value: string }> = [];

  // ==================== 滑块控制 ====================

  /** 当前步数 */
  currentStep: number = 0;

  /** 最小值 */
  minValue: number = 1;

  /** 最大值 */
  maxValue: number = 100;

  /** 步长 */
  step: number = 10;

  // ==================== 层级和关系 ====================

  /** 子单元格 */
  childCell: any;

  /** 子数组 */
  childArray: any[] = [];

  /** 子体数组 */
  childBodyArray: any[] = [];

  /** 逻辑子数组 */
  logicalChildArray: any[] = [];

  // ==================== 缓存和视图 ====================

  /** 视图对象 */
  view: any = null;

  /** 体对象 */
  body: any = null;

  /** 标签 */
  tag: any = null;

  // ==================== 敌对相关 ====================

  /** 敌对体 */
  enemyBody: any = null;

  /** 敌对标识 */
  enemyFlag: boolean = false;

  // ==================== 权重和统计 ====================

  /** 统计值 */
  statistics: number = 0;

  // ==================== 地址和位置 ====================

  /** 绝对地址 */
  absoluteAddress: any = null;

  /** 位置 */
  site: any = null;

  /** 源对象 */
  source: any = null;

  // ==================== 捕获和更新 ====================

  /** 捕获关键 */
  captureCrit: boolean = true;

  /** 更新值 */
  upDateValue: number = 1;

  /** 降级值 */
  demoteValue: number = 0;

  // ==================== 历史记录 ====================

  /** 历史目标 */
  historyTarget: any = null;

  // ==================== 显示控制 ====================

  /** 是否系统显示 */
  isSystemShow: boolean = false;

  /**
   * 构造函数名称
   */
  constructorName: string = "VariableValue";

  /**
   * 构造函数
   * 初始化变量值数据模型实例
   * @param name 变量名称
   * @param value 变量值
   * @param type 节点类型
   * @param operator 操作符
   */
  constructor(
    name: string,
    value: any,
    type: any = null,
    operator: any = null
  ) {
    super();
    this.name = name;
    this.value = value;
    this.type = type;
    this.id = ++Eve.IDINDEX;
    this.operator = operator;
  }

  /**
   * 设置宏定义
   * @param value 宏定义字符串
   */
  setMacros(value: string): void {
    this.macros = value;
    this.getValue();
  }

  /**
   * 设置全局值
   * @param value 要设置的值
   */
  setGlobalValue(value: any): void {
    if (this.source != null) {
      this.source.setValue(value);
    }
  }

  /**
   * 设置变量值
   * @param value 要设置的值
   */
  setValue(value: any): void {
    if (this.type === NodeType.Sheet) return;

    this.value = value;
    this.upDataChild();

    if (this.type === NodeType.Variable && fx.code === false) {
      this.updateVariableDisplay(value);
    }
  }

  /**
   * 更新变量显示
   * 私有方法，用于更新UI中的变量显示
   * @param value 要显示的值
   */
  private updateVariableDisplay(value: any): void {
    const item = (fx as any).getDataById?.(this.id);
    const treeItem = (fx as any).getTreeDataById?.(this.id);

    if (item && treeItem) {
      const globalThis_ = getGlobalThis();

      if (
        (globalThis_ as any).window &&
        !(globalThis_ as any).window.updatingSheeData
      ) {
        const dataPath = `componentDatas.nodeList.props.tree.props.dataSource.${treeItem.dataPath}.showName`;
        (globalThis_ as any).window.set_data(
          (globalThis_ as any).window.store,
          dataPath,
          `${this.name}=${value}`
        );
      }
    }
  }

  /**
   * 添加数字列表项
   */
  addNumberList(): void {
    this.logicalNumberList.push({ value: "" });
  }

  /**
   * 修改数字列表项
   * @param index 索引
   * @param value 新值
   */
  changeNumberListItem(index: number, value: string): void {
    this.logicalNumberList[index].value = value;
  }

  /**
   * 获取是否为函数
   * @returns 是否为宏类型
   */
  getIsFunction(): boolean {
    return this.type === NodeType.Macro;
  }

  /**
   * 获取资源字符串
   * @param body 体对象
   * @returns 资源字符串
   */
  getRessSring(body: any): string {
    const address: any[] = [];
    fx.getStepData(body, address);
    return address.join("");
  }

  /**
   * 设置敌对体
   * @param body 敌对体对象
   */
  setEnemyBody(body: any): void {
    this.enemyBody = body;
  }

  /**
   * 设置表格数据
   * @param sheetData 表格数据
   */
  setSheetData(sheetData: any): void {
    this.sheetData = new fx.SheetData(sheetData);
    this.getValue();
    this.upDataChild();
  }

  /**
   * 获取变量值
   * 根据变量类型和状态计算并返回值
   * @returns 计算后的变量值
   */
  getValue(name?: string, row?: string, col?: string): any {
    // 处理敌对实体
    if (this.type !== NodeType.Variable && this.enemyFlag && fx.enemyBody != null) {
      this.value = getCatchValue(
        fx.enemyBody.getPropertyObject(this.source.absoluteAddress)
      );
      return this.returnFunc(this.value);
    }

    // 根据类型处理值
    switch (this.type) {
      case NodeType.Macro:
        return this.getMacroValue();

      case NodeType.Sheet:
        return this.getSheetValue(name, row, col);

      case (NodeType as any).LogicalNumberList:
        return this.getLogicalNumberListValue();

      case NodeType.LogicalSlider:
        return this.getLogicalSliderValue();

      case (NodeType as any).LogicalList:
      case (NodeType as any).LogicalBasic:
        return this.getLogicalValue();

      case NodeType.CalculationLayer:
        return this.getCalculationLayerValue();

      default:
        return this.getDefaultValue();
    }
  }

  /**
   * 获取宏值
   * 私有方法，执行宏定义并返回值
   * @returns 宏执行结果
   */
  private getMacroValue(): any {
    try {
      this.historyTarget = (globalThis as any).target;
      (globalThis as any).target = this;

      if (this.macros === "") {
        this.value = 0;
        return this.returnFunc(this.value);
      }

      if (fx.code) {
        this.value = new Function(
          `return ${fx["f_" + this.TID].fun.replace(/[\r\n\s]/g, "")}`
        )();
      } else {
        try {
          this.value = eval(this.macros);
        } catch (e) {
          this.value = 0;
        }
      }

      (globalThis as any).target = this.historyTarget;

      if (!isNaN(this.value)) {
        this.value = fx.double(this.value, 4);
      }

      return this.returnFunc(this.value);
    } catch (err) {
      this.value = 0;
      return this.value;
    }
  }

  /**
   * 获取表格值
   * 私有方法，从表格数据中获取值
   * @returns 表格值
   */
  private getSheetValue(name, row, col): any {
    this.value =
      this.source?.sheetData?.getValue(name, row, col) ||
      this.sheetData?.getValue(name, row, col) ||
      0;
    return this.returnFunc(this.value);
  }

  /**
   * 获取逻辑数字列表值
   * 私有方法，处理数字列表类型的值
   * @returns 数字列表值
   */
  private getLogicalNumberListValue(): any {
    const numberListValue = this.getNumberListValue();

    if (
      typeof numberListValue === "string" &&
      numberListValue.startsWith("[")
    ) {
      const arr = JSON.parse(numberListValue);
      const randomNum =
        Math.floor(Math.random() * (arr[1] - arr[0] + 1)) + arr[0];
      this.value = randomNum;
    } else {
      this.value = Number(numberListValue);
    }

    return this.returnFunc(this.value);
  }

  /**
   * 获取数字列表值
   * 私有方法，根据序列号获取数字列表中的值
   * @returns 数字列表中的值
   */
  private getNumberListValue(): string | number {
    return typeof this.snNo === "number" &&
      this.logicalNumberList.length &&
      this.snNo <= this.logicalNumberList.length
      ? this.logicalNumberList[this.snNo - 1].value || 0
      : 0;
  }

  /**
   * 获取逻辑滑块值
   * 私有方法，根据滑块设置计算值
   * @returns 滑块值
   */
  private getLogicalSliderValue(): any {
    const sliderValue = this.currentStep * this.step;
    this.value = Math.max(this.minValue, Math.min(sliderValue, this.maxValue));
    return this.returnFunc(this.value);
  }

  /**
   * 获取逻辑值
   * 私有方法，从逻辑子数组中获取值
   * @returns 逻辑值
   */
  private getLogicalValue(): any {
    const item = this.logicalChildArray[this.snNo - 1];
    this.value = item ? item.getValue() : 0;
    return this.returnFunc(this.value);
  }

  /**
   * 获取计算层值
   * 私有方法，从计算层中获取值
   * @returns 计算层值
   */
  private getCalculationLayerValue(): any {
    const sourceBody = this.source?.body;
    const currentBody = this.body;

    if (sourceBody) {
      this.value = getCatchValue(sourceBody);
    } else if (currentBody) {
      this.value = getCatchValue(currentBody);
    }

    if (!isNaN(this.value)) {
      this.value = Number(fx.double(this.value, 4));
    }

    return this.returnFunc(this.value);
  }

  /**
   * 获取默认值
   * 私有方法，返回默认的变量值
   * @returns 默认值
   */
  private getDefaultValue(): any {
    if (!this.value) this.value = 0;
    if (!isNaN(this.value)) {
      this.value = Number(this.value);
    }
    return this.returnFunc(this.value);
  }

  /**
   * 函数处理 - 根据funcType执行对应的数学运算
   * 根据函数类型执行相应的数学运算，包括基础运算、三角函数、逻辑函数等
   * @param value 输入值
   * @returns 处理后的值
   */
  returnFunc(value: any): any {
    // 基础运算
    if (this.funcType === 0) return value;

    // Handle函数类型 (1-23)
    if (
      this.funcType >= HandleFunctionTypes["1-n"] &&
      this.funcType <= HandleFunctionTypes["(n,e).(n1,e2)."]
    ) {
      return this.handleFunction(value);
    }

    // 通用公式类型 (24-35)
    if (
      this.funcType >= CommonFormulaTypes["攻击-防御"] &&
      this.funcType <= 35
    ) {
      return this.commonFormulaFunction();
    }

    // 三角函数类型 (36-43)
    if (
      this.funcType >= TriangleFunctionTypes["n*pi"] &&
      this.funcType <= TriangleFunctionTypes.atan2
    ) {
      return this.triangleFunction(value);
    }

    // 逻辑函数类型 (44-51)
    if (
      this.funcType >= LogicFunctionTypes["if(n1>n2)return{n3!n4}"] &&
      this.funcType <= LogicFunctionTypes["[n]"]
    ) {
      return this.logicFunction();
    }

    // 通用函数类型 (4-19, 52-55)
    if (
      (this.funcType >= CommonFunctionTypes.abs &&
        this.funcType <= CommonFunctionTypes.cbrt) ||
      (this.funcType >= CommonFunctionTypes.sign &&
        this.funcType <= CommonFunctionTypes.round)
    ) {
      return this.commonFunction(value);
    }

    // 算法函数类型 (56-60)
    if (this.funcType >= AlgorithmFunctionTypes.length && this.funcType <= 60) {
      return this.algorithmFunction();
    }

    // 游戏公式 (61-68)
    if (this.funcType >= GameFormula1["战斗公式"] && this.funcType <= 68) {
      return this.gameFormulaFunction();
    }

    return value;
  }

  private handleFunction(value: any): any {
    const getVal = (index: number) => getCatchValue(this.tree[index]);

    switch (this.funcType) {
      case HandleFunctionTypes["1-n"]:
        return 1 - value;
      case HandleFunctionTypes["1/n"]:
        return 1 / value;
      case HandleFunctionTypes["-n"]:
        return -value;
      case HandleFunctionTypes["n*2"]:
        return value * 2;
      case HandleFunctionTypes["n/2"]:
        return value / 2;
      case HandleFunctionTypes["n*100"]:
        return value * 100;
      case HandleFunctionTypes["n/100"]:
        return value / 100;
      case HandleFunctionTypes["n*n"]:
        return value * value;
      case HandleFunctionTypes["n/n2"]:
        return this.divideValues(this.tree);
      case HandleFunctionTypes["n/(n+n2)"]:
        return this.divideBySum(this.tree);
      case HandleFunctionTypes["n/(n2-n)"]:
        return this.divideByDifference(this.tree);
      case HandleFunctionTypes["(n,e).(n1,e2)."]:
        return this.weightedRandom(this.tree);
      case HandleFunctionTypes["r(n~n2)"]:
        return this.calculateRandom(this.tree);
      default:
        return value;
    }
  }

  private commonFormulaFunction(): any {
    const getVal = (index: number) => getCatchValue(this.tree[index]);

    switch (this.funcType) {
      case CommonFormulaTypes["攻击-防御"]:
        return this.attackMinusDefense(this.tree);
      case CommonFormulaTypes["攻击*攻击/(攻击-防御)"]:
        return this.attackSquaredOverDiff(this.tree);
      case CommonFormulaTypes["(攻击-防御)*(攻击/防御)"]:
        return this.diffTimesRatio(this.tree);
      case CommonFormulaTypes["攻击*攻击/防御"]:
        return this.attackSquaredOverDefense(this.tree);
      case CommonFormulaTypes["攻击/防御"]:
        return this.attackOverDefense(this.tree);
      case CommonFormulaTypes["攻击*(1-系数)"]:
        return this.attackWithCoefficient(this.tree);
      case CommonFormulaTypes["护甲*系数/(1+护甲*系数)"]:
        return this.armorFormula(this.tree);
      case CommonFormulaTypes["攻击*受伤率"]:
        return this.attackWithDamageRate(this.tree);
      case CommonFormulaTypes["攻击/(1+防御*系数)"]:
        return this.attackOverDefenseFormula(this.tree);
      case CommonFormulaTypes["攻击/防御*系数"]:
        return this.attackRatioWithCoef(this.tree);
      case CommonFormulaTypes["攻击*系数/防御"]:
        return this.attackCoefOverDefense(this.tree);
      case CommonFormulaTypes["攻击*(系数/防御)"]:
        return this.attackTimesCoefRatio(this.tree);
      default:
        return 0;
    }
  }

  private triangleFunction(value: any): any {
    const getVal = (index: number) => getCatchValue(this.tree[index]);

    switch (this.funcType) {
      case TriangleFunctionTypes["n*pi"]:
        return value * Math.PI;
      case TriangleFunctionTypes.cos:
        return Math.cos(value);
      case TriangleFunctionTypes.sin:
        return Math.sin(value);
      case TriangleFunctionTypes.tan:
        return Math.tan(value);
      case TriangleFunctionTypes.acos:
        return Math.acos(value);
      case TriangleFunctionTypes.asin:
        return Math.asin(value);
      case TriangleFunctionTypes.atan:
        return Math.atan(value);
      case TriangleFunctionTypes.atan2:
        return this.calculateAtan2(this.tree);
      default:
        return value;
    }
  }

  private logicFunction(): any {
    const getVal = (index: number) => getCatchValue(this.tree[index]);

    if (
      this.tree.length < 4 &&
      this.funcType !== LogicFunctionTypes["[n]"] &&
      this.funcType !== 50
    ) {
      return 0;
    }

    switch (this.funcType) {
      case LogicFunctionTypes["if(n1>n2)return{n3!n4}"]:
        return this.ifGreater(this.tree);
      case LogicFunctionTypes["if(n1>=n2)return{n3!n4}"]:
        return this.ifGreaterEqual(this.tree);
      case LogicFunctionTypes["if(n1<n2)return{n3!n4}"]:
        return this.ifLess(this.tree);
      case LogicFunctionTypes["if(n1<=n2)return{n3!n4}"]:
        return this.ifLessEqual(this.tree);
      case LogicFunctionTypes["if(n1==n2)return{n3!n4}"]:
        return this.ifEqual(this.tree);
      case LogicFunctionTypes["if(n1!=n2)return{n3!n4}"]:
        return this.ifNotEqual(this.tree);
      case LogicFunctionTypes[
        "for(var i=n;i<=n2;i++){if(i%n3==1){a++}c+=a+n4}"
      ]:
        return this.forLoop(this.tree);
      case LogicFunctionTypes["[n]"]:
        return this.arrayAccess(this.tree);
      default:
        return 0;
    }
  }

  private commonFunction(value: any): any {
    const getVal = (index: number) => getCatchValue(this.tree[index]);

    switch (this.funcType) {
      case CommonFunctionTypes.abs:
        return Math.abs(value);
      case CommonFunctionTypes.random:
        return Math.random() * value;
      case CommonFunctionTypes.floor:
        return Math.floor(value);
      case CommonFunctionTypes.sqrt:
        return Math.sqrt(value);
      case CommonFunctionTypes.max:
        return this.calculateMax(this.tree);
      case CommonFunctionTypes.min:
        return this.calculateMin(this.tree);
      case CommonFunctionTypes.pow:
        return this.calculatePower(this.tree);
      case CommonFunctionTypes.log:
        return Math.log(value);
      case CommonFunctionTypes.exp:
        return Math.exp(value);
      case CommonFunctionTypes.cbrt:
        return Math.cbrt(value);
      case CommonFunctionTypes.sign:
        return Math.sign(value);
      case CommonFunctionTypes.imul:
        return Math.imul(value, 1);
      case CommonFunctionTypes.ceil:
        return Math.ceil(value);
      case CommonFunctionTypes.round:
        return Math.round(value);
      default:
        return value;
    }
  }

  private algorithmFunction(): any {
    const getVal = (index: number) => getCatchValue(this.tree[index]);

    switch (this.funcType) {
      case AlgorithmFunctionTypes.length:
        return this.calculateLength(this.tree);
      case AlgorithmFunctionTypes.distance:
        return this.calculateDistance(this.tree);
      case AlgorithmFunctionTypes.dot:
        return this.calculateDot(this.tree);
      case AlgorithmFunctionTypes.cross:
        return this.calculateCross(this.tree);
      case AlgorithmFunctionTypes.mix:
        return this.calculateMix(this.tree);
      default:
        return 0;
    }
  }

  private gameFormulaFunction(): any {
    const getVal = (index: number) => getCatchValue(this.tree[index]);

    switch (this.funcType) {
      case GameFormula1["战斗公式"]:
        return this.battleFormula(this.tree);

      case GameFormula2["人物生命"]:
        return this.characterHealth(this.tree);

      case GameFormula2["近战素质物攻"]:
        return this.meleeAttack(this.tree);

      case GameFormula2["远程素质物攻"]:
        return this.rangedAttack(this.tree);

      case GameFormula2["法师素质物攻"]:
        return this.mageAttack(this.tree);

      case GameFormula2["物防"]:
        return this.physicalDefense(this.tree);

      case GameFormula2["魔防"]:
        return this.magicDefense(this.tree);

      case GameFormula2["命中"] + 2: // 68
        return this.hitRate(this.tree);

      default:
        return this.value;
    }
  }

  /**
   * 获取公式文本值体
   * 根据函数类型生成对应的公式文本表示
   * @returns 公式文本值
   */
  getFormulaTextValueBody(): string {
    // 基础运算的文本表示
    const formulaMap: { [key: number]: string } = {
      [HandleFunctionTypes["1-n"]]: `1-(${this.value})`,
      [HandleFunctionTypes["1/n"]]: `1/(${this.value})`,
      [HandleFunctionTypes["-n"]]: `-(${this.value})`,
      [CommonFunctionTypes.abs]: `abs(${this.value})`,
      [CommonFunctionTypes.random]: `random()*${this.value}`,
      [CommonFunctionTypes.floor]: `floor(${this.value})`,
      [CommonFunctionTypes.sqrt]: `sqrt(${this.value})`,
      [CommonFunctionTypes.log]: `log(${this.value})`,
      [CommonFunctionTypes.exp]: `exp(${this.value})`,
      [CommonFunctionTypes.cbrt]: `cbrt(${this.value})`,
      [HandleFunctionTypes["n*2"]]: `(${this.value})*2`,
      [HandleFunctionTypes["n/2"]]: `(${this.value})/2`,
      [HandleFunctionTypes["n*100"]]: `(${this.value})*100`,
      [HandleFunctionTypes["n/100"]]: `(${this.value})/100`,
      [HandleFunctionTypes["n*n"]]: `${this.value}*${this.value}`,
      [TriangleFunctionTypes["n*pi"]]: `${this.value}*PI`,
      [TriangleFunctionTypes.cos]: `cos(${this.value})`,
      [TriangleFunctionTypes.sin]: `sin(${this.value})`,
      [TriangleFunctionTypes.tan]: `tan(${this.value})`,
      [TriangleFunctionTypes.acos]: `acos(${this.value})`,
      [TriangleFunctionTypes.asin]: `asin(${this.value})`,
      [TriangleFunctionTypes.atan]: `atan(${this.value})`,
      [CommonFunctionTypes.sign]: `sign(${this.value})`,
      [CommonFunctionTypes.imul]: `imul(${this.value})`,
      [CommonFunctionTypes.ceil]: `ceil(${this.value})`,
      [CommonFunctionTypes.round]: `round(${this.value})`,
    };

    return (
      formulaMap[this.funcType] || this.formulaTextValue || String(this.value)
    );
  }

  /**
   * 获取公式文本值
   * @returns 公式文本值
   */
  getFormulaTextValue(): string {
    return this.getFormulaTextValueBody();
  }

  /**
   * 获取公式文本字符体
   * 根据函数类型生成对应的字符表示
   * @returns 公式字符表示
   */
  getFormulaTextCharacterBody(): string {
    if (this.type === NodeType.CalculationLayer) {
      return this.body ? this.body.getFormulaTextCharacter() : "";
    }

    if (this.type === NodeType.Macro) {
      return this.getValue();
    }

    let cformulaTextCharacter = this.name;
    if (this.type === NodeType.Macro) {
      cformulaTextCharacter = `${this.name}_${this.TID}`;
    }

    // 根据funcType生成对应的字符表示
    const characterMap: { [key: number]: string } = {
      [HandleFunctionTypes["1-n"]]: `1-(${this.name})`,
      [HandleFunctionTypes["1/n"]]: `1/(${this.name})`,
      [HandleFunctionTypes["-n"]]: `-${this.name}`,
      [CommonFunctionTypes.abs]: `abs(${this.name})`,
      [CommonFunctionTypes.random]: `random()*(${this.name})`,
      [CommonFunctionTypes.floor]: `floor(${this.name})`,
      [CommonFunctionTypes.sqrt]: `sqrt(${this.name})`,
      [CommonFunctionTypes.log]: `log(${this.name})`,
      [CommonFunctionTypes.exp]: `exp(${this.name})`,
      [CommonFunctionTypes.cbrt]: `cbrt(${this.name})`,
      [HandleFunctionTypes["n*2"]]: `${this.name}*2`,
      [HandleFunctionTypes["n/2"]]: `${this.name}/2`,
      [HandleFunctionTypes["n*100"]]: `${this.name}*100`,
      [HandleFunctionTypes["n/100"]]: `${this.name}/100`,
      [HandleFunctionTypes["n*n"]]: `${this.name}*${this.name}`,
      [TriangleFunctionTypes["n*pi"]]: `${this.name}*PI`,
      [TriangleFunctionTypes.cos]: `cos(${this.name})`,
      [TriangleFunctionTypes.sin]: `sin(${this.name})`,
      [TriangleFunctionTypes.tan]: `tan(${this.name})`,
      [TriangleFunctionTypes.acos]: `acos(${this.name})`,
      [TriangleFunctionTypes.asin]: `asin(${this.name})`,
      [TriangleFunctionTypes.atan]: `atan(${this.name})`,
      [CommonFunctionTypes.sign]: `sign(${this.name})`,
      [CommonFunctionTypes.imul]: `imul(${this.name})`,
      [CommonFunctionTypes.ceil]: `ceil(${this.name})`,
      [CommonFunctionTypes.round]: `round(${this.name})`,
    };

    return characterMap[this.funcType] || cformulaTextCharacter;
  }

  /**
   * 获取公式文本字符
   * @returns 公式字符表示
   */
  getFormulaTextCharacter(): string {
    return this.getFormulaTextCharacterBody();
  }

  /**
   * 移除子项
   * @param child 要移除的子项
   */
  removeChild(child: any): void {
    const index = this.childArray.indexOf(child);
    if (index > -1) {
      this.childArray.splice(index, 1);
    }
  }

  /**
   * 浅度销毁
   * 清理引用和重置数据
   */
  dispose(): void {
    if (this.source != null) {
      this.source.removeChild(this);
    }
    this.macros = "";
    this.childArray = [];
  }

  /**
   * 设置参数
   * @param name 参数名称
   * @param value 参数值
   */
  setParameter(name: string, value: any): void {
    this.name = name;
    this.value = value;
  }

  /**
   * 更新子项信息
   * 同步更新所有子项的基本信息
   */
  upDataChild(): void {
    for (const child of this.childArray) {
      child.name = this.name;
      child.value = this.value;
      child.body = this.body;
      child.TID = this.TID;
    }
  }

  /**
   * 修改子项信息
   * 递归更新所有子项的信息
   * @param name 名称
   * @param value 值
   */
  setDataChild(name: string, value: any): void {
    this.name = name;
    this.value = value;
    for (const child of this.childArray) {
      child.setDataChild(name, value);
    }
  }

  /**
   * 同步运算体
   * 同步所有子项的运算体引用
   */
  syncBody(): void {
    for (const child of this.childArray) {
      child.body = this.body;
    }
  }


  /**
   * 复制变量值
   * 创建当前变量值的副本
   * @returns 复制后的变量值实例
   */
  copy(): any {
    const copyChild = new fx.VariableValue(
      this.name,
      this.value,
      this.type,
      this.operator
    );

    copyChild.source = this;
    copyChild.body = this.body;
    copyChild.TID = this.TID;
    this.childArray.push(copyChild);

    return copyChild;
  }
}
