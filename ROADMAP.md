# SoonFx Engine Code Roadmap

## 🧪 v2.0.1 - Quality & Testing

- [ ] Add Vitest testing framework
- [ ] Unit tests for core math functions (`distance`, `mix`, `dot`, `cross`)
- [ ] Unit tests for expression parser
- [ ] Add ESLint + Prettier configuration
- [ ] Target test coverage > 60%

## 🔧 v2.0.2 - System.ts Refactoring

- [ ] Extract `MathUtils` module (vector/distance/interpolation)
- [ ] Extract `ExpressionParser` module (RPN/evaluation)
- [ ] Extract `LibraryManager` module (library operations)
- [ ] Extract `Serializer` module (save/load)
- [ ] Maintain backward API compatibility

## 📝 v2.0.3 - Type System Enhancement

- [ ] Eliminate all `any` types
- [ ] Define complete interface system
- [ ] Add comprehensive JSDoc comments
- [ ] Export complete type definitions

## 🏗️ v2.0.4 - Module Optimization

- [ ] Refactor `BasicBody.ts` (1,591 lines → split)
- [ ] Optimize `VariableValue.ts`
- [ ] Refactor `Player.ts`
- [ ] Improve event system

## 🚀 v2.1.0 - Architecture Upgrade

- [ ] Full modular architecture
- [ ] Tree-shaking support
- [ ] Performance benchmark suite
- [ ] Plugin system

