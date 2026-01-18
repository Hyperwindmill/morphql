# Project Overview & AI Handover Guide

## Project Goal: `query-morph`

A high-performance, isomorphic Query-to-Code engine. It provides a DSL to transform structural data (JSON/XML) by compiling the query into a pure JavaScript function specialized for that specific transformation.

## Core Architecture

### 1. Lexer (`src/lexer.ts`)

- Powered by **Chevrotain**.
- Defines tokens for keywords and mathematical operators (`+`, `-`, `*`, `/`).

### 2. Parser (`src/parser.ts`)

- Defines the grammar for the DSL.
- Produces a **Concrete Syntax Tree (CST)**.
- Implements operator precedence and function call lookahead.

### 3. Compiler (`src/compiler.ts`)

- Uses a CST Visitor to traverse the tree and generate a **JavaScript string**.
- Maps DSL operators and functions to efficient JS implementations.

### 4. Functions Registry (`src/functions.ts`)

- Modular registry for transformation functions.
- Current functions: `substring` (aliased to JS `.slice()`).
- Extensible without modifying core logic.

### 5. Runtime / Index (`src/index.ts`)

- **Isomorphic**: Runs in both Node.js and the Browser.
- **Handles source parsing**: JSON/XML and target serialization.
- **Beautify code**:Integrates `js-beautify` for readable generated code.
- **Async Compilation**: Returns a Promise that resolves to the engine.
- **Adapter System**: Pluggable data format handlers (`src/adapters.ts`).
- **Caching**: Supports custom caching strategies (e.g., File System in Node).

## Current Features & State

- ✅ **Format Independence**: Supports `json`, `xml`, and `object`.
- ✅ **Expressions**: Basic arithmetic (+, -, \*, /) and string concatenation in `set`.
- ✅ **Unary Operators**: Support for negative literals (`-price`) and logical NOT (`!`).
- ✅ **Conditional Logic**:
  - `if(condition, true, false)` expression.
  - `if (condition) (...) else (...)` action statements.
  - Operators: `<`, `>`, `<=`, `>=`, `==`, `!=`, `&&`, `||`, `!`.
- ✅ **Functions**: Support for function calls like `substring` and `if`.
- ✅ **Negative Indices**: Functions like `substring` support negative offsets from the end.
- ✅ **Deep Nesting**: Unlimited recursive `section` directives.
- ✅ **Full/Selective Cloning**: `clone` or `clone(a, b)`.
- ✅ **Pure Conversions**: Optional `transform` directive for straight format conversion.
- ✅ **Tests**: 50+ unit tests across multiple spec files.
- ✅ **Playground**: A Vite + React + Monaco environment (`npm run playground`).

## Next Development Steps

- **Performance**: Benchmark the `fast-xml-parser` vs alternatives.
- **Error Reporting**: Better CST-to-Code error mapping.
- **Schema Validation**: Optional schema enforcement for input/output.

---

_Updated on 2026-01-18 with Pure Format Conversion support._
