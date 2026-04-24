# @morphql/store Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Create a lightweight database-like package (`@morphql/store`) that allows querying generic storage adapters using an SQL-like syntax that compiles directly to MorphQL.

**Architecture:** We will create a `packages/store` workspace with three main components: a regex-based `SqlParser`, a `Transpiler` that generates MorphQL strings, and a `Store` class that orchestrates the data loading via adapters, compiling, and execution. The resulting output will be unwrapped to behave like standard database rows.

**Tech Stack:** TypeScript, Vitest, `@morphql/core`

---

### Task 1: Package Initialization

**Files:**
- Create: `packages/store/package.json`
- Create: `packages/store/tsconfig.json`
- Create: `packages/store/vite.config.ts`

**Step 1: Write the failing test**
Run: `npm test` from project root or packages/store should fail if `packages/store` isn't fully configured. (Skip actual test creation for scaffolding).

**Step 2: Run test to verify it fails**
Run: `cd packages/store && npx vitest run` (after init)
Expected: No tests found / failure

**Step 3: Write minimal implementation**
Create basic boilerplate.

`packages/store/package.json`:
```json
{
  "name": "@morphql/store",
  "version": "0.1.39",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts --clean",
    "test": "vitest run"
  },
  "dependencies": {
    "@morphql/core": "workspace:*"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "vitest": "^1.0.0",
    "typescript": "^5.0.0"
  }
}
```

`packages/store/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

**Step 4: Run test to verify it passes**
Run: `npm i` in root to link workspace.
Expected: PASS (No errors linking)

**Step 5: Commit**
```bash
git add packages/store/package.json packages/store/tsconfig.json
git commit -m "chore(store): initialize @morphql/store package"
```

### Task 2: Core Interfaces and Storage Adapters

**Files:**
- Create: `packages/store/src/types.ts`
- Create: `packages/store/src/adapters/memory.ts`
- Create: `packages/store/src/tests/adapters.spec.ts`

**Step 1: Write the failing test**
```typescript
// packages/store/src/tests/adapters.spec.ts
import { describe, expect, it } from 'vitest';
import { MemoryAdapter } from '../adapters/memory.js';

describe('Storage Adapters', () => {
  it('MemoryAdapter should read from memory', async () => {
    const adapter = new MemoryAdapter({ users: [{ id: 1 }] });
    const data = await adapter.read('users');
    expect(data).toEqual([{ id: 1 }]);
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npx vitest run packages/store/src/tests/adapters.spec.ts`
Expected: FAIL (Cannot find module)

**Step 3: Write minimal implementation**
```typescript
// packages/store/src/types.ts
export interface StorageAdapter {
  read(collection: string): Promise<any[]>;
}

// packages/store/src/adapters/memory.ts
import { StorageAdapter } from '../types.js';

export class MemoryAdapter implements StorageAdapter {
  constructor(private data: Record<string, any[]> = {}) {}

  async read(collection: string): Promise<any[]> {
    return this.data[collection] || [];
  }
}
```

**Step 4: Run test to verify it passes**
Run: `npx vitest run packages/store/src/tests/adapters.spec.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add packages/store/src/types.ts packages/store/src/adapters/memory.ts packages/store/src/tests/adapters.spec.ts
git commit -m "feat(store): add StorageAdapter interface and MemoryAdapter"
```

### Task 3: SQL Parser

**Files:**
- Create: `packages/store/src/parser.ts`
- Create: `packages/store/src/tests/parser.spec.ts`

**Step 1: Write the failing test**
```typescript
// packages/store/src/tests/parser.spec.ts
import { describe, expect, it } from 'vitest';
import { parseSQL } from '../parser.js';

describe('SQL Parser', () => {
  it('should parse basic SELECT', () => {
    const ast = parseSQL('SELECT id, name FROM users');
    expect(ast.from).toBe('users');
    expect(ast.select).toEqual([
      { alias: 'id', expr: 'id' },
      { alias: 'name', expr: 'name' }
    ]);
  });

  it('should handle aliases and wildcards', () => {
    const ast = parseSQL('SELECT *, name = firstName + " " + lastName FROM users');
    expect(ast.hasWildcard).toBe(true);
    expect(ast.select).toEqual([
      { alias: 'name', expr: 'firstName + " " + lastName' }
    ]);
  });

  it('should parse WHERE, ORDER BY, LIMIT', () => {
    const ast = parseSQL('SELECT id FROM users WHERE age > 18 ORDER BY score DESC LIMIT 10');
    expect(ast.where).toBe('age > 18');
    expect(ast.orderBy).toBe('score');
    expect(ast.orderDesc).toBe(true);
    expect(ast.limit).toBe('10');
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npx vitest run packages/store/src/tests/parser.spec.ts`
Expected: FAIL

**Step 3: Write minimal implementation**
```typescript
// packages/store/src/parser.ts
export interface ParsedSQL {
  select: { alias: string; expr: string }[];
  hasWildcard: boolean;
  from: string;
  where?: string;
  orderBy?: string;
  orderDesc?: boolean;
  limit?: string;
}

export function parseSQL(sql: string): ParsedSQL {
  const result: ParsedSQL = {
    select: [],
    hasWildcard: false,
    from: ''
  };

  // Case insensitive keyword matching, safely splitting blocks
  const lowerSQL = sql.toLowerCase();
  
  const fromIdx = lowerSQL.indexOf(' from ');
  const whereIdx = lowerSQL.indexOf(' where ');
  const orderIdx = lowerSQL.indexOf(' orderby '); // MorphQL uses orderby as single word or order by
  const orderByIdx = lowerSQL.indexOf(' order by ') > -1 ? lowerSQL.indexOf(' order by ') : orderIdx;
  const limitIdx = lowerSQL.indexOf(' limit ');

  const getIdx = (idx: number) => idx === -1 ? sql.length : idx;

  // 1. SELECT
  const selectClause = sql.substring(7, fromIdx).trim();
  const selectParts = smartSplit(selectClause, ',');
  
  for (let part of selectParts) {
    part = part.trim();
    if (part === '*') {
      result.hasWildcard = true;
      continue;
    }

    // Check for `expr AS alias` or `alias = expr`
    let aliasMatch = part.match(/^(.*?)\s+as\s+([a-zA-Z0-9_]+)$/i);
    if (aliasMatch) {
      result.select.push({ expr: aliasMatch[1].trim(), alias: aliasMatch[2] });
      continue;
    }
    
    aliasMatch = part.match(/^([a-zA-Z0-9_]+)\s*=\s*(.*)$/i);
    if (aliasMatch) {
      result.select.push({ alias: aliasMatch[1].trim(), expr: aliasMatch[2].trim() });
      continue;
    }

    // Default: field itself
    result.select.push({ alias: part, expr: part });
  }

  // 2. FROM
  let nextIdx = Math.min(getIdx(whereIdx), getIdx(orderByIdx), getIdx(limitIdx));
  result.from = sql.substring(fromIdx + 6, nextIdx).trim();

  // 3. WHERE
  if (whereIdx !== -1) {
    nextIdx = Math.min(getIdx(orderByIdx), getIdx(limitIdx));
    result.where = sql.substring(whereIdx + 7, nextIdx).trim();
  }

  // 4. ORDER BY
  if (orderByIdx !== -1) {
    nextIdx = getIdx(limitIdx);
    const orderClause = sql.substring(orderByIdx + (orderIdx !== -1 ? 9 : 10), nextIdx).trim();
    const parts = orderClause.split(/\s+/);
    result.orderBy = parts[0];
    result.orderDesc = parts.length > 1 && parts[1].toLowerCase() === 'desc';
  }

  // 5. LIMIT
  if (limitIdx !== -1) {
    result.limit = sql.substring(limitIdx + 7).trim();
  }

  return result;
}

function smartSplit(str: string, delimiter: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';
  let parenDepth = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (inQuotes) {
      current += char;
      if (char === quoteChar && str[i-1] !== '\\') inQuotes = false;
    } else {
      if (char === '"' || char === "'") {
        inQuotes = true;
        quoteChar = char;
        current += char;
      } else if (char === '(') {
        parenDepth++;
        current += char;
      } else if (char === ')') {
        parenDepth--;
        current += char;
      } else if (char === delimiter && parenDepth === 0) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }
  
  if (current) result.push(current);
  return result;
}
```

**Step 4: Run test to verify it passes**
Run: `npx vitest run packages/store/src/tests/parser.spec.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add packages/store/src/parser.ts packages/store/src/tests/parser.spec.ts
git commit -m "feat(store): implement regex-based SQL parser with smart splitting"
```

### Task 4: Transpiler

**Files:**
- Create: `packages/store/src/transpiler.ts`
- Create: `packages/store/src/tests/transpiler.spec.ts`

**Step 1: Write the failing test**
```typescript
// packages/store/src/tests/transpiler.spec.ts
import { describe, expect, it } from 'vitest';
import { parseSQL } from '../parser.js';
import { transpile } from '../transpiler.js';

describe('Transpiler', () => {
  it('should transpile parsed SQL to MorphQL', () => {
    const ast = parseSQL('SELECT *, fullName = firstName + " " + lastName FROM users WHERE age > 18 ORDER BY score DESC LIMIT 10');
    const morphql = transpile(ast);
    
    expect(morphql).toContain('from object to object');
    expect(morphql).toContain('section multiple data(');
    expect(morphql).toContain('clone()');
    expect(morphql).toContain('set fullName = firstName + " " + lastName');
    expect(morphql).toContain('from source where age > 18 orderby score desc limit 10');
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npx vitest run packages/store/src/tests/transpiler.spec.ts`
Expected: FAIL

**Step 3: Write minimal implementation**
```typescript
// packages/store/src/transpiler.ts
import { ParsedSQL } from './parser.js';

export function transpile(ast: ParsedSQL): string {
  const actions: string[] = [];

  if (ast.hasWildcard) {
    actions.push('    clone()');
  }

  for (const field of ast.select) {
    actions.push(`    set ${field.alias} = ${field.expr}`);
  }

  let clauses = 'from source';
  if (ast.where) clauses += ` where ${ast.where}`;
  if (ast.orderBy) clauses += ` orderby ${ast.orderBy} ${ast.orderDesc ? 'desc' : 'asc'}`;
  if (ast.limit) clauses += ` limit ${ast.limit}`;

  return `from object to object
transform
  section multiple data(
${actions.join('\n')}
  ) ${clauses}
`;
}
```

**Step 4: Run test to verify it passes**
Run: `npx vitest run packages/store/src/tests/transpiler.spec.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add packages/store/src/transpiler.ts packages/store/src/tests/transpiler.spec.ts
git commit -m "feat(store): add AST-to-MorphQL transpiler"
```

### Task 5: Store Engine and E2E Integration

**Files:**
- Create: `packages/store/src/store.ts`
- Create: `packages/store/src/index.ts`
- Create: `packages/store/src/tests/store.spec.ts`

**Step 1: Write the failing test**
```typescript
// packages/store/src/tests/store.spec.ts
import { describe, expect, it } from 'vitest';
import { Store } from '../store.js';
import { MemoryAdapter } from '../adapters/memory.js';

describe('MorphStore', () => {
  it('should execute end-to-end SQL query', async () => {
    const data = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 25 },
      { id: 3, name: 'Charlie', age: 35 }
    ];
    
    const store = new Store(new MemoryAdapter({ users: data }));
    
    const result = await store.query('SELECT *, isAdult = true FROM users WHERE age >= 30 ORDER BY age DESC LIMIT 1');
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(3);
    expect(result[0].name).toBe('Charlie');
    expect(result[0].isAdult).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npx vitest run packages/store/src/tests/store.spec.ts`
Expected: FAIL

**Step 3: Write minimal implementation**
```typescript
// packages/store/src/store.ts
import { compile } from '@morphql/core';
import { parseSQL } from './parser.js';
import { transpile } from './transpiler.js';
import { StorageAdapter } from './types.js';

export class Store {
  constructor(private adapter: StorageAdapter) {}

  async query(sql: string, variables: Record<string, any> = {}): Promise<any[]> {
    const ast = parseSQL(sql);
    const mqlQuery = transpile(ast);
    
    const rawData = await this.adapter.read(ast.from);
    
    const engine = await compile(mqlQuery);
    const result = engine(rawData, variables) as any;
    
    // MorphQL array sections generate { sectionName: [ ... ] }
    // We strip it down to just the array
    return result.data || [];
  }
}

// packages/store/src/index.ts
export * from './types.js';
export * from './store.js';
export * from './parser.js';
export * from './transpiler.js';
export * from './adapters/memory.js';
```

**Step 4: Run test to verify it passes**
Run: `npx vitest run packages/store/src/tests/store.spec.ts`
Expected: PASS

**Step 5: Commit**
```bash
git add packages/store/src/store.ts packages/store/src/index.ts packages/store/src/tests/store.spec.ts
git commit -m "feat(store): integrate Store class orchestrator and E2E processing"
```
