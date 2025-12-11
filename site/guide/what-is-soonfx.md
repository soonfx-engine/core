# What is SoonFx?

SoonFx is a **TypeScript-first numeric engine** designed specifically for games. It addresses the common challenge of managing complex game logic, formulas, and numeric relationships that often become hardcoded "spaghetti code."

## The Problem

In many game projects, damage calculations, resource production rates, and other numeric logic are hardcoded directly into the source code.

*   **Hard to maintain**: Formulas are buried in nested if-else statements.
*   **Slow iteration**: Designers need engineers to change a simple constant or formula structure.
*   **Bug prone**: Copy-pasting logic leads to subtle errors.

## The Solution

SoonFx decouples **logic** from **code**.

1.  **Logic as Data**: Formulas and relationships are defined as data (JSON).
2.  **Runtime Execution**: The engine parses and executes this data safely at runtime.
3.  **Visual Tooling**: Designers use the [SoonFx Editor](https://github.com/soonfx-engine/editor) to visually build these relationships.

## Key Features

*   **Expression Engine**: Powerful parser for mathematical expressions.
*   **Variable System**: Support for variables, references, and dynamic value resolution.
*   **Event-Driven**: Built-in event system for reactive logic.
*   **Type Safety**: Written in TypeScript with full type definitions.

