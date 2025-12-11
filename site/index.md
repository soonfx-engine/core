---
layout: home

hero:
  name: "SoonFx"
  text: "The TypeScript-first numeric engine for games."
  tagline: "Decouple logic from code, manage complex formulas with ease, and build robust RPG/SLG/Card systems."
  image:
    src: /editor.gif
    alt: SoonFx Editor
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View API
      link: /api/core
    - theme: alt
      text: View on GitHub
      link: https://github.com/soonfx-engine/core

features:
  - title: Visual Editor Driven
    details: Stop hardcoding formulas. Build them visually. SoonFx Runtime powers the SoonFx Editor, allowing designers to configure logic without code.
    icon: 🎨
  - title: Type-Safe & Fast
    details: Full TypeScript support with strict typing. Zero dependencies, lightweight (<50KB), and tree-shakable.
    icon: ⚡
  - title: Powerful Expression Engine
    details: Parse and evaluate complex mathematical expressions with RPN conversion. Supports custom operators and functions.
    icon: 📐
  - title: Built for Games
    details: Specialized for RPG battle systems, SLG resource calculations, Card game balancing, and complex economy simulations.
    icon: 🎮
---

## 🎨 Visual Editor Driven

Stop hardcoding formulas. Build them visually.

**SoonFx Runtime** is the engine that powers the **[SoonFx Editor](https://github.com/soonfx-engine/editor)**. It allows game designers to configure complex logic without writing a single line of code, while developers can safely execute it at runtime.

### The Workflow

1.  **Design**: Designers create formulas, skill effects, and attribute relationships in the **Visual Editor**.
2.  **Export**: The editor generates a JSON configuration file.
3.  **Run**: The **SoonFx Runtime** loads this JSON and executes the logic in your game.

> **Note**: While SoonFx Runtime can be used standalone for math and expressions, its true power is unlocked when paired with the Editor.

![SoonFx Editor](/editor.gif)

## 💡 Use Cases

SoonFx is designed for numeric-heavy game genres:

*   ⚔️ **RPG Systems**: Skill damage, character stats growth, equipment bonuses, combat power (CP) calculations.
*   🏰 **SLG / Strategy**: Resource production rates, building upgrade timers, marching times, tech tree requirements.
*   🃏 **Card Games**: Dynamic card values, synergy effects, deck balancing simulation.
*   📊 **Simulation**: Complex economy models, probability calculations.

