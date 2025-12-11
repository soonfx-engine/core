<div align="center">

# SoonFx Runtime

> **The TypeScript-first numeric engine for games.**  
> Decouple logic from code, manage complex formulas with ease, and build robust RPG/SLG/Card systems.

[![npm version](https://img.shields.io/npm/v/@soonfx/engine.svg)](https://www.npmjs.com/package/@soonfx/engine)
[![npm downloads](https://img.shields.io/npm/dm/@soonfx/engine.svg)](https://www.npmjs.com/package/@soonfx/engine)
[![CI](https://github.com/soonfx-engine/core/actions/workflows/ci.yml/badge.svg)](https://github.com/soonfx-engine/core/actions/workflows/ci.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

[Installation](#-installation) · [Quick Start](#-quick-start) · [Documentation](#-core-api) · [Examples](examples) · [Roadmap](ROADMAP.md) · [Online Demo](https://soonfx.dev)

[English](README.md) | [简体中文](README.zh-CN.md)

</div>

---

## 🎨 Visual Editor Driven

Stop hardcoding formulas. Build them visually.

**SoonFx Runtime** is the engine that powers the **[SoonFx Editor](https://github.com/soonfx-engine/editor)**. It allows game designers to configure complex logic without writing a single line of code, while developers can safely execute it at runtime.

### The Workflow

1.  **Design**: Designers create formulas, skill effects, and attribute relationships in the **Visual Editor**.
2.  **Export**: The editor generates a JSON configuration file.
3.  **Run**: The **SoonFx Runtime** loads this JSON and executes the logic in your game.

> **Note**: While SoonFx Runtime can be used standalone for math and expressions, its true power is unlocked when paired with the Editor.

![SoonFx Editor](assets/editor.gif)

## 💡 Use Cases

SoonFx is designed for numeric-heavy game genres:

*   ⚔️ **RPG Systems**: Skill damage, character stats growth, equipment bonuses, combat power (CP) calculations.
*   🏰 **SLG / Strategy**: Resource production rates, building upgrade timers, marching times, tech tree requirements.
*   🃏 **Card Games**: Dynamic card values, synergy effects, deck balancing simulation.
*   📊 **Simulation**: Complex economy models, probability calculations.

---

## 📸 Demo

### [Runtime Demo](https://soonfx.dev/)

![Demo](assets/demo1.gif) 
![Demo](assets/demo2.gif)

## ✨ Features

- ⚡ **Zero Dependencies** - Lightweight and fast, less than 50KB minified
- 🛡️ **Type-Safe** - Full TypeScript support with strict typing and intelligent code completion
- 📐 **Expression Engine** - Parse and evaluate complex mathematical expressions with RPN conversion
- 🎮 **Battle System** - Built-in RPG battle simulation with character attributes and damage calculation
- 🔧 **Extensible** - Flexible operator system supporting complex game logic and formula combinations
- 📦 **Tree-shakable** - Modern ESM support with CommonJS fallback

## 🚀 For Users

To use this library in your project:

```bash
npm install @soonfx/engine
```

## 📦 Development Setup

Clone and setup the development environment:

```bash
# Clone the repository
git clone https://github.com/soonfx-engine/core.git
cd core

# Install dependencies
npm install

# Build the project
npm run build

# Run examples
cd examples
npm install
npm run dev
```

## 🎯 Quick Start

### Basic Usage

```typescript
import { fx } from '@soonfx/engine';

// 1. Mathematical utilities
const distance = fx.distance(0, 0, 10, 10);
console.log('Distance between points:', distance); // 14.142135623730951

// 2. Expression evaluation
const result = fx.evaluateExpression('(2 + 3) * 4');
console.log('Expression result:', result); // 20

// 3. Numeric processing
const fixed = fx.fixedDecimal(3.14159, 2);
console.log('Fixed to 2 decimals:', fixed); // 3.14
```

### Event System

```typescript
import { Eve, Call, CallCenter } from '@soonfx/engine';

// Create event call center
const callCenter = new CallCenter();

// Listen to events
callCenter.addEventListener(Eve.SHIFT_ADD_BOARD, (data) => {
    console.log('Board added event triggered:', data);
});

// Send events
Call.send(Eve.ADD_DATABASE_DATA, [data, body, index]);
```

## 📚 Core API

### Mathematical Utilities (fx)

#### Vector and Geometry Operations
```typescript
// Calculate distance between two points
const distance = fx.distance(x1, y1, x2, y2);

// Vector dot product
const dotProduct = fx.dot(p1x, p1y, p2x, p2y);

// Vector cross product
const crossProduct = fx.cross(p1x, p1y, p2x, p2y);

// Calculate vector length
const length = fx.length(a, b);

// Coordinate transformation
const coord = fx.coordinate(x, y, angle, distance);
```

### Game Characters (Player)

The `Player` class provides character attributes, battle calculations, and combat simulation. See the [Examples](#-examples) section below for complete battle system demonstrations.

## 🏗️ System Architecture

```
@soonfx/fx
├── Core Systems (core/)
│   ├── EventManager      Event management
│   ├── System            System base class
│   └── Types             Type definitions
│
├── Mathematical Modules
│   ├── Vector            Vector operations (dot, cross, distance)
│   ├── Numeric           Numeric processing (fixedDecimal, currencyConversion)
│   └── Geometry          Geometric calculations (coordinate, length)
│
├── Expression System
│   ├── Parser            Expression parser
│   ├── RPN Converter     Reverse Polish Notation converter
│   └── Evaluator         Evaluation engine
│
├── Data Management (data/)
│   ├── Layers            Layer system
│   ├── Metadata          Metadata management
│   ├── Models            Data models
│   └── Storage           Storage system
│
├── Game Systems (game/)
│   ├── FXCentre          Game engine core
│   ├── Player            Player character system
│   └── Formulas          Formula calculation system
│
├── Communication (communication/)
│   ├── Events            Event system
│   ├── Call              Event calling
│   └── Message           Message passing
│
└── Utilities (utils/)
    └── ExtendsUtil       Extension utilities
```

## 📖 Examples

Check out the [example project](https://github.com/soonfx-engine/core/tree/main/examples) for complete development examples.

### Example Contents:

- ⚔️ Battle system simulation
- 📊 Character attribute calculations
- 🎯 PVE data generation
- 📈 Multi-battle comparison analysis
- 🎮 Complete game numeric system demonstration

### Run Examples Locally:

See the [Getting Started](#getting-started) section in Contributing for setup instructions.

## 🛠️ TypeScript Support

SoonFx provides complete TypeScript type definitions:

```typescript
// Automatic type inference
const distance: number = fx.distance(0, 0, 10, 10);

// Full IntelliSense support
fx. // IDE will show all available methods
```

### Type Definition Features:

- ✅ Complete TypeScript type definitions (.d.ts)
- ✅ Intelligent code completion
- ✅ Type checking and error hints
- ✅ Parameter type inference
- ✅ Return type inference

## 🔧 Browser and Environment Support

### Supported Environments

- ✅ **Node.js** >= 14.0.0
- ✅ **Modern Browsers** (ES2015+)
  - Chrome, Firefox, Safari, Edge (latest versions)
- ✅ **Build Tools**
  - esbuild (recommended, used in this project)
  - Webpack, Vite, Rollup, and other modern bundlers

### Module Systems

- ✅ **ESM** (ES Modules) - Recommended
- ✅ **CommonJS** - Node.js environment

## 🤝 Contributing

We welcome all forms of contributions!

### Getting Started

First, clone the repository:

```bash
git clone https://github.com/soonfx-engine/core.git
cd core
```

#### To Run Examples:

```bash
# Navigate to examples directory
cd examples

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

#### To Contribute Code:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests (if available)
npm test
```

## 🗺️ Roadmap

See our [Roadmap](ROADMAP.md) for planned features and improvements.

## 📝 Changelog

View the [complete changelog](https://github.com/soonfx-engine/core/releases)

## 📄 License

This project is licensed under the [Apache 2.0 License](LICENSE). You are free to use, modify, and distribute this project.

## 🔗 Links

- 📦 [npm Package](https://www.npmjs.com/package/@soonfx/engine)
- 💻 [GitHub Repository](https://github.com/soonfx-engine/core)
- 📖 [Online Demo](https://soonfx.dev)
- 🐛 [Issue Tracker](https://github.com/soonfx-engine/core/issues)
- 💬 [Discussions](https://github.com/soonfx-engine/core/discussions)

## 📞 Getting Help

If you encounter any issues:

- 💬 [GitHub Discussions](https://github.com/soonfx-engine/core/discussions) - Ask questions and discuss
- 🐛 [GitHub Issues](https://github.com/soonfx-engine/core/issues) - Bug reports and feature requests
- 📧 [jiyisoon@163.com](mailto:jiyisoon@163.com) - Email contact

## ⭐ Star History

If this project helps you, please give us a Star! It means a lot to us.

[![Star History Chart](https://api.star-history.com/svg?repos=soonfx-engine/core&type=Date)](https://star-history.com/#soonfx-engine/core&Date)

---

<div align="center">

**[⬆ Back to Top](#soonfx)**

Made with ❤️ by [SoonFx Team](https://github.com/soonfx-engine)

Copyright © 2025 SoonFx Team. All rights reserved.

</div>
