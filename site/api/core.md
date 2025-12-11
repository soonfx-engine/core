# Core API

## fx (System)

The `fx` object is the main entry point for the SoonFx runtime system.

### Mathematical Utilities

#### `fx.distance(x1, y1, x2, y2)`

Calculates the Euclidean distance between two points.

- **Parameters**:
  - `x1`: number
  - `y1`: number
  - `x2`: number
  - `y2`: number
- **Returns**: `number`

#### `fx.lerp(start, end, t)`

Linear interpolation between start and end.

- **Parameters**:
  - `start`: number
  - `end`: number
  - `t`: number (0-1)
- **Returns**: `number`

### Expression Evaluation

#### `fx.evaluateExpression(expression)`

Evaluates a mathematical expression string.

- **Parameters**:
  - `expression`: string
- **Returns**: `any`

*More API documentation is being generated.*

