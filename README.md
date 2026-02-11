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
- **Format juggling** between JSON, XML, CSV, UN/EDIFACT, Plaintext, and native Objects.
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

| Feature                | Benefit                                                                                       |
| :--------------------- | :-------------------------------------------------------------------------------------------- |
| **Declarative DSL**    | Write _what_ you want, not _how_ to loop and assign. Queries are self-documenting.            |
| **Native Performance** | Queries compile to optimized JavaScript. No runtime interpretation overhead.                  |
| **Format Agnostic**    | Built-in conversion across JSON, XML, CSV, EDIFACT, Plaintext, and Objects in a single query. |
| **Centralized Logic**  | Keep transformation logic separate and portable.                                              |
| **Inspectable Code**   | The generated code is readable JavaScript—debug it if needed.                                 |
| **LLM Efficient**      | Constrained DSL reduces token cost and hallucinations compared to generating imperative JS.   |

### What MorphQL is NOT

To set the right expectations:

- **Not an iPaaS** — MorphQL doesn't manage connectors, orchestration, or SaaS integrations. It's a transformation engine, not a platform.
- **Not low-code** — There's no drag-and-drop UI. You write queries in a DSL designed for developers.
- **Not for business users** — This is a tool for engineers who need precise control over data shaping.

If you're looking for a point-and-click integration builder, this isn't it. If you need a fast, embeddable transformation engine you can control—keep reading.

---

## Quick Start

### As a library

```bash
npm install @morphql/core
```

```javascript
import { compile, morphQL } from "@morphql/core";

const engine = await compile(morphQL`
  from object to json
  transform
    set greeting = "Hello, " + name + "!"
    set isAdult = age >= 18
`);

engine({ name: "Alice", age: 25 });
// → '{"greeting":"Hello, Alice!","isAdult":true}'
```

> 💡 **Tip**: Use the `morphQL` tagged template for syntax highlighting in VSCode and JetBrains IDEs , download the extension from the [release page](https://github.com/hyperwindmill/morphql/releases).

### From the command line

```bash
npm install -g @morphql/cli
```

```bash
# Inline transformation
echo '{"name":"Alice"}' | morphql -q "from json to xml"

# File-to-file
morphql --from data.json --to output.xml -q "from json to xml"

# Batch: process an entire directory
morphql batch -q "from xml to json" --in ./invoices/ --out ./converted/ --pattern "*.xml"

# Watch: monitor a directory for new files
morphql watch -q "from csv to json" --in ./incoming/ --out ./processed/
```

---

## Use Cases

### 🔄 API Response Shaping

Transform backend responses into frontend-friendly formats without cluttering your application code.

```morphql
from json to json
transform
  set id = orderId
  set customer = billing.customerName
  section multiple items(
    set name = productName
    set price = number(unitPrice)
  ) from lineItems
```

### 📦 High-Throughput ETL

Compile transformations once and process millions of records at native JavaScript speed.

```javascript
const transform = await compile(morphQL`from xml to json`);
data.map(transform); // process millions of records
```

### 🔧 Format Conversion

One line. No boilerplate.

```bash
morphql --from data.xml --to data.json -q "from xml to json"
```

### 🧩 Nested Data Processing

Handle complex structures with subqueries that can even parse embedded formats (e.g., XML inside a JSON field).

```morphql
from json to object
transform
  set orderId = id
  section metadata(
    from xml to object
    transform set supplier = root.vendor.name
  ) from embeddedXmlField
```

---

## Available Tools

MorphQL is available in multiple forms to fit your workflow:

| Package                                          | Description                                                                              |
| :----------------------------------------------- | :--------------------------------------------------------------------------------------- |
| **[@morphql/core](./packages/core)**             | Core engine. Embed in Node.js or browser apps. Compile once, execute fast.               |
| **[@morphql/cli](./packages/cli)**               | Terminal tool. Batch transforms, directory watching, Unix piping, `--delete` (coming in v0.1.18) and more.   |
| **[@morphql/server](./packages/server)**         | REST API with Redis caching and Staged Queries for pre-defined transformation endpoints. |
| **[@morphql/playground](./packages/playground)** | Interactive web editor. Experiment with queries in the browser with live feedback.       |

> 💬 _"So with the server package and a custom adapter, I could create APIs on my data directly?"_
>
> **Yes, you could.** Define a transformation, point it at your data source, and you have a live API endpoint—no boilerplate, no middleware sprawl.

---

## Supported Formats

| Format        | Read | Write | Notes                                               |
| :------------ | :--: | :---: | :-------------------------------------------------- |
| **JSON**      |  ✅  |  ✅   | Native parsing and serialization.                   |
| **XML**       |  ✅  |  ✅   | Fast XML with configurable options.                 |
| **CSV**       |  ✅  |  ✅   | Via PapaParse. Headers auto-detected.               |
| **EDIFACT**   |  ✅  |  ✅   | UN/EDIFACT message parsing.                         |
| **Plaintext** |  ✅  |  ✅   | Line-based splitting and joining.                   |
| **Object**    |  ✅  |  ✅   | In-memory JS objects (no serialization).            |
| **Custom**    |  ✅  |  ✅   | Register your own adapters via `registerAdapter()`. |

---

## Learn More

👉 **[Full Documentation](https://hyperwindmill.github.io/morphql/)** — Language reference, architecture guides, and advanced patterns.

---

## Contributing

MorphQL is actively evolving. If you have feedback on real-world integration scenarios or problems you're trying to solve, I'd love to hear from you.

- 🐛 [Open an issue](https://github.com/Hyperwindmill/morphql/issues)
- 💬 [Join the discussion](https://github.com/Hyperwindmill/morphql/discussions)

---

## License

MIT © 2026
