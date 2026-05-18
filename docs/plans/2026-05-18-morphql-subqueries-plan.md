# MorphQL Subqueries Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement Dependency Injection for subqueries via `CompileOptions` and a `morph` built-in function.

**Architecture:** We will extend `CompileOptions` to accept a dictionary of compiled queries. `createEngine` will map this dictionary to `env.queries`. We will add a `morph` built-in function that transpiles to a call to `env.queries[name](input)`, throwing a runtime error if the query is not provided.

**Tech Stack:** TypeScript

---

### Task 1: Update CompileOptions and createEngine

**Files:**
- Modify: `packages/core/src/index.ts`
- Create: `packages/core/src/tests/morph_subquery.spec.ts`

**Step 1: Write the failing test**

```typescript
// packages/core/src/tests/morph_subquery.spec.ts
import { describe, it, expect } from 'vitest';
import { compile } from '../index.js';

describe('MorphQL Subqueries (Dependency Injection)', () => {
  it('should inject and execute a subquery via morph()', async () => {
    const addressQuery = await compile(`
      from object to object
      transform
        set full = street + ", " + city
    `);

    const mainQuery = await compile(`
      from object to object
      transform
        set addr = morph('addressTransform', source.address)
    `, {
      queries: {
        'addressTransform': addressQuery
      }
    });

    const result = mainQuery({
      address: { street: "123 Main St", city: "New York" }
    });
    
    expect(result).toEqual({
      addr: { full: "123 Main St, New York" }
    });
  });

  it('should throw an error at runtime if subquery is missing', async () => {
    const mainQuery = await compile(`
      from object to object
      transform
        set addr = morph('missingQuery', source.address)
    `);

    expect(() => mainQuery({ address: {} })).toThrow(/missingQuery/);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run packages/core/src/tests/morph_subquery.spec.ts`
Expected: FAIL with "Unknown function: morph" or type error on `queries`

**Step 3: Write minimal implementation**

In `packages/core/src/index.ts`:

1. Update `CompileOptions` interface:
```typescript
export interface CompileOptions {
  cache?: MorphQLCache;
  analyze?: boolean;
  queries?: Record<string, MorphEngine>;
}
```

2. Update `compile` usage of `createEngine` (in both cache hit and normal flows):
```typescript
      return createEngine<Source, Target>(cachedCode, options.queries);
// ...
  const engine = createEngine<Source, Target>(code, options?.queries);
```

3. Update `createEngine` signature and body:
```typescript
function createEngine<Source, Target>(
  code: string,
  queries?: Record<string, MorphEngine>
): MorphEngine<Source, Target> {
  const factory = new Function(code);
  const transform = factory() as (source: any, env: any) => any;

  const env = {
    parse: (format: string, content: string, options?: any) => {
      return getAdapter(format).parse(content, options);
    },
    serialize: (format: string, data: any, options?: any) => {
      return getAdapter(format).serialize(data, options);
    },
    functions: runtimeFunctions,
    queries: queries || {},
  };
//...
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run packages/core/src/tests/morph_subquery.spec.ts`
Expected: Still FAIL, because `morph` is not yet in the function registry.

---

### Task 2: Add `morph` to functionRegistry

**Files:**
- Modify: `packages/core/src/core/functions.ts`

**Step 1: Write minimal implementation**

In `packages/core/src/core/functions.ts`, add the new handler to `functionRegistry`:
```typescript
  morph: (args: string[], _compiler) => {
    if (args.length !== 2) {
      throw new Error('morph() requires exactly 2 arguments (queryName, input)');
    }
    const [queryName, input] = args;
    // queryName is a string literal e.g. "'addressTransform'"
    return `(env.queries[${queryName}] ? env.queries[${queryName}](${input}) : (() => { throw new Error(\`Subquery \${${queryName}} was not provided in CompileOptions.queries\`); })())`;
  },
```

**Step 2: Run test to verify it passes**

Run: `npx vitest run packages/core/src/tests/morph_subquery.spec.ts`
Expected: PASS

**Step 3: Commit**

```bash
git add packages/core/src/index.ts packages/core/src/core/functions.ts packages/core/src/tests/morph_subquery.spec.ts
git commit -m "feat(core): support subqueries via dependency injection and morph function"
```
