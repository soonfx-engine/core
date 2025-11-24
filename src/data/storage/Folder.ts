
import { EventManager as Eve } from "../../core/events/EventManager";

/**
 * 文件夹类，用于管理树形结构的数据存储
 * 支持文件夹的创建、管理和子元素的增删操作
 */
export class Folder {
  /** 文件夹名称 */
  name: string | null;

  /** 标识是否为文件夹，默认为 true */
  isFolder: boolean = true;

  /** 是否显示该文件夹，默认为 true */
  isShow: boolean = true;

  /** 是否显示子项，默认为 true */
  isShowChild: boolean = true;

  /** 树形结构数组，存储子元素 */
  tree: any[] = [];

  /** 公式树数组，存储公式相关的数据 */
  formulaTree: any[] = [];

  /** 最小箭头视图对象 */
  minArrowsView: any | null = null;

  /** 构造器名称标识 */
  constructorName: string = "Folder";

  /** 唯一标识符 */
  id: number;

  /**
   * 创建文件夹实例
   * @param name - 文件夹名称，可选参数
   */
  constructor(name: string | null = null) {
    // 设置名称
    this.name = name;
    // ID
    this.id = ++Eve.IDINDEX;
  }

  /**
   * 设置文件夹名称
   * @param name - 新的文件夹名称
   */
  setName(name: string): void {
    this.name = name;
  }

  /**
   * 浅度销毁文件夹，清理相关数据
   * 将文件夹状态重置为初始状态
   */
  dispose(): void {
    this.name = null;
    this.isFolder = false;
    this.isShowChild = false;
    this.tree = [];
    this.formulaTree = [];
  }

  /**
   * 获取文件夹树的总高度
   * 递归计算所有可见子元素的高度
   * @returns 返回树的总高度
   */
  getMaxHeight(): number {
    let maxHeight = 1;
    for (let i = 0; i < this.tree.length; i++) {
      if (this.tree[i].isShow) {
        if (this.tree[i].isFolder) {
          maxHeight += this.tree[i].getMaxHeight();
        } else {
          maxHeight++;
        }
      }
    }
    return maxHeight;
  }

  /**
   * 检查是否可以添加子元素
   * 验证子元素是否已存在于树中
   * @param child - 要检查的子元素
   * @returns 如果子元素不存在则返回 true，否则返回 false
   */
  addTest(child: any): boolean {
    const index = this.tree.indexOf(child);

    if (index == -1) {
      return true;
    }
    return false;
  }

  /**
   * 在指定位置插入子元素
   * @param child - 要插入的子元素
   * @param index - 插入位置索引
   */
  spliceChild(child: any, index: number): void {
    if (this.addTest(child)) {
      this.tree.splice(index, 0, child);
    }
  }

  /**
   * 在树结构末尾添加子元素
   * @param child - 要添加的子元素
   */
  pushChild(child: any): void {
    if (this.addTest(child)) {
      this.tree.push(child);
    }
  }

  /**
   * 在树结构开头添加子元素
   * @param child - 要添加的子元素
   */
  unshiftChild(child: any): void {
    if (this.addTest(child)) {
      this.tree.unshift(child);
    }
  }

  /**
   * 从树结构中删除指定的子元素
   * @param child - 要删除的子元素
   */
  removeChild(child: any): void {
    if (!this.addTest(child)) {
      const index = this.tree.indexOf(child);
      this.tree.splice(index, 1);
    }
  }
}
