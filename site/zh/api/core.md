# 核心 API

## fx (系统)

`fx` 对象是 SoonFx 运行时系统的主要入口点。

### 数学工具

#### `fx.distance(x1, y1, x2, y2)`

计算两点之间的欧几里得距离。

- **参数**:
  - `x1`: number
  - `y1`: number
  - `x2`: number
  - `y2`: number
- **返回**: `number`

#### `fx.lerp(start, end, t)`

在起点和终点之间进行线性插值。

- **参数**:
  - `start`: number
  - `end`: number
  - `t`: number (0-1)
- **返回**: `number`

### 表达式评估

#### `fx.evaluateExpression(expression)`

评估数学表达式字符串。

- **参数**:
  - `expression`: string
- **返回**: `any`

*更多 API 文档正在生成中。*

