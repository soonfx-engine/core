# 快速开始

## 安装

在你的项目中使用 npm 安装 SoonFx：

```bash
npm install @soonfx/engine
```

## 基础用法

### 数学工具 (Mathematical Utilities)

SoonFx 提供了一套专为游戏开发设计的健壮数学工具库。

```typescript
import { fx } from '@soonfx/engine';

// 1. 计算两点间距离 (x1, y1, x2, y2)
const distance = fx.distance(0, 0, 10, 10);
console.log('距离:', distance); // 14.142...

// 2. 评估字符串表达式
// 安全地计算数学公式字符串
const result = fx.evaluateExpression('(2 + 3) * 4');
console.log('结果:', result); // 20

// 3. 数值处理
const fixed = fx.fixedDecimal(3.14159, 2);
console.log('保留两位小数:', fixed); // 3.14
```

### 加载编辑器配置

如果你正在使用可视化编辑器，你需要加载导出的 JSON 配置文件。

```typescript
// 加载数据示例
// 假设 `configData` 是你导出的 JSON 数据
// const configData = await fetch('path/to/config.json').then(res => res.json());

// 使用数据初始化系统 (概念代码)
// ...
```

*关于加载编辑器数据的详细指南即将推出。*

## 下一步

- 探索 [可视化编辑器](/zh/guide/visual-editor) 工作流。
- 查看 [API 参考](/zh/api/core) 获取详细的类文档。

