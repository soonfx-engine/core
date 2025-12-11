---
layout: home

hero:
  name: "SoonFx"
  text: "TypeScript 优先的游戏数值引擎"
  tagline: "将逻辑与代码解耦，轻松管理复杂公式，构建稳健的 RPG/SLG/卡牌系统。"
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide/getting-started
    - theme: alt
      text: 查看 API
      link: /zh/api/core
    - theme: alt
      text: GitHub 仓库
      link: https://github.com/soonfx-engine/core

features:
  - title: 可视化编辑器驱动
    details: 告别硬编码公式。使用 SoonFx Editor 可视化构建逻辑，让策划无需写代码即可配置复杂的技能效果和属性关系。
    icon: 🎨
  - title: 类型安全 & 高性能
    details: 完整的 TypeScript 支持，严格的类型检查。零依赖，轻量级（<50KB），支持 Tree-shaking。
    icon: ⚡
  - title: 强大的表达式引擎
    details: 解析和评估复杂的数学表达式，支持 RPN 转换。内置丰富的数学函数和逻辑操作符，支持自定义扩展。
    icon: 📐
  - title: 专为游戏打造
    details: 专为 RPG 战斗系统、SLG 资源产出、卡牌游戏数值平衡和复杂经济系统模拟而设计。
    icon: 🎮
---

## 🎨 可视化编辑器驱动

告别硬编码公式。实现可视化构建。

**SoonFx Runtime** 是 **[SoonFx Editor](https://github.com/soonfx-engine/editor)** 的核心引擎。它允许游戏策划在不编写任何代码的情况下配置复杂的逻辑，而开发者可以在运行时安全地执行这些逻辑。

### 工作流

1.  **设计**: 策划在 **可视化编辑器** 中创建公式、技能效果和属性关系。
2.  **导出**: 编辑器生成 JSON 配置文件。
3.  **运行**: **SoonFx Runtime** 加载此 JSON 并在游戏中执行逻辑。

> **注意**: 虽然 SoonFx Runtime 可以独立用于数学计算和表达式求值，但配合编辑器使用才能释放其真正潜能。

![SoonFx Editor](/editor.gif)

## 💡 使用场景

SoonFx 专为数值密集型游戏类型设计：

*   ⚔️ **RPG 系统**: 技能伤害、角色属性成长、装备加成、战斗力 (CP) 计算。
*   🏰 **SLG / 策略**: 资源产出率、建筑升级时间、行军时间、科技树需求。
*   🃏 **卡牌游戏**: 动态卡牌数值、协同效应、卡组平衡性模拟。
*   📊 **模拟**: 复杂的经济模型、概率计算。

