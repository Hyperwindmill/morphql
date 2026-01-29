# Getting Started

MorphQL (Morph Query Language) is a declarative DSL that transforms structural data—JSON, XML, CSV, or Objects—by compiling your queries into specialized, native JavaScript functions.

## Installation

To use MorphQL in your project, install the core package via npm:

```bash
npm install @morphql/core
```

## Your First Transformation

MorphQL works by compiling a query string into a reusable function. This function takes your input data and returns the transformed result.

Here is a simple example that transforms a JSON object into a new JSON structure with a greeting:

```javascript
import { compile, morphQL } from "@morphql/core";

// 1. Define your transformation query
const query = morphQL`
  from object to json
  transform
    set greeting = "Hello, " + name + "!"
    set isAdult = age >= 18
`;

// 2. Compile the query into an engine function
const engine = await compile(query);

// 3. Execute the transformation
const input = { name: "Alice", age: 25 };
const result = engine(input);

console.log(result);
// Output: '{"greeting":"Hello, Alice!","isAdult":true}'
```

> **Note**: The `morphQL` tag function is a no-op that helps IDE extensions identify MorphQL syntax for highlighting.

## How it Works

Unlike traditional data mappers that interpret transformations at runtime, MorphQL **compiles once and executes fast**.

1.  **Parse**: The query is parsed into an Abstract Syntax Tree (AST).
2.  **Compile**: The AST is converted into a highly optimized JavaScript function.
3.  **Execute**: The generated function runs directly on the V8 engine (or any JS engine), ensuring native performance.

## Next Steps

MorphQL is available in multiple forms to fit your workflow:

- **[Library (Core)](./library)**: Integrate MorphQL directly into your Node.js or browser application.
- **[CLI](./cli)**: Use the command-line interface for scripting and file transformations.
- **[Server](./server)**: Deploy a stateless REST API with **Staged Queries** (the recommended pattern for production API endpoints).
- **[Language Reference](./language-reference)**: Learn the full syntax, functions, and operators.
