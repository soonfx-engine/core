import { fx } from "../../core/system/System";
import { EventManager as Eve } from "../../core/events/EventManager";
import { CallCenter } from "../../communication/messaging/CallCenter";
import { Folder } from "../../data/storage/Folder";
import { VariableValue } from "../../data/models/VariableValue";
import { FormulaData } from "../../data/metadata/FormulaData";
import { createLogger } from "../../utils/Logger";

const logger = createLogger("game/combat/Player");

/**
 * 参数信息接口
 * 定义单个参数的结构，包含路径和数值
 */
export interface Parameter {
  /** 参数的路径地址 */
  path: string;
  /** 参数的数值 */
  value: number;
}

/**
 * 看板信息接口
 * 定义属性看板的结构，包含看板名称和参数列表
 */
export interface BillboardInfo {
  /** 看板名称 */
  name: string;
  /** 看板包含的参数列表 */
  parameter: Parameter[];
}

/**
 * 参数信息接口
 * 定义玩家角色的完整参数配置信息
 */
export interface ParameterInfo {
  /** 参数信息的唯一标识ID */
  id: number;
  /** 参数信息的名称 */
  parameterInfoname: string;
  /** 是否被选中 */
  selected: boolean;
  /** 参数信息包含的看板数组 */
  parameterInfoArray: BillboardInfo[];
}
/**
 * 玩家类 - 游戏中玩家角色的核心类
 * 负责管理玩家的属性、战斗逻辑、生命值、护盾、攻击等功能
 */
export class Player {
  /** 玩家名称 */
  name: string = "";

  /** 当前生命值 */
  hp: number = 0;

  /** 最大生命值 */
  maxHp: number = 0;

  /** 最大护盾值 */
  maxShield: number = 0;

  /** 当前护盾值 */
  shield: number = 0;

  /** 敌对实体引用 */
  enemyBody: any = null;

  /** 战斗池 - 存储战斗相关对象 */
  battlePool: any[] = [];

  /** 变量列表 - 存储玩家变量数据 */
  valist: any[] = [];

  /** 生命列表 - 存储生命相关数据 */
  lflist: any[] = [];

  /** 血条列表 - 存储血条显示相关数据 */
  brlist: any[] = [];

  /** 实例化对象引用 */
  instantiation: any = null;

  /** 玩家数据文件夹 */
  playerData: Folder | null = null;

  /** 数据存储文件夹 */
  folder: Folder | null = null;

  /** 最大HP公式名称 */
  comboxMaxHp: string = "未设置血量公式";

  /** 攻击公式名称 */
  combBoxAttack: string = "未设置攻击公式";

  /** 受攻击时触发的公式名称 */
  underAttackName: string = "";

  /** 护盾破裂时触发的公式名称 */
  shieldRuptureName: string = "";

  /** 是否已检测护盾破裂 */
  isShieldDetection: boolean = false;

  /** 死亡时触发的公式名称 */
  dieName: string = "";

  /** 玩家是否已死亡 */
  isDie: boolean = false;

  /** 延迟执行的自定义属性列表 */
  delayCustomList: string[] = [];

  /** 通信调用中心 */
  callCenter: CallCenter | null = null;

  /** 玩家标签数组 - 用于标记玩家状态 */
  tagArray: Array<{ name: string }> = [];

  /** 玩家唯一标识ID */
  id: number = 0;

  /** 构造器名称 */
  constructorName: string = "Player";

  /** 攻击次数统计 */
  attackNum: number = 0;

  /** 当前等级 */
  level: number = 1;

  /** 等级变量名称 */
  levelVar: string = "";

  /** 最大等级上限 */
  maxLEvel: number = 100;

  /** 当前经验值 */
  exp: number = 0;

  /** 经验值变量名称 */
  expName: string = "";

  /** 升级配置对象 */
  levelUpConfig: any = {};

  /** 参数信息数组 - 用于存储角色的参数配置信息 */
  parameterInfoArray: ParameterInfo[] = [];
  /**
   * 构造函数 - 初始化玩家对象
   * 设置所有默认属性值并注册事件监听器
   */
  constructor() {
    // if (fx.code) initFXJsonData();
    this.name = "";
    this.hp = 0;
    this.maxHp = 0;
    this.maxShield = 0;
    this.shield = 0;
    this.enemyBody = null;
    this.level = 1;
    this.levelVar = "";
    //战斗池
    this.battlePool = [];
    this.valist = [];
    this.lflist = [];
    this.brlist = [];
    this.instantiation = null;
    this.playerData = null;
    this.updatePlayerData();
    this.comboxMaxHp = "未设置血量公式";
    this.combBoxAttack = "未设置攻击公式";
    this.underAttackName = "";
    this.shieldRuptureName = "";
    this.isShieldDetection = false;
    this.dieName = "";
    this.isDie = false;
    this.delayCustomList = [];
    this.callCenter = new CallCenter();
    this.callCenter.addEventListener(
      Eve.UP_DATA_PLAYER,
      this.upDataPlayerFunction,
      null,
      this
    );

    //标签数组
    this.tagArray = [];

    this.id = ++Eve.IDINDEX;
    this.constructorName = "Player";
    this.attackNum = 0;
  }

  /**
   * 重置所有标签
   * 清空玩家的标签数组
   */
  resetTag(): void {
    this.tagArray = [];
  }

  /**
   * 获取指定名称标签的数量
   * @param name - 标签名称
   * @returns 该标签在标签数组中出现的次数
   */
  gesetTagPopulation(name: string): number {
    let index = 0;
    for (let i = 0; i < this.tagArray.length; i++) {
      if (this.tagArray[i].name == name) {
        index++;
      }
    }
    return index;
  }

  /**
   * 获取所有标签
   * @returns 包含所有标签的数组
   */
  gesetTagAll(): Array<{ name: string }> {
    return this.tagArray;
  }

  /**
   * 添加标签
   * @param name - 要添加的标签名称
   */
  addTag(name: string): void {
    this.tagArray.push({ name: name });
  }

  /**
   * 更新玩家数据的事件处理函数
   * @param e - 事件对象
   */
  upDataPlayerFunction(e: any): void {
    this.updatePlayerData();
  }

  /**
   * 更新玩家数据
   * 重置攻击次数并重新创建玩家数据
   */
  updatePlayerData(): void {
    fx.player = this;
    this.attackNum = 0;
    this.playerData = this.createPlayer();
  }

  /**
   * 递归更新数据
   * 遍历树结构，更新变量值和敌对实体引用
   * @param tree - 数据树结构数组
   * @param target - 目标对象
   */
  recursionSet(tree: any[], target: any): void {
    fx.player = this;
    for (let i = 0; i < tree.length; i++) {
      if (tree[i] instanceof VariableValue) {
        if (tree[i].enemyFlag) {
          if (target == null) {
            tree[i].setEnemyBody(null);
          } else {
            tree[i].setEnemyBody(
              target.getPropertyObject(tree[i].source.absoluteAddress)
            );
          }
          //tree[i].setValue(target.getProperty(tree[i].source.absoluteAddress))
        }
      } else {
        this.recursionSet(tree[i].tree, target);
      }
    }
  }

  /**
   * 获取公式执行结果
   * 根据公式名称计算并返回公式的值
   * @param name - 公式名称
   * @returns 公式计算结果
   */
  getFormula(name: string): number {
    fx.player = this;
    fx.clearCacheRecursion(this.folder);
    //this.recoveryAttribute();
    let damage = 0;
    for (let i = 0; i < this.playerData!.formulaTree.length; i++) {
      if (this.playerData!.formulaTree[i].name == name) {
        //fx.enemyBody = target;

        damage = this.playerData!.formulaTree[i].body.getValue();
        //fx.enemyBody = null;
        break;
      }
    }

    for (let i = 0; i < fx.stageStoragePool.length; i++) {
      if (fx.stageStoragePool[i] instanceof FormulaData) {
        if (fx.stageStoragePool[i].name == name) {
          //fx.enemyBody = target;

          damage = fx.stageStoragePool[i].body.getValue();
          //fx.enemyBody = null;
        }
      }
    }

    return damage;
  }

  /**
   * 设置延迟执行
   * 实现基于次数的延迟执行机制
   * @param name - 延迟标识名称
   * @param value - 触发次数阈值
   * @param value2 - 最大执行次数
   * @param fun - 延迟执行的回调函数
   */
  delay(name: string, value: number, value2: number, fun: () => void): void {
    const ids = name + "次数";
    if ((this as any)["" + name] == null) {
      (this as any)["" + name] = 0;
      this.delayCustomList.push("" + name);
    }
    if ((this as any)["" + ids] == null) {
      (this as any)["" + ids] = 0;
      this.delayCustomList.push("" + ids);
    }
    (this as any)["" + name]++;
    if (
      (this as any)["" + name] >= value &&
      Number((this as any)["" + ids]) <= Number(value2) + 1
    ) {
      (this as any)["" + name] = 0;
      (this as any)["" + ids]++;
      fun();
    }
  }

  /**
   * 手动攻击
   * 触发实例化对象的攻击行为
   * @param name - 攻击名称
   * @param delay - 延迟时间
   * @param amount - 攻击次数
   */
  hit(name: string, delay: number, amount: number): void {
    if (this.instantiation != null) {
      // this.instantiation.手动攻击(name, delay, amount);
    }
  }

  /**
   * 攻击目标
   * 根据公式名称对目标进行攻击，计算伤害并扣除生命值或护盾
   * @param name - 攻击公式名称
   * @param target - 攻击目标对象
   * @returns 包含伤害值和是否暴击的元组 [伤害值, 是否暴击]
   */
  attack(name: string, target: any): [number, boolean] {
    this.attackNum++;
    fx.player = this;
    fx.clearCacheRecursion(this.folder);
    //this.recoveryAttribute();
    fx.isCrit = false;
    let damage = 0;
    let killEnemeNum = 0;
    for (let i = 0; i < this.playerData!.formulaTree.length; i++) {
      if (this.playerData!.formulaTree[i].name == name) {
        fx.enemyBody = target;

        this.enemyBody = target;
        damage = this.playerData!.formulaTree[i].body.getValue();
        const isDie = target.isDie;
        if (target.getShield() != 0) {
          target.minusShield(damage);
        } else {
          target.minusHp(damage);
        }
        if (!isDie && target.isDie) {
          killEnemeNum++;
        }
        fx.enemyBody = null;
        break;
      }
    }

    for (let i = 0; i < fx.stageStoragePool.length; i++) {
      if (fx.stageStoragePool[i] instanceof FormulaData) {
        if (fx.stageStoragePool[i].name == name) {
          fx.enemyBody = target;
          this.enemyBody = target;
          damage = fx.stageStoragePool[i].body.getValue();
          const isDie = target.isDie;
          if (target.getShield() != 0) {
            target.minusShield(damage);
          } else {
            target.minusHp(damage);
          }

          if (!isDie && target.isDie) {
            killEnemeNum++;
          }
          fx.enemyBody = null;
        }
      }
    }
    if (killEnemeNum > 0) {
      this.onEnmeyKilled(killEnemeNum);
    }
    return [damage, fx.isCrit];
  }

  /**
   * 获取升级所需经验值
   * @returns 升级所需的经验值
   */
  getNeedExp(): number {
    return 1;
  }

  /**
   * 击杀敌人回调
   * 增加经验值并检查是否升级
   * @param killEnemeNum - 击杀敌人的数量
   */
  onEnmeyKilled(killEnemeNum: number): void {
    this.exp += killEnemeNum;
    this.checkUpdateLevel();
  }

  /**
   * 检查并更新等级
   * 如果经验值满足条件，则升级并触发升级事件
   */
  checkUpdateLevel(): void {
    const needExp = this.getNeedExp();
    if (this.exp >= needExp && this.level < this.maxLEvel) {
      this.level++;
      this.exp = 0;
      fx.Call.send(Eve.PLAYER_INSTANCE_LEVEL_UP, [
        this.id,
        this.level,
        this.exp,
      ]);
    }
  }

  /**
   * 设置最大护盾值
   * 根据公式名称计算并设置最大护盾和当前护盾值
   * @param name - 护盾公式名称，传入"无"则设置为0
   * @returns 设置后的最大护盾值
   */
  setMaxShield(name: string): number {
    fx.player = this;
    fx.clearCacheRecursion(this.folder);
    this.maxShield = 0;
    this.shield = 0;
    for (let i = 0; i < this.playerData!.formulaTree.length; i++) {
      if (this.playerData!.formulaTree[i].name == name) {
        this.maxShield = this.playerData!.formulaTree[i].body.getValue();
        this.shield = this.maxShield;
        break;
      }
    }

    for (let i = 0; i < fx.stageStoragePool.length; i++) {
      if (fx.stageStoragePool[i] instanceof FormulaData) {
        if (fx.stageStoragePool[i].name == name) {
          this.maxShield = fx.stageStoragePool[i].body.getValue();
          this.shield = this.maxShield;
        }
      }
    }
    if (name == "无") this.maxShield = this.shield = 0;
    this.isShieldDetection = false;
    return this.maxShield;
  }

  /**
   * 设置最大生命值
   * 根据公式名称计算并设置最大生命值和当前生命值
   * @param name - 生命值公式名称，传入"无"则设置为0
   * @returns 设置后的最大生命值
   */
  setMaxHp(name: string): number {
    fx.player = this;
    fx.clearCacheRecursion(this.folder);
    this.maxHp = 0;
    this.hp = 0;
    for (let i = 0; i < this.playerData!.formulaTree.length; i++) {
      if (this.playerData!.formulaTree[i].name == name) {
        this.maxHp = this.playerData!.formulaTree[i].body.getValue();
        this.hp = this.maxHp;
        break;
      }
    }

    for (let i = 0; i < fx.stageStoragePool.length; i++) {
      if (fx.stageStoragePool[i] instanceof FormulaData) {
        if (fx.stageStoragePool[i].name == name) {
          this.maxHp = fx.stageStoragePool[i].body.getValue();
          this.hp = this.maxHp;
        }
      }
    }
    if (name == "无") this.maxHp = this.hp = 0;
    this.isDie = false;
    for (let i = 0; i < this.delayCustomList.length; i++) {
      (this as any)[this.delayCustomList[i]] = null;
    }
    return this.maxHp;
  }

  /**
   * 获取最大生命值
   * @returns 最大生命值
   */
  getMaxHp(): number {
    return this.maxHp;
  }

  /**
   * 获取最大护盾值
   * @returns 最大护盾值
   */
  getMaxShield(): number {
    return this.maxShield;
  }

  /**
   * 获取当前护盾值
   * @returns 当前护盾值
   */
  getShield(): number {
    return this.shield;
  }

  /**
   * 获取当前生命值
   * @returns 当前生命值
   */
  getHp(): number {
    return this.hp;
  }

  /**
   * 设置当前生命值
   * @param value - 要设置的生命值
   */
  setHp(value: number): void {
    this.hp = value;
  }

  /**
   * 设置当前护盾值
   * @param value - 要设置的护盾值
   */
  setShield(value: number): void {
    this.shield = value;
  }

  /**
   * 受到攻击时的处理
   * 触发受攻击公式
   */
  underAttack(): void {
    this.getFormula(this.underAttackName);
  }

  /**
   * 设置护盾破裂时触发的公式
   * @param name - 公式名称
   */
  setshieldRupture(name: string): void {
    this.shieldRuptureName = name;
  }

  /**
   * 设置被攻击时触发的公式
   * @param name - 公式名称
   */
  setUnderAttack(name: string): void {
    this.underAttackName = name;
  }

  /**
   * 护盾破裂时的处理
   * 触发护盾破裂公式并标记护盾已被检测
   */
  shieldRupture(): void {
    this.getFormula(this.shieldRuptureName);
    this.isShieldDetection = true;
  }
  /**
   * 减少护盾值
   * 扣除护盾伤害，护盾归零时触发护盾破裂
   * @param damage - 伤害值
   * @returns 剩余护盾值
   */
  minusShield(damage: number): number {
    this.shield -= damage;
    if (this.shield <= 0 && this.isShieldDetection == false) {
      this.shield = 0;
      this.shieldRupture();
    }
    this.underAttack();
    return this.shield;
  }

  /**
   * 设置死亡时触发的公式
   * @param name - 公式名称
   */
  setDie(name: string): void {
    this.dieName = name;
  }

  /**
   * 死亡处理
   * 触发死亡公式并标记玩家已死亡
   */
  die(): void {
    this.getFormula(this.dieName);
    this.isDie = true;
  }

  /**
   * 减少生命值
   * 扣除生命值伤害，生命值归零时触发死亡
   * @param damage - 伤害值
   * @returns 剩余生命值
   */
  minusHp(damage: number): number {
    this.hp -= damage;
    if (this.hp <= 0 && this.isDie == false) {
      this.hp = 0;
      this.die();
    }
    this.underAttack();
    return this.hp;
  }

  /**
   * 获取属性看板
   * 递归获取玩家数据的属性看板列表
   * @returns 属性看板数组
   */
  getBillboard(): any[] {
    fx.player = this;
    const arraylist: any[] = [];
    fx.recursionGetBillboard(arraylist, this.playerData);
    if (arraylist.length == 0) {
      return fx.billBoardList;
    }
    return arraylist;
  }

  /**
   * 获取属性对象
   * 根据绝对地址路径获取玩家数据中的属性对象
   * @param site - 属性的绝对地址路径
   * @param value - 可选的值参数
   * @returns 属性对象
   */
  getPropertyObject(site: string, value?: any): any {
    fx.player = this;
    return fx.getBody(
      this.playerData,
      fx.parseAbsoluteAddress(site),
      value
    );
  }

  /**
   * 设置属性值
   * 根据绝对地址路径设置玩家数据中的属性值
   * @param site - 属性的绝对地址路径
   * @param value - 要设置的值
   * @returns 设置后的值
   */
  setProperty(site: string, value: any): any {
    fx.player = this;
    //if(fx.code)
    //this.updatePlayerData();

    const obj = this.getPropertyObject(site);
    if (obj != null) {
      obj.setValue(value);
    } else {
      logger.warn("Property not found", { site });
    }

    return value;
  }

  /**
   * 获取属性值
   * 根据绝对地址路径获取玩家数据中的属性值
   * @param site - 属性的绝对地址路径
   * @param value - 可选的值参数
   * @returns 属性值
   */
  getProperty(site: string, value?: any): number {
    fx.player = this;
    fx.clearCache();
    const obj = this.getPropertyObject(site);

    if (obj != null) {
      return (fx.getBody(this.playerData, fx.parseAbsoluteAddress(site), value) as any)
        .getValue();
    } else {
      logger.warn("Property not found", { site });
    }
    return 0;
  }

  /**
   * 销毁玩家对象
   * 释放所有引用和资源，清理内存
   */
  dispose(): void {
    this.callCenter!.dispose();
    this.playerData!.dispose();
    this.name = "";
    this.hp = 0;
    this.maxHp = 0;
    this.playerData = null;
    this.callCenter = null;
    this.tagArray = [];
    this.id = 0;
    this.constructorName = "";
    this.attackNum = 0;
  }

  /**
   * 清理运算缓存
   * 清除玩家数据文件夹中的缓存信息
   */
  clearCache(): void {
    fx.player = this;
    fx.clearCacheRecursion(this.folder);
  }

  /**
   * 创建玩家数据
   * 从场景文件夹复制数据并创建玩家的独立数据文件夹
   * @returns 玩家数据文件夹
   */
  createPlayer(): Folder {
    this.attackNum = 0;
    fx.editBody = null;
    fx.selectBody = null;
    fx.isBodyView = false;
    this.folder = new fx.Folder();
    const copyArray: any[] = [];

    fx.addLibraryBody(copyArray, fx.targetFolder.tree);

    const libraryData = copyArray;
    fx.targetFolder = this.folder;
    fx.createLibraryBody(libraryData, true);
    fx.parseLibraryBody(libraryData, true);

    fx.recursionSyncBody(fx.targetFolder.tree);

    fx.editBody = null;
    fx.selectBody = null;
    fx.targetStoragePool = fx.stageStoragePool;
    fx.targetFolder = fx.sceneFolder;
    fx.isBodyView = true;

    this.valist = [];
    this.lflist = [];
    this.brlist = [];
    fx.recursiveDataReading(
      this.folder,
      this.valist,
      this.lflist,
      this.brlist
    );

    return this.folder;
  }

  /**
   * 恢复属性
   * 从变量列表中恢复所有属性的初始值
   */
  recoveryAttribute(): void {
    for (let i = 0; i < this.valist.length; i++) {
      this.setProperty(
        this.valist[i].absoluteAddress,
        Number(this.valist[i].value)
      );
    }
  }

  /**
   * 设置参数信息数组
   * @param parameterInfoArray 参数信息数组
   */
  setParameterInfoArray(parameterInfoArray: ParameterInfo[]): void {
    this.parameterInfoArray = parameterInfoArray;
  }

  /**
   * 获取参数信息数组
   * @returns 参数信息数组
   */
  getParameterInfoArray(): ParameterInfo[] {
    return this.parameterInfoArray;
  }

  /**
   * 根据玩家名称查找参数信息
   * @param playerName 玩家名称
   * @returns 匹配的参数信息，如果未找到返回null
   */
  findParameterInfoByName(playerName: string): ParameterInfo | null {
    return this.parameterInfoArray.find(
      (info) => info.parameterInfoname === playerName
    ) || null;
  }

  /**
   * 更新参数值
   * @param playerName 玩家名称
   * @param path 参数路径
   * @param value 新值
   * @returns 是否更新成功
   */
  updateParameterValue(playerName: string, path: string, value: number): boolean {
    const parameterInfo = this.findParameterInfoByName(playerName);
    if (!parameterInfo) {
      return false;
    }

    // 遍历参数信息数组，查找并更新匹配的参数
    for (const billboardInfo of parameterInfo.parameterInfoArray) {
      for (const parameter of billboardInfo.parameter) {
        if (parameter.path === path) {
          parameter.value = value;
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 获取参数值
   * @param playerName 玩家名称
   * @param path 参数路径
   * @returns 参数值，如果未找到返回null
   */
  getParameterValue(playerName: string, path: string): number | null {
    const parameterInfo = this.findParameterInfoByName(playerName);
    if (!parameterInfo) {
      return null;
    }

    // 遍历参数信息数组，查找匹配的参数
    for (const billboardInfo of parameterInfo.parameterInfoArray) {
      for (const parameter of billboardInfo.parameter) {
        if (parameter.path === path) {
          return parameter.value;
        }
      }
    }
    return null;
  }

  /**
   * 改变玩家等级和职业
   * @param level 目标等级
   * @param occupation 职业类型
   */
  changeLevelAndOccupation(level: number, occupation: number, options: { levelPath?: string, occupationPath?: string }
    = { levelPath: "等级", occupationPath: "职业" }
  ): void {
    const parameterInfo = this.findParameterInfoByName(this.name);
    if (!parameterInfo) {
      console.warn(`未找到玩家 "${this.name}" 的参数信息`);
      return;
    }

    // 遍历参数数组，更新等级和职业
    for (const billboardInfo of parameterInfo.parameterInfoArray) {
      for (const parameter of billboardInfo.parameter) {
        if (parameter.path === options.levelPath) {
          parameter.value = level;
        } else if (parameter.path === options.occupationPath) {
          parameter.value = occupation;
        }
      }
    }

    // 更新玩家自身的等级
    this.level = level;

    // 应用更新后的参数 - 对应 gameManualOverrideParameter 功能
    this.gameManualOverrideParameter(parameterInfo);
  }

  /**
   * 手动覆盖参数的辅助方法
   * 根据新的参数信息更新玩家的看板元数据
   * @param newParameterInfo 新的参数信息
   */
  private gameManualOverrideParameter(newParameterInfo: ParameterInfo): void {
    // 获取玩家的看板列表
    const billboardList = this.getBillboard();

    // 遍历新参数信息数组
    newParameterInfo.parameterInfoArray.forEach((newParam: BillboardInfo) => {
      if (newParam) {
        // 遍历看板列表
        billboardList.forEach((billboard: any) => {
          // 如果参数名称匹配看板名称
          if (newParam.name === billboard.name) {
            // 遍历参数数组
            newParam.parameter.forEach((param: Parameter) => {
              const targetPath = param.path;

              // 遍历看板的元数据数组
              billboard.metadataArray.forEach((meta: any) => {
                const pathArr: any[] = [];
                // 获取步骤数据路径
                fx.getStepData(meta.body.source, pathArr);
                const pathStr = pathArr.toString();

                // 如果路径匹配
                if (pathStr === targetPath) {
                  const oldValue = meta.body.getValue();
                  const newValue = Number(param.value);

                  // 如果值有变化，更新全局值
                  if (oldValue !== newValue) {
                    // console.log(pathStr, oldValue, '->', newValue);
                    meta.body.setGlobalValue(newValue);
                  }
                }
              });
            });
          }
        });
      }
    });
  }
}
