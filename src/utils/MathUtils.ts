/**
 * MathUtils - 数学工具模块
 * 提供向量运算、距离计算、插值等数学功能
 * 版本: 2.0.1
 * 重构日期: 2025年12月
 */

/**
 * 判断是否为有效数字
 * @param value 待检查的值
 * @returns 是否为有效数字
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * 混合公式 - 线性插值 (lerp)
 * @param v1 起始值
 * @param v2 结束值
 * @param t 混合系数 (0-1)
 * @returns 混合结果
 * @example
 * mix(0, 100, 0.5) // 返回 50
 * mix(10, 20, 0.25) // 返回 12.5
 */
export function mix(v1: number, v2: number, t: number): number {
  try {
    if (!isNumber(v1) || !isNumber(v2) || !isNumber(t)) {
      throw new Error("Invalid parameters for mix function");
    }
    return v1 * (1 - t) + v2 * t;
  } catch (error) {
    console.error("Error in mix function:", error);
    return 0;
  }
}

/**
 * 线性插值 (lerp 别名)
 * @param start 起始值
 * @param end 结束值
 * @param t 插值系数 (0-1)
 * @returns 插值结果
 */
export const lerp = mix;

/**
 * 计算向量的叉积 (2D)
 * @param p1x 第一个向量的x分量
 * @param p1y 第一个向量的y分量
 * @param p2x 第二个向量的x分量
 * @param p2y 第二个向量的y分量
 * @returns 叉积结果 (标量)
 * @example
 * cross(1, 0, 0, 1) // 返回 0
 */
export function cross(
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number
): number {
  try {
    if (!isNumber(p1x) || !isNumber(p1y) || !isNumber(p2x) || !isNumber(p2y)) {
      throw new Error("Invalid parameters for cross function");
    }
    return p1x * p2x - p1y * p2y;
  } catch (error) {
    console.error("Error in cross function:", error);
    return 0;
  }
}

/**
 * 计算向量的点积
 * @param p1x 第一个向量的x分量
 * @param p1y 第一个向量的y分量
 * @param p2x 第二个向量的x分量
 * @param p2y 第二个向量的y分量
 * @returns 点积结果
 * @example
 * dot(1, 0, 1, 0) // 返回 1
 * dot(1, 0, 0, 1) // 返回 0
 */
export function dot(
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number
): number {
  try {
    if (!isNumber(p1x) || !isNumber(p1y) || !isNumber(p2x) || !isNumber(p2y)) {
      throw new Error("Invalid parameters for dot function");
    }
    return p1x * p2x + p1y * p2y;
  } catch (error) {
    console.error("Error in dot function:", error);
    return 0;
  }
}

/**
 * 计算向量的长度 (模)
 * @param a x分量
 * @param b y分量
 * @returns 向量长度
 * @example
 * length(3, 4) // 返回 5
 */
export function length(a: number, b: number): number {
  try {
    if (!isNumber(a) || !isNumber(b)) {
      throw new Error("Invalid parameters for length function");
    }
    return Math.sqrt(a * a + b * b);
  } catch (error) {
    console.error("Error in length function:", error);
    return 0;
  }
}

/**
 * 计算两点之间的距离
 * @param p1x 第一个点的x坐标
 * @param p1y 第一个点的y坐标
 * @param p2x 第二个点的x坐标
 * @param p2y 第二个点的y坐标
 * @returns 距离值
 * @example
 * distance(0, 0, 3, 4) // 返回 5
 * distance(0, 0, 10, 10) // 返回 14.142135623730951
 */
export function distance(
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number
): number {
  try {
    if (!isNumber(p1x) || !isNumber(p1y) || !isNumber(p2x) || !isNumber(p2y)) {
      throw new Error("Invalid parameters for distance function");
    }
    const a = Math.abs(p1x - p2x);
    const b = Math.abs(p1y - p2y);
    return length(a, b);
  } catch (error) {
    console.error("Error in distance function:", error);
    return 0;
  }
}

/**
 * 将值限制在指定范围内
 * @param value 输入值
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的值
 * @example
 * clamp(5, 0, 10) // 返回 5
 * clamp(-5, 0, 10) // 返回 0
 * clamp(15, 0, 10) // 返回 10
 */
export function clamp(value: number, min: number, max: number): number {
  try {
    if (!isNumber(value) || !isNumber(min) || !isNumber(max)) {
      throw new Error("Invalid parameters for clamp function");
    }
    return Math.max(min, Math.min(max, value));
  } catch (error) {
    console.error("Error in clamp function:", error);
    return value;
  }
}

/**
 * 向量归一化
 * @param x x分量
 * @param y y分量
 * @returns 归一化后的向量 [x, y]
 * @example
 * normalize(3, 4) // 返回 [0.6, 0.8]
 */
export function normalize(x: number, y: number): [number, number] {
  try {
    if (!isNumber(x) || !isNumber(y)) {
      throw new Error("Invalid parameters for normalize function");
    }
    const len = length(x, y);
    if (len === 0) {
      return [0, 0];
    }
    return [x / len, y / len];
  } catch (error) {
    console.error("Error in normalize function:", error);
    return [0, 0];
  }
}

/**
 * MathUtils 命名空间导出
 * 提供统一的访问接口
 */
export const MathUtils = {
  isNumber,
  mix,
  lerp,
  cross,
  dot,
  length,
  distance,
  clamp,
  normalize,
};

export default MathUtils;

