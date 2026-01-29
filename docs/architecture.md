# MorphQL Architecture Guide

This document provides an overview of MorphQL's internal architecture for developers and contributors.

## Core Concept

MorphQL is a high-performance, isomorphic Query-to-Code engine. Instead of interpreting queries at runtime, it **compiles** DSL queries into specialized, pure JavaScript functions optimized for each specific transformation.

This compilation approach provides significant performance benefits for high-volume data processing scenarios.

---

## Core Components

### 1. Lexer (`packages/core/src/lexer.ts`)

The lexer tokenizes MorphQL query strings into a stream of tokens.

- Powered by **Chevrotain** for high-performance tokenization
- Defines tokens for keywords, operators (`+`, `-`, `*`, `/`), and identifiers
- Handles escaped identifiers with backticks

### 2. Parser (`packages/core/src/parser.ts`)

The parser processes tokens and produces a **Concrete Syntax Tree (CST)**.

- Defines the complete grammar for the DSL
- Implements operator precedence rules
- Handles function call lookahead
- Supports recursive section nesting

### 3. Compiler (`packages/core/src/compiler.ts`)

The compiler traverses the CST and generates optimized JavaScript code.

- Uses a CST Visitor pattern for tree traversal
- Maps DSL operators and functions to efficient JS implementations
- Generates self-contained, pure functions

### 4. Functions Registry (`packages/core/src/functions.ts`)

A modular registry for transformation functions.

- Each function maps to an efficient JavaScript implementation
- Extensible without modifying core logic
- Functions are inlined during compilation for performance

### 5. Runtime (`packages/core/src/index.ts`)

The main entry point that orchestrates the compilation and execution pipeline.

**Key Features:**

- **Isomorphic**: Runs seamlessly in Node.js and browsers
- **Format Handlers**: JSON/XML parsing and serialization
- **Code Beautification**: Integrates `js-beautify` for readable generated code
- **Async Compilation**: Returns a Promise resolving to the engine function

### 6. Adapter System (`packages/core/src/adapters.ts`)

Pluggable data format handlers for input/output processing.

- **JSON Adapter**: Native JSON parsing/serialization
- **XML Adapter**: Uses `fast-xml-parser` for efficient XML handling
- **Object Adapter**: Pass-through for in-memory objects

### 7. Caching (`packages/core/src/cache.ts`)

Supports custom caching strategies to avoid recompilation of identical queries.

- **In-Memory Cache**: Default browser/Node.js cache
- **File System Cache**: Persistent caching for Node.js servers
- **Redis Cache**: Distributed caching for scaled deployments

### 8. Mapping Tracker (`packages/core/src/core/mapping-tracker.ts`)

A telemetry component that collects structural information during compilation.

- Tracks source field access (detecting expected input structure)
- Tracks target field assignments (detecting output schema)
- Handles nested scopes and cumulative branching (if/else)
- Opt-in via `compile` options

---

## Compilation Pipeline

```
┌─────────────┐     ┌─────────┐     ┌──────────┐     ┌────────────┐
│ MorphQL     │ ──▶ │ Lexer   │ ──▶ │ Parser   │ ──▶ │ Compiler   │
│ Query       │     │ (Tokens)│     │ (CST)    │     │ (JS Code)  │
└─────────────┘     └─────────┘     └──────────┘     └────────────┘
                                                            │
                                                            ▼
                                                     ┌────────────┐
                                                     │ new        │
                                                     │ Function() │
                                                     └────────────┘
                                                            │
                                                            ▼
                                                     ┌────────────┐
                                                     │ Executable │
                                                     │ Engine     │
                                                     └────────────┘
```

---

## Package Structure

```
morphql/
├── packages/
│   ├── core/                    # @morphql/core - Main transformation library
│   │   ├── src/
│   │   │   ├── lexer.ts         # Token definitions
│   │   │   ├── parser.ts        # Grammar rules
│   │   │   ├── compiler.ts      # Code generation
│   │   │   ├── mapping-tracker.ts # Structure analysis
│   │   │   ├── functions.ts     # Function implementations
│   │   │   ├── adapters.ts      # Format handlers
│   │   │   ├── cache.ts         # Caching strategies
│   │   │   └── index.ts         # Public API
│   │   └── package.json
│   │
│   ├── language-definitions/    # @morphql/language-definitions
│   │   └── src/                 # Single source of truth for language spec
│   │
│   ├── cli/                     # @morphql/cli - Command-line interface
│   ├── playground/              # @morphql/playground - Interactive web editor
│   ├── server/                  # NestJS REST API server
│   ├── vscode-extension/        # VSCode extension
│   └── jetbrains-extension/     # JetBrains IDE plugin
│
└── package.json                 # npm workspaces root
```

---

## Server Architecture (`packages/server/`)

A production-ready NestJS microservice exposing MorphQL via REST API.

**Key Features:**

- 🚀 **Stateless Architecture**: Horizontally scalable
- ⚡ **Redis Caching**: Optional compiled query caching
- 🐳 **Docker Ready**: Multi-stage Dockerfile with optimizations
- 🔐 **API Key Auth**: Optional `X-API-KEY` header authentication
- 📊 **Swagger Docs**: Auto-generated at `/api`
- 🏥 **Health Checks**: Kubernetes/Docker-ready endpoints

**API Endpoints:**
| Endpoint | Description |
|:---------|:------------|
| `POST /v1/execute` | Compile and execute a transformation |
| `POST /v1/compile` | Get generated JavaScript code |
| `GET /v1/health` | Liveness check |
| `GET /v1/health/ready` | Readiness check (includes Redis ping) |

---

## Current Features

- ✅ **Format Independence**: Supports `json`, `xml`, and `object`
- ✅ **Expressions**: Arithmetic (+, -, \*, /) and string concatenation
- ✅ **Unary Operators**: Negative literals (`-price`) and logical NOT (`!`)
- ✅ **Conditional Logic**: `if()` expression and `if/else` statements
- ✅ **Functions**: Extensible function library
- ✅ **Deep Nesting**: Unlimited recursive `section` directives
- ✅ **Subquery Sections**: Format conversion within sections
- ✅ **Cloning**: Full/selective object cloning
- ✅ **Pure Conversions**: Optional `transform` for straight format conversion
- ✅ **Structure Extraction**: Opt-in query analysis for source/target discovery
- ✅ **Tests**: 70+ unit tests across multiple spec files
- ✅ **IDE Support**: VSCode and JetBrains extensions

---

## Future Development

- **Performance**: Benchmark `fast-xml-parser` vs alternatives
- **Error Reporting**: Better CST-to-Code error mapping
- **Schema Validation**: Optional schema enforcement for input/output
- **Server Scaling**: Kubernetes deployment examples and load testing

---

_Last Updated: 2026-01-29_
