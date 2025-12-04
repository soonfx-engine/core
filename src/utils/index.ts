import { BasicBody } from "../data/models/BasicBody";
export { MathUtils } from "./MathUtils";
export * from "./MathUtils";

/**
 * 安全获取 BasicBody 对象的值
 *
 * 该函数用于安全地获取 BasicBody 实例的计算值，当计算过程中发生异常时，
 * 会捕获错误并返回默认值 0，确保程序的稳定性。
 *
 * @param body - BasicBody 实例，包含需要计算的数据模型
 * @returns 计算后的数值，如果计算失败则返回 0
 *
 * @example
 * ```typescript
 * const body = new BasicBody();
 * // ... 配置 body 的数据和公式
 * const result = getCatchValue(body);
 * console.log(result); // 输出计算结果或 0
 * ```
 *
 * @throws 不会抛出异常，所有错误都会被捕获并记录到控制台
 *
 * @since 1.0.0
 * @version 2.0.0
 */
export function getCatchValue(
  body: BasicBody,
  name?: string,
  row?: string,
  col?: string
): number {
  let value = 0;
  try {
    value = body.getValue(name, row, col);
  } catch (e) {
    console.log(e);
    value = 0;
  }
  return value;
}
