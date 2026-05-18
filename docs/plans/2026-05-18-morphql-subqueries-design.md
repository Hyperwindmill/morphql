# MorphQL Subqueries (Dependency Injection) Design

## Overview
This design implements the ability for a MorphQL query to call another pre-compiled MorphQL query.
To maintain the engine's isomorphic and synchronous runtime characteristics, we use a Dependency Injection approach. 

## Architecture
- Subqueries are injected into the compiler via `CompileOptions`.
- The parent query is executed at runtime synchronously, invoking the injected subquery engine.
- The orchestrator (e.g. CLI, Server, or Developer) is responsible for compiling subqueries, managing their individual caches, and injecting them.

## Data Flow
1. User compiles subquery A (e.g., `addressTransform`), optionally using its cache.
2. User compiles parent query B, passing `{ queries: { 'addressTransform': addressTransform } }` to `CompileOptions`.
3. `createEngine` injects `options.queries` into the runtime environment as `env.queries`.
4. In MorphQL query B, the function `morph('addressTransform', source.data)` compiles to `env.queries['addressTransform'](source.data)`.

## API Changes
### 1. `CompileOptions`
Add `queries` dictionary to allow injection:
```typescript
export interface CompileOptions {
  cache?: MorphQLCache;
  analyze?: boolean;
  queries?: Record<string, MorphEngine>;
}
```

### 2. `createEngine` (internal)
Update signature to accept `queries` and map them to `env.queries`.
```typescript
function createEngine<Source, Target>(
  code: string, 
  queries?: Record<string, MorphEngine>
): MorphEngine<Source, Target> {
  // ...
  const env = {
    parse: /*...*/,
    serialize: /*...*/,
    functions: runtimeFunctions,
    queries: queries || {},
  };
  // ...
}
```

### 3. `morph` Built-in Function
Register a new built-in function `morph(queryName, input)` that transpiles to `env.queries[queryName](input)`.
This will be added to `functionRegistry` in `packages/core/src/core/functions.ts` or `index.ts`. 
If called at runtime and the query is missing, it should throw a clear error `Subquery 'X' was not provided in CompileOptions.queries`.
