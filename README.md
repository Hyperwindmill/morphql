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
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="https://hyperwindmill.github.io/morphql/"><strong>DOCUMENTATION</strong></a>
</p>

---

## What is MorphQL?

**MorphQL** (Morph Query Language) is a declarative DSL that transforms structural data—JSON, XML, or Objects—by compiling your queries into specialized, native JavaScript functions.

Unlike traditional data mappers that interpret transformations at runtime, MorphQL **compiles once and executes fast**. This makes it ideal for high-throughput ETL pipelines, API response shaping, and format conversion workflows.

## Features

- 🌐 **Isomorphic**: Runs seamlessly in Node.js and the Browser.
- 🛡️ **Type-Safe**: Built with TypeScript for reliable development.
- ⚡ **Fast**: Compiles queries to native JavaScript for maximum speed.
- 🔄 **Format Agnostic**: Transform between JSON, XML, and Objects with ease.

---

## 📚 Documentation

For complete language reference, architecture guides, and advanced usage, please visit our official documentation:

👉 **[https://hyperwindmill.github.io/morphql/](https://hyperwindmill.github.io/morphql/)**

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

> 💡 **Tip**: Use the `morphQL` tagged template for syntax highlighting in VSCode and JetBrains IDEs.

---

## Packages

| Package                                      | Description                | Status   |
| :------------------------------------------- | :------------------------- | :------- |
| [@morphql/core](./packages/core)             | Core transformation engine | ✅ Ready |
| [@morphql/cli](./packages/cli)               | Command-line interface     | ✅ Ready |
| [@morphql/playground](./packages/playground) | Interactive web editor     | ✅ Ready |
| [@morphql/server](./packages/server)         | REST API server            | ✅ Ready |

---

## License

MIT © 2026
