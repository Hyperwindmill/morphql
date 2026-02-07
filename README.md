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
  <a href="#the-problem">The Problem</a> •
  <a href="#the-solution">The Solution</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="https://hyperwindmill.github.io/morphql/"><strong>DOCUMENTATION</strong></a>
</p>

---

## The Problem

> _"I was tired of rewriting one-off data consumers for every integration."_

In modern software development, data transformation is everywhere. Whether you're shaping API responses, processing ETL pipelines, or integrating third-party services, you inevitably face:

- **Complex mapping logic** scattered across your codebase.
- **Performance bottlenecks** when processing large datasets.
- **Format juggling** between JSON, XML, and native Objects.Also supports UN/EDIFACT, CSV,plaintext and more to come.
- **Inconsistent transformations** across different microservices.
- **Debugging nightmares** with deeply nested, imperative mapping code.

And if you rely on AI or LLMs to generate transformations, the problems multiply: verbose JavaScript consumes tokens, and imperative loops create countless "valid but wrong" states for models to hallucinate.

---

## The Solution

**MorphQL** (Morph Query Language) flips the script. Instead of writing _how_ to transform data, you declare _what_ you want.

```morphql
from json to json
transform
  set fullName = firstName + " " + lastName
  set isAdult = age >= 18
```

This declarative query is then **compiled into a specialized JavaScript function** that runs at native speed. Compile once, execute millions of times.

### Why MorphQL?

| Feature                | Benefit                                                                                     |
| :--------------------- | :------------------------------------------------------------------------------------------ |
| **Declarative DSL**    | Write _what_ you want, not _how_ to loop and assign. Queries are self-documenting.          |
| **Native Performance** | Queries compile to optimized JavaScript. No runtime interpretation overhead.                |
| **Format Agnostic**    | Built-in format conversion (JSON ↔ XML ↔ Object) in a single query.                         |
| **Centralized Logic**  | Keep transformation logic separate and portable.                                            |
| **Inspectable Code**   | The generated code is readable JavaScript—debug it if needed.                               |
| **LLM Efficient**      | Constrained DSL reduces token cost and hallucinations compared to generating imperative JS. |

### What MorphQL is NOT

To set the right expectations:

- **Not an iPaaS** — MorphQL doesn't manage connectors, orchestration, or SaaS integrations. It's a transformation engine, not a platform.
- **Not low-code** — There's no drag-and-drop UI. You write queries in a DSL designed for developers.
- **Not for business users** — This is a tool for engineers who need precise control over data shaping.

If you're looking for a point-and-click integration builder, this isn't it. If you need a fast, embeddable transformation engine you can control—keep reading.

---

## Quick Start

### 1. Install

```bash
npm install @morphql/core
```

### 2. Transform

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

## Available Tools

MorphQL is available in multiple forms to fit your workflow:

| Package                                          | Description                        | Use Case                                                                |
| :----------------------------------------------- | :--------------------------------- | :---------------------------------------------------------------------- |
| **[@morphql/core](./packages/core)**             | Core transformation engine         | Embed in Node.js or browser apps. Compile once, execute fast.           |
| **[@morphql/cli](./packages/cli)**               | Command-line interface             | Scripting, batch processing, piping with Unix tools.                    |
| **[@morphql/server](./packages/server)**         | REST API server with Redis caching | Production microservices with Staged Queries for pre-defined endpoints. |
| **[@morphql/playground](./packages/playground)** | Interactive web editor             | Experiment with queries in the browser with live feedback.              |

> 💬 _"So with the server package and a custom adapter, I could create APIs on my data directly?"_
>
> **Yes, you could.** Define a transformation, point it at your data source, and you have a live API endpoint—no boilerplate, no middleware sprawl.

---

## Use Cases

### 🔄 API Response Shaping

Transform backend responses into frontend-friendly formats without cluttering your application code.

### 📦 High-Throughput ETL

Compile transformations once and process millions of records at native JavaScript speed.

### 🔧 Format Conversion

Convert between JSON, XML, and Objects with zero boilerplate—just declare source and target.

### 🧩 Nested Data Processing

Handle complex structures with subqueries that can even parse embedded formats (e.g., XML inside a JSON field).

---

## Learn More

👉 **[Full Documentation](https://hyperwindmill.github.io/morphql/)** — Language reference, architecture guides, and advanced patterns.

---

## Planned / Missing Features

MorphQL is actively evolving, I have lots of ideas, but I'd be also interested in your feedback on real-world integration scenarios and problems you are trying to solve.

Feel free to open an issue or join the discussion section on GitHub (https://github.com/Hyperwindmill/morphql/discussions)

---

## License

MIT © 2026
