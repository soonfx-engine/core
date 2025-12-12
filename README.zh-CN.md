<div align="center">

# SoonFx Runtime

> **TypeScript 游戏数值引擎。**  
> 将逻辑与代码解耦，轻松管理复杂公式，构建稳健的 RPG/SLG/卡牌系统。

[![npm version](https://img.shields.io/npm/v/@soonfx/engine.svg)](https://www.npmjs.com/package/@soonfx/engine)
[![npm downloads](https://img.shields.io/npm/dm/@soonfx/engine.svg)](https://www.npmjs.com/package/@soonfx/engine)
[![CI](https://github.com/soonfx-engine/core/actions/workflows/ci.yml/badge.svg)](https://github.com/soonfx-engine/core/actions/workflows/ci.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

[安装](#-安装) · [快速开始](#-快速开始) · [文档](#-核心-api) · [示例项目](examples) · [路线图](ROADMAP.md) · [在线演示](https://soonfx.dev)

[English](README.md) | [简体中文](README.zh-CN.md)

</div>

---

## ❓ 什么是 SoonFx?

SoonFx 是一个专为游戏设计的 **TypeScript 优先的数值引擎**。它旨在解决管理复杂游戏逻辑、公式和数值关系时常遇到的挑战，避免逻辑变成难以维护的“面条代码”。

### 🚫 痛点

在许多游戏项目中，伤害计算、资源产出率和其他数值逻辑往往直接硬编码在源代码中。

*   **难以维护**: 公式被深埋在嵌套的 if-else 语句中。
*   **迭代缓慢**: 策划想要修改一个简单的常数或公式结构，都需要程序员配合修改代码。
*   **容易出错**: 复制粘贴逻辑容易引入难以察觉的 Bug。

### ✅ 解决方案

SoonFx 将 **逻辑** 与 **代码** 解耦。

1.  **逻辑即数据**: 公式和关系被定义为数据（JSON）。
2.  **运行时执行**: 引擎在运行时安全地解析并执行这些数据。
3.  **可视化工具**: 策划使用 [SoonFx Editor](https://github.com/soonfx-engine/editor) 可视化地构建这些关系。

---

## 🎨 可视化编辑器驱动

告别硬编码公式。实现可视化构建。

**SoonFx Runtime** 是 **[SoonFx Editor](https://github.com/soonfx-engine/editor)** 的核心引擎。它允许游戏策划在不写一行代码的情况下配置复杂的逻辑，而开发者可以在运行时安全地执行它。

### 工作流

1.  **设计**：策划在 **可视化编辑器** 中创建公式、技能效果和属性关系。
2.  **导出**：编辑器生成 JSON 配置文件。
3.  **运行**：**SoonFx Runtime** 加载此 JSON 并在游戏中执行逻辑。

> **注意**：虽然 SoonFx Runtime 可以独立用于数学和表达式计算，但与编辑器搭配使用才能释放其真正潜能。

![SoonFx Editor](assets/editor.gif)

## 💡 使用场景

SoonFx 专为重数值游戏类型设计：

*   ⚔️ **RPG 系统**：技能伤害、角色属性成长、装备加成、战斗力 (CP) 计算。
*   🏰 **SLG / 策略**：资源产出率、建筑升级时间、行军时间、科技树要求。
*   🃏 **卡牌游戏**：动态卡牌数值、羁绊效果、牌组平衡模拟。
*   📊 **模拟仿真**：复杂的经济模型、概率计算。

---

## 📸 演示

### [运行时演示](https://soonfx.dev/)

![Demo](assets/demo1.gif) 
![Demo](assets/demo2.gif)

## ✨ 核心特性

- ⚡ **零依赖** - 轻量且快速，压缩后小于 50KB
- 🛡️ **类型安全** - 完整的 TypeScript 支持，提供严格类型定义和智能代码补全
- 📐 **表达式引擎** - 解析并评估复杂的数学表达式，支持 RPN 转换
- 🎮 **战斗系统** - 内置 RPG 战斗模拟，支持角色属性和伤害计算
- 🔧 **可扩展** - 灵活的操作符系统，支持复杂游戏逻辑和公式组合
- 📦 **Tree-shakable** - 现代 ESM 支持，兼容 CommonJS

## 🚀 面向用户

在您的项目中使用本库：

```bash
npm install @soonfx/engine
```

## 📦 开发环境设置

克隆并设置开发环境：

```bash
# 克隆仓库
git clone https://github.com/soonfx-engine/core.git
cd core

# 安装依赖
npm install

# 构建项目
npm run build

# 运行示例
cd examples
npm install
npm run dev
```

## 🎯 快速开始

### 基础使用

```typescript
import { fx } from '@soonfx/engine';

// 1. 使用数学工具函数
const distance = fx.distance(0, 0, 10, 10);
console.log('两点之间的距离:', distance); // 14.142135623730951

// 2. 表达式计算
const result = fx.evaluateExpression('(2 + 3) * 4');
console.log('表达式结果:', result); // 20

// 3. 数值处理
const fixed = fx.fixedDecimal(3.14159, 2);
console.log('保留两位小数:', fixed); // 3.14
```

### 事件系统

```typescript
import { Eve, Call, CallCenter } from '@soonfx/engine';

// 创建事件调用中心
const callCenter = new CallCenter();

// 监听事件
callCenter.addEventListener(Eve.SHIFT_ADD_BOARD, (data) => {
    console.log('看板添加事件触发:', data);
});

// 发送事件
Call.send(Eve.ADD_DATABASE_DATA, [data, body, index]);
```

## 📚 核心 API

### 数学工具 (fx)

#### 向量与几何运算
```typescript
// 计算两点之间的距离
const distance = fx.distance(x1, y1, x2, y2);

// 向量点积
const dotProduct = fx.dot(p1x, p1y, p2x, p2y);

// 向量叉积
const crossProduct = fx.cross(p1x, p1y, p2x, p2y);

// 计算向量长度
const length = fx.length(a, b);

// 坐标转换
const coord = fx.coordinate(x, y, angle, distance);
```

### 游戏角色 (Player)

`Player` 类提供角色属性、战斗计算和战斗模拟功能。完整的战斗系统演示请参见下方的 [示例项目](#-示例) 部分。

## 🏗️ 系统架构

```
@soonfx/fx
├── 核心系统 (core/)
│   ├── EventManager      事件管理器
│   ├── System            系统基类
│   └── Types             类型定义
│
├── 数学运算模块
│   ├── Vector            向量运算 (dot, cross, distance)
│   ├── Numeric           数值处理 (fixedDecimal, currencyConversion)
│   └── Geometry          几何计算 (coordinate, length)
│
├── 表达式系统
│   ├── Parser            表达式解析器
│   ├── RPN Converter     逆波兰表达式转换
│   └── Evaluator         求值引擎
│
├── 数据管理 (data/)
│   ├── Layers            图层系统
│   ├── Metadata          元数据管理
│   ├── Models            数据模型
│   └── Storage           存储系统
│
├── 游戏系统 (game/)
│   ├── FXCentre          游戏引擎核心
│   ├── Player            玩家角色系统
│   └── Formulas          公式计算系统
│
├── 通信系统 (communication/)
│   ├── Events            事件系统
│   ├── Call              事件调用
│   └── Message           消息传递
│
└── 工具函数 (utils/)
    └── ExtendsUtil       扩展工具
```

## 📖 示例

查看 [示例项目](https://github.com/soonfx-engine/core/tree/main/examples) 获取完整的开发示例。

### 示例内容：

- ⚔️ 战斗系统模拟
- 📊 角色属性计算
- 🎯 PVE 数据生成
- 📈 多场战斗对比分析
- 🎮 完整的游戏数值系统演示

### 本地运行示例：

查看贡献部分的 [快速开始](#快速开始) 了解设置说明。

## 🛠️ TypeScript 支持

SoonFx 提供完整的 TypeScript 类型定义：

```typescript
// 自动类型推导
const distance: number = fx.distance(0, 0, 10, 10);

// 完整的智能提示
fx. // IDE 会显示所有可用方法
```

### 类型定义特性：

- ✅ 完整的 TypeScript 类型定义 (.d.ts)
- ✅ 智能代码补全
- ✅ 类型检查和错误提示
- ✅ 参数类型推导
- ✅ 返回值类型推导

## 🔧 浏览器和环境支持

### 支持的环境

- ✅ **Node.js** >= 14.0.0
- ✅ **现代浏览器** (支持 ES2015+)
  - Chrome、Firefox、Safari、Edge（最新版本）
- ✅ **构建工具**
  - esbuild（推荐，项目使用）
  - Webpack、Vite、Rollup 等现代打包工具

### 模块系统

- ✅ **ESM** (ES Modules) - 推荐
- ✅ **CommonJS** - Node.js 环境

## 🤝 贡献

我们欢迎所有形式的贡献！

### 快速开始

首先，克隆仓库：

```bash
git clone https://github.com/soonfx-engine/core.git
cd core
```

#### 运行示例：

```bash
# 进入示例目录
cd examples

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

#### 参与开发：

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 运行测试（如果可用）
npm test
```

## 🗺️ 路线图

查看我们的 [路线图](ROADMAP.md) 了解计划中的功能和改进。

## 📝 更新日志

查看 [完整更新日志](https://github.com/soonfx-engine/core/releases)

## 📄 许可证

本项目采用 [Apache 2.0 许可证](LICENSE)。您可以自由使用、修改和分发本项目。

## 🔗 相关链接

- 📦 [npm 包](https://www.npmjs.com/package/@soonfx/engine)
- 💻 [GitHub 仓库](https://github.com/soonfx-engine/core)
- 📖 [在线演示](https://soonfx.dev)
- 🐛 [问题反馈](https://github.com/soonfx-engine/core/issues)
- 💬 [讨论区](https://github.com/soonfx-engine/core/discussions)

## 📞 获取帮助

如果您在使用过程中遇到问题：

- 💬 [GitHub Discussions](https://github.com/soonfx-engine/core/discussions) - 提问和讨论
- 🐛 [GitHub Issues](https://github.com/soonfx-engine/core/issues) - Bug 报告和功能请求
- 📧 [jiyisoon@163.com](mailto:jiyisoon@163.com) - 邮件联系

## ⭐ Star History

如果这个项目对您有帮助，请给我们一个 Star！这对我们非常重要。

[![Star History Chart](https://api.star-history.com/svg?repos=soonfx-engine/core&type=Date)](https://star-history.com/#soonfx-engine/core&Date)

---

<div align="center">

**[⬆ 回到顶部](#soonfx-runtime)**

Made with ❤️ by [SoonFx Team](https://github.com/soonfx-engine)

Copyright © 2025 SoonFx Team. All rights reserved.

</div>
