# Project Overview & AI Handover Guide

## Project Goal: `query-morph`

A high-performance, isomorphic Query-to-Code engine. It provides a DSL to transform structural data (JSON/XML) by compiling the query into a pure JavaScript function specialized for that specific transformation.

## Core Architecture

### 1. Lexer (`packages/core/src/lexer.ts`)

- Powered by **Chevrotain**.
- Defines tokens for keywords and mathematical operators (`+`, `-`, `*`, `/`).

### 2. Parser (`packages/core/src/parser.ts`)

- Defines the grammar for the DSL.
- Produces a **Concrete Syntax Tree (CST)**.
- Implements operator precedence and function call lookahead.

### 3. Compiler (`packages/core/src/compiler.ts`)

- Uses a CST Visitor to traverse the tree and generate a **JavaScript string**.
- Maps DSL operators and functions to efficient JS implementations.

### 4. Functions Registry (`packages/core/src/functions.ts`)

- Modular registry for transformation functions.
- Current functions: `substring` (aliased to JS `.slice()`).
- Extensible without modifying core logic.

### 5. Runtime / Index (`packages/core/src/index.ts`)

- **Isomorphic**: Runs in both Node.js and the Browser.
- **Handles source parsing**: JSON/XML and target serialization.
- **Beautify code**:Integrates `js-beautify` for readable generated code.
- **Async Compilation**: Returns a Promise that resolves to the engine.
- **Adapter System**: Pluggable data format handlers (`packages/core/src/adapters.ts`).
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

## MQL Quick Reference (for LLMs)

### Actions

- `set <target> = <expression>`: Assign value.
- `section [multiple] <name>( <actions> ) [from <path>]`: Nesting/Looping.
- `clone([fields...])`: Copy all or select fields.
- `delete <field>`: Remove field.
- `define <alias> = <expression>`: Local variable.
- `if (<cond>) ( <actions> ) [else ( <actions> )]`: Conditional block.

### Functions

- `substring(str, start, [len])`: Slice string.
- `split(str, [sep], [lim])`: Split string to array.
- `if(cond, true, false)`: Ternary expression.
- `text(val)`, `number(val)`: Type casting.
- `replace(str, search, replace)`: String replace.
- `extractnumber(str)`: Get first number from string.
- `uppercase(str)`, `lowercase(str)`: Case conversion.
- `xmlnode(val, [k, v...])`: XML formatting.

### Operators

- Arithmetic: `+`, `-`, `*`, `/`
- Comparison: `==`, `===`, `!=`, `!==`, `<`, `>`, `<=`, `>=`
- Logical: `&&`, `||`, `!`
- Grouping: `( )`
- ✅ **Tests**: 67 unit tests across multiple spec files.
- ✅ **Playground**: `@query-morph/playground` - Vite + React + Monaco app (`packages/playground/`).

## Monorepo Structure

```
query-morph/
├── packages/
│   ├── core/        # @query-morph/core - Main library
│   └── playground/  # @query-morph/playground - Interactive editor
└── package.json     # npm workspaces root
```

## Next Development Steps

- **Performance**: Benchmark the `fast-xml-parser` vs alternatives.
- **Error Reporting**: Better CST-to-Code error mapping.
- **Schema Validation**: Optional schema enforcement for input/output.

---

_Updated on 2026-01-18 with Monorepo structure._
