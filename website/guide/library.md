# Core Library

The `@morphql/core` package is the heart of the ecosystem. It contains the compiler that turns MorphQL queries into executable JavaScript functions.

## Installation

```bash
npm install @morphql/core
```

## Basic Usage

The primary API is the `compile` function. It is asynchronous because the compilation process might involve loading format adapters.

```typescript
import { compile, morphQL } from "@morphql/core";

// Define the query
const query = morphQL`
  from json to xml
  transform
    set fullName = firstName + " " + lastName
`;

// Compile it
const engine = await compile(query);

// Execute it
const result = engine({ firstName: "John", lastName: "Doe" });
console.log(result);
// <root><fullName>John Doe</fullName></root>
```

## The `morphQL` Tag

The `morphQL` tagged template literal is a utility that currently acts as a pass-through (returning the string as-is). Its primary purpose is to enable syntax highlighting and language features in editors like VSCode and JetBrains IDEs when the corresponding extension is installed.

```typescript
// Without tag - plain string, no highlighting
const q1 = "from json to json";

// With tag - enables syntax highlighting
const q2 = morphQL`from json to json`;
```

## TypeScript Support

MorphQL is written in TypeScript and ships with type definitions.

```typescript
import { compile } from "@morphql/core";

interface Input {
  name: string;
}

// You can use the engine with any input type
const engine = await compile("from object to json transform set n = name");

const data: Input = { name: "Test" };
const result = engine(data); // result is string (JSON)
```

## Performance Considerations

Compilation is an expensive operation compared to execution. You should always **compile once and execute many times**.

**✅ Good Pattern:**

```javascript
// Init (e.g. at app startup)
const transformUser = await compile(userQuery);
const transformProduct = await compile(productQuery);

// Runtime (e.g. per request)
app.get("/user", (req, res) => {
  res.send(transformUser(req.dbUser));
});
```

**❌ Bad Pattern:**

```javascript
app.get("/user", async (req, res) => {
  // Re-compiling on every request destroys performance!
  const engine = await compile(userQuery);
  res.send(engine(req.dbUser));
});
```

## Advanced Use: MorphQL Server Core

If you need managed staged queries (loaded from files), auto-generated OpenAPI documentation, or built-in caching strategies while staying inside your application, consider using `@morphql/server` instead of `@morphql/core`.

See the [Server & API Guide](./server.md) for more details.
