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
- ✅ **Subquery Sections**: Format conversion within sections (e.g., `section metadata( from xml to object transform ... ) from xmlString`).
- ✅ **Full/Selective Cloning**: `clone` or `clone(a, b)`.
- ✅ **Pure Conversions**: Optional `transform` directive for straight format conversion.

## MorphQL Quick Reference (for LLMs)

### Actions

- `set <target> = <expression>`: Assign value.
- `section [multiple] <name>( <actions> ) [from <path>]`: Nesting/Looping.
- `clone([fields...])`: Copy all or select fields.
- `delete <field>`: Remove field.
- `define <alias> = <expression>`: Local variable.
- `if (<cond>) ( <actions> ) [else ( <actions> )]`: Conditional block.

### Identifiers

- **Backticks**: Use `` `identifier` `` to escape reserved keywords or use special characters.
  - Example: ``set `multiple` = true``, ``set `order-id` = 123``

### Functions

- `substring(str, start, [len])`: Slice string.
- `split(str, [sep], [lim])`: Split string to array.
- `if(cond, true, false)`: Ternary expression.
- `text(val)`, `number(val)`: Type casting.
- `replace(str, search, replace)`: String replace.
- `extractnumber(str)`: Get first number from string.
- `uppercase(str)`, `lowercase(str)`: Case conversion.
- `xmlnode(val, [k, v...])`: XML formatting.
- `to_base64(val)`, `from_base64(val)`: Base64 encoding/decoding.
- `aslist(val)`: Array normalization.

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
│   ├── core/        # @query-morph/core - Main transformation library
│   ├── playground/  # @query-morph/playground - Interactive web editor
│   ├── cli/         # @query-morph/cli - Command-line interface
│   └── server/      # NestJS REST API server
└── package.json     # npm workspaces root
```

### Server Package (`packages/server/`)

A production-ready NestJS microservice that exposes the query-morph engine via REST API.

**Key Features**:

- 🚀 **Stateless Architecture**: Horizontally scalable for high-throughput scenarios
- ⚡ **Redis Caching**: Optional compiled query caching for performance
- 🐳 **Docker Ready**: Multi-stage Dockerfile with production optimizations
- 🔐 **API Key Auth**: Optional `X-API-KEY` header authentication
- 📊 **Swagger Docs**: Auto-generated API documentation at `/api`
- 🏥 **Health Checks**: Kubernetes/Docker-ready liveness and readiness endpoints

**API Endpoints**:

- `POST /v1/execute` - Compile and execute a transformation
- `POST /v1/compile` - Get generated JavaScript code
- `GET /v1/health` - Liveness check
- `GET /v1/health/ready` - Readiness check (includes Redis ping)

**Deployment**:

```bash
# Quick start with Docker Compose
cd packages/server
docker compose up -d
```

See [`packages/server/README.md`](./packages/server/README.md) for detailed documentation.

## Next Development Steps

- **Performance**: Benchmark the `fast-xml-parser` vs alternatives.
- **Error Reporting**: Better CST-to-Code error mapping.
- **Schema Validation**: Optional schema enforcement for input/output.
- **Server Scaling**: Kubernetes deployment examples and load testing.

---

_Updated on 2026-01-20 with Server package documentation._
