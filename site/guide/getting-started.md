# Getting Started

## Installation

To use SoonFx in your project, install it via npm:

```bash
npm install @soonfx/engine
```

## Basic Usage

### Mathematical Utilities

SoonFx provides a robust set of mathematical utilities tailored for game development.

```typescript
import { fx } from '@soonfx/engine';

// 1. Calculate distance between two points (x1, y1, x2, y2)
const distance = fx.distance(0, 0, 10, 10);
console.log('Distance:', distance); // 14.142...

// 2. Evaluate string expressions
// Safe evaluation of mathematical strings
const result = fx.evaluateExpression('(2 + 3) * 4');
console.log('Result:', result); // 20

// 3. Numeric processing
const fixed = fx.fixedDecimal(3.14159, 2);
console.log('Fixed:', fixed); // 3.14
```

### Loading Editor Configuration

If you are using the Visual Editor, you will load the exported JSON configuration.

```typescript
// Example of loading data
// Assuming `configData` is your exported JSON
// const configData = await fetch('path/to/config.json').then(res => res.json());

// Initialize systems with data (Conceptual)
// ...
```

*Detailed guide on loading editor data coming soon.*

## Next Steps

- Explore the [Visual Editor](/guide/visual-editor) workflow.
- Check the [API Reference](/api/core) for detailed class documentation.

