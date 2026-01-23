<p align="center">
  <img src="./morphql.png" alt="MorphQL" width="400" />
</p>

<h3 align="center">Transform Data with Declarative Queries</h3>

<p align="center">
  A high-performance engine that compiles transformation queries into optimized JavaScript functions.
  <br />
  <strong>Isomorphic · Type-Safe · Fast</strong>
</p>

<p align="center">
  <code>📦 Library</code> · <code>💻 CLI</code> · <code>🌐 REST Server</code>
</p>

<p align="center">
  <a href="#-as-a-library">Library</a> •
  <a href="#-as-a-cli">CLI</a> •
  <a href="#-as-an-api-server">Server</a> •
  <a href="#use-cases">Use Cases</a> •
  <a href="./docs/language-reference.md">Docs</a>
</p>

---

## What is MorphQL?

**MorphQL** (Morph Query Language) is a declarative DSL that transforms structural data—JSON, XML, or Objects—by compiling your queries into specialized, native JavaScript functions.

Unlike traditional data mappers that interpret transformations at runtime, MorphQL **compiles once and executes fast**. This makes it ideal for high-throughput ETL pipelines, API response shaping, and format conversion workflows.

```javascript
import { compile, morphQL } from "@morphql/core";

const engine = await compile(morphQL`
  from json to json
  transform
    set fullName = firstName + " " + lastName
    set sku = substring(productCode, 0, 6)
    set total = (price * quantity) - discount
    modify total = total * 1.10   # Apply markup on calculated total
`);

const result = engine(inputData);
```

---

## Why MorphQL?

| Challenge                                        | MorphQL Solution                             |
| :----------------------------------------------- | :------------------------------------------- |
| **Complex mapping logic** scattered across code  | Declarative, self-documenting queries        |
| **Performance bottlenecks** in data processing   | Compiled to native JS for maximum speed      |
| **Format juggling** between JSON/XML/Objects     | Built-in format conversion in a single query |
| **Inconsistent transformations** across services | Centralized, reusable query definitions      |
| **Debug difficulty** with nested mappers         | Generated code is readable and inspectable   |

---

## Use Cases

### 🔄 API Response Transformation

Shape backend responses into frontend-friendly formats without cluttering your application code.

```javascript
const shapeOrder = await compile(morphQL`
  from json to json
  transform
    set id = orderId
    set customer = billing.customerName
    section multiple items(
      set name = productName
      set price = number(unitPrice)
    ) from lineItems
`);
```

### 📦 ETL Pipelines

Process large datasets with compiled transformations for optimal throughput.

```javascript
const transform = await compile(morphQL`
  from xml to json
  transform
    set productId = root.product.id
    set price = extractnumber(root.product.price)
    set available = root.product.stock > 0
`);

// Process millions of records efficiently
data.map(transform);
```

### 🔧 Format Conversion

Convert between formats with zero transformation logic—just specify source and target.

```javascript
const xmlToJson = await compile(morphQL`from xml to json`);
const jsonToXml = await compile(morphQL`from json to xml`);
```

### 🧩 Nested Data Processing

Handle complex nested structures with subqueries that can parse embedded data.

```javascript
const engine = await compile(morphQL`
  from json to object
  transform
    set orderId = id
    section metadata(
      from xml to object
      transform
        set supplier = root.vendor.name
    ) from embeddedXmlField
`);
```

---

## Quick Start

### Installation

```bash
npm install @morphql/core
```

### Basic Usage

```javascript
import { compile, morphQL } from "@morphql/core";

// Define your transformation
const query = morphQL`
  from object to json
  transform
    set greeting = "Hello, " + name + "!"
    set isAdult = age >= 18
`;

// Compile once
const engine = await compile(query);

// Execute many times
const result = engine({ name: "Alice", age: 25 });
// → '{"greeting":"Hello, Alice!","isAdult":true}'
```

> 💡 **Tip**: Use the `morphQL` tagged template for syntax highlighting in [VSCode](#vscode-extension) and [JetBrains](#jetbrains-plugin) IDEs.

---

## How to Use

MorphQL is available in multiple forms to fit your workflow:

### 📦 As a Library

Import `@morphql/core` directly into your Node.js or browser application.

```bash
npm install @morphql/core
```

```javascript
import { compile, morphQL } from "@morphql/core";

const engine = await compile(morphQL`from json to xml`);
const xml = engine('{"foo":"bar"}');
```

**Features:**

- 🌐 Isomorphic—works in Node.js and browsers
- ⚡ Async compilation with optional caching
- 🔌 Pluggable format adapters

### 💻 As a CLI

Use `@morphql/cli` for command-line transformations and scripting.

```bash
# Transform a file
npx @morphql/cli --from ./data.json --to ./output.xml -q "from json to xml"

# Transform raw input, output to stdout
npx @morphql/cli -i '{"a":1}' -q "from json to xml"

# Pipe-friendly
cat data.json | npx @morphql/cli -q "from json to json transform set id = uuid"
```

📖 [Full CLI Documentation](./packages/cli/README.md)

### 🌐 As an API Server

Deploy `@morphql/server` as a stateless REST API for server-side transformations.

```bash
cd packages/server
docker compose up -d
```

```bash
curl -X POST http://localhost:3000/v1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "query": "from json to json transform set firstName = split(fullName, \" \")[0]",
    "data": { "fullName": "John Doe" }
  }'
```

**Features:**

- 🚀 Stateless & horizontally scalable
- ⚡ Redis caching for compiled queries
- 🔐 Optional API key authentication
- 📊 Swagger docs at `/api`

📖 [Full Server Documentation](./packages/server/README.md)

### 🎮 In the Playground

Try MorphQL instantly in the interactive web playground—no installation required.

```bash
npm run playground
```

Features a real-time editor with syntax highlighting, live output preview, and generated JavaScript inspection.

---

## Available Tools

### VSCode Extension

Full language support for VSCode and compatible editors.

- ✨ Syntax highlighting for `.mql` files and template literals
- 📝 Hover documentation for keywords and functions
- 🎯 Language injection in `morphQL` tagged templates

📦 [packages/vscode-extension](./packages/vscode-extension)

### JetBrains Plugin

Native support for IntelliJ IDEA, WebStorm, PhpStorm, and all JetBrains IDEs that support Javascript.

- ✨ Syntax highlighting
- 📝 Hover documentation
- 🎯 Language injection in template strings

📦 [packages/jetbrains-extension](./packages/jetbrains-extension)

### Language Definitions

A shared package providing language specifications for tooling integration.

📦 [@morphql/language-definitions](./packages/language-definitions)

---

## Documentation

| Document                                           | Description                                       |
| :------------------------------------------------- | :------------------------------------------------ |
| [Language Reference](./docs/language-reference.md) | Complete MorphQL syntax, functions, and operators |
| [Architecture Guide](./docs/architecture.md)       | Internal design and package structure             |
| [Maintenance Guide](./docs/maintenance.md)         | How to extend the language                        |

---

## Packages

| Package                                                          | Description                | Status   |
| :--------------------------------------------------------------- | :------------------------- | :------- |
| [@morphql/core](./packages/core)                                 | Core transformation engine | ✅ Ready |
| [@morphql/cli](./packages/cli)                                   | Command-line interface     | ✅ Ready |
| [@morphql/playground](./packages/playground)                     | Interactive web editor     | ✅ Ready |
| [@morphql/server](./packages/server)                             | REST API server            | ✅ Ready |
| [vscode-extension](./packages/vscode-extension)                  | VSCode language support    | ✅ Ready |
| [jetbrains-extension](./packages/jetbrains-extension)            | JetBrains IDE plugin       | ✅ Ready |
| [@morphql/language-definitions](./packages/language-definitions) | Shared language specs      | ✅ Ready |

---

## Development

```bash
# Install all dependencies
npm install

# Build the core library
npm run build

# Run tests
npm run test

# Start the playground
npm run playground

# Watch mode for development
npm run dev
```

See the [Architecture Guide](./docs/architecture.md) for detailed development information.

---

## Project Status

> ⚠️ **Early Stage**: MorphQL is under active development. The API is stabilizing but may have breaking changes before v1.0. Packages are not yet published to npm.

We welcome feedback, bug reports, and contributions!

---

## License

MIT © 2026

---

<p align="center">
  <sub>Built with ❤️ for developers who transform data</sub>
</p>
