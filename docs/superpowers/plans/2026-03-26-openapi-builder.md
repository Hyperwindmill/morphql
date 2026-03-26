# OpenAPI Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fluent, framework-agnostic API to `@morphql/server` that generates OpenAPI 3.0 specs from MorphQL queries loaded from directories, inline definitions, or both.

**Architecture:** Two new files — `QueryRegistry` wraps `StagedQueryManager` to resolve queries from mixed sources, `MorphAPIBuilder` provides the fluent public API. `OpenAPIGenerator` gets a new `generateOperationSpec()` method for endpoint-level fragments. Everything is exported from the existing barrel.

**Tech Stack:** TypeScript (ES2022/NodeNext), Vitest, `@morphql/core` (compile, SchemaNode, AnalyzeResult)

---

### Task 1: QueryRegistry — tests

**Files:**
- Create: `packages/server/src/tests/QueryRegistry.spec.ts`

- [ ] **Step 1: Write tests for QueryRegistry**

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { QueryRegistry } from '../core/QueryRegistry.js';

describe('QueryRegistry', () => {
  describe('add() and resolve()', () => {
    it('resolves an inline query by name after add()', async () => {
      const registry = new QueryRegistry();
      await registry.add('my-query', {
        query: 'from json to json transform set id = userId',
      });

      const resolved = registry.resolve('my-query');
      expect(resolved).toBeDefined();
      expect(resolved.name).toBe('my-query');
      expect(resolved.analysis).toBeDefined();
      expect(resolved.analysis.source).toBeDefined();
      expect(resolved.analysis.target).toBeDefined();
    });

    it('throws when resolving a name that does not exist', () => {
      const registry = new QueryRegistry();
      expect(() => registry.resolve('nonexistent')).toThrowError(
        /not found.*nonexistent/i,
      );
    });

    it('includes available names in the error message', async () => {
      const registry = new QueryRegistry();
      await registry.add('alpha', { query: 'from json to json transform set a = b' });
      await registry.add('beta', { query: 'from json to json transform set a = b' });

      expect(() => registry.resolve('gamma')).toThrowError(/alpha.*beta/);
    });
  });

  describe('resolve() with InlineQueryDef', () => {
    it('compiles and returns a StagedQuery from an inline def', async () => {
      const registry = new QueryRegistry();
      const result = await registry.resolve({
        query: 'from json to json transform set name = firstName',
      });

      expect(result).toBeDefined();
      expect(result.analysis.source).toBeDefined();
      expect(result.analysis.target).toBeDefined();
    });

    it('caches inline queries by query string', async () => {
      const registry = new QueryRegistry();
      const def = { query: 'from json to json transform set x = y' };

      const a = await registry.resolve(def);
      const b = await registry.resolve(def);
      expect(a).toBe(b);
    });
  });

  describe('loadDirectory()', () => {
    let tmpDir: string;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'morphql-registry-test-'));
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('loads .morphql files from a directory', async () => {
      fs.writeFileSync(
        path.join(tmpDir, 'test-query.morphql'),
        'from json to json transform set id = userId',
      );

      const registry = new QueryRegistry();
      await registry.loadDirectory(tmpDir);

      const resolved = registry.resolve('test-query');
      expect(resolved).toBeDefined();
      expect(resolved.name).toBe('test-query');
    });

    it('warns and continues if directory does not exist', async () => {
      const registry = new QueryRegistry();
      await registry.loadDirectory('/nonexistent/path');
      expect(registry.getAll()).toHaveLength(0);
    });
  });

  describe('getAll()', () => {
    it('returns all registered queries', async () => {
      const registry = new QueryRegistry();
      await registry.add('a', { query: 'from json to json transform set x = y' });
      await registry.add('b', { query: 'from json to json transform set x = y' });

      expect(registry.getAll()).toHaveLength(2);
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/server && npx vitest run src/tests/QueryRegistry.spec.ts`
Expected: FAIL — `QueryRegistry` module not found

---

### Task 2: QueryRegistry — implementation

**Files:**
- Create: `packages/server/src/core/QueryRegistry.ts`

- [ ] **Step 1: Implement QueryRegistry**

```typescript
import { compile, type AnalyzeResult } from '@morphql/core';
import { StagedQueryManager, type StagedQuery } from './StagedQueryManager.js';

export interface InlineQueryDef {
  query: string;
  meta?: Record<string, any>;
}

export type QueryRef = string | InlineQueryDef;

export class QueryRegistry {
  private readonly manager = new StagedQueryManager();
  private readonly inlineCache = new Map<string, StagedQuery>();

  async loadDirectory(dir: string): Promise<void> {
    await this.manager.loadFromDirectory(dir);
  }

  async add(name: string, def: InlineQueryDef): Promise<void> {
    await this.manager.loadFromArray([{ name, query: def.query, meta: def.meta }]);
  }

  resolve(ref: QueryRef): StagedQuery;
  resolve(ref: QueryRef): StagedQuery | Promise<StagedQuery>;
  resolve(ref: QueryRef): StagedQuery | Promise<StagedQuery> {
    if (typeof ref === 'string') {
      return this.resolveByName(ref);
    }
    return this.resolveInline(ref);
  }

  getAll(): StagedQuery[] {
    return this.manager.getAll();
  }

  private resolveByName(name: string): StagedQuery {
    const query = this.manager.get(name);
    if (!query) {
      const available = this.manager
        .getAll()
        .map((q) => q.name)
        .join(', ');
      throw new Error(
        `Query not found: "${name}". Available queries: ${available || '(none)'}`,
      );
    }
    return query;
  }

  private async resolveInline(def: InlineQueryDef): Promise<StagedQuery> {
    const cached = this.inlineCache.get(def.query);
    if (cached) return cached;

    const engine = await compile(def.query, { analyze: true });
    if (!engine.analysis) {
      throw new Error(`Failed to analyze inline query: ${def.query.slice(0, 60)}...`);
    }

    const staged: StagedQuery = {
      name: `_inline_${this.inlineCache.size}`,
      query: def.query,
      engine,
      analysis: engine.analysis,
      meta: def.meta,
    };

    this.inlineCache.set(def.query, staged);
    return staged;
  }
}
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `cd packages/server && npx vitest run src/tests/QueryRegistry.spec.ts`
Expected: All tests PASS

- [ ] **Step 3: Commit**

```bash
git add packages/server/src/core/QueryRegistry.ts packages/server/src/tests/QueryRegistry.spec.ts
git commit -m "feat(server): add QueryRegistry for multi-source query resolution"
```

---

### Task 3: OpenAPIGenerator.generateOperationSpec() — tests

**Files:**
- Create: `packages/server/src/tests/OpenAPIGenerator.spec.ts`

- [ ] **Step 1: Write tests for generateOperationSpec**

```typescript
import { describe, it, expect } from 'vitest';
import { compile } from '@morphql/core';
import { OpenAPIGenerator } from '../core/OpenAPIGenerator.js';
import type { StagedQuery } from '../core/StagedQueryManager.js';

async function makeQuery(
  name: string,
  queryStr: string,
  meta?: Record<string, any>,
): Promise<StagedQuery> {
  const engine = await compile(queryStr, { analyze: true });
  return { name, query: queryStr, engine, analysis: engine.analysis!, meta };
}

describe('OpenAPIGenerator.generateOperationSpec()', () => {
  it('generates a response-only operation (GET-like)', async () => {
    const outputQuery = await makeQuery(
      'list-users',
      'from json to json transform set id = userId set name = fullName',
    );

    const op = await OpenAPIGenerator.generateOperationSpec({
      outputQuery,
    });

    expect(op.responses).toBeDefined();
    expect(op.responses['200']).toBeDefined();
    expect(op.responses['200'].content).toHaveProperty('application/json');
    expect(op.requestBody).toBeUndefined();
  });

  it('generates request + response operation (POST-like)', async () => {
    const inputQuery = await makeQuery(
      'create-input',
      'from json to json transform set userId = id',
    );
    const outputQuery = await makeQuery(
      'create-output',
      'from json to json transform set result = status',
    );

    const op = await OpenAPIGenerator.generateOperationSpec({
      inputQuery,
      outputQuery,
    });

    expect(op.requestBody).toBeDefined();
    expect(op.requestBody.required).toBe(true);
    expect(op.requestBody.content).toHaveProperty('application/json');
    expect(op.responses['200'].content).toHaveProperty('application/json');
  });

  it('applies summary, tags, and operationId when provided', async () => {
    const outputQuery = await makeQuery(
      'q',
      'from json to json transform set a = b',
    );

    const op = await OpenAPIGenerator.generateOperationSpec({
      outputQuery,
      summary: 'List all users',
      tags: ['Users'],
      operationId: 'listUsers',
    });

    expect(op.summary).toBe('List all users');
    expect(op.tags).toEqual(['Users']);
    expect(op.operationId).toBe('listUsers');
  });

  it('detects XML content type from query format', async () => {
    const outputQuery = await makeQuery(
      'xml-out',
      'from json to xml transform set name = fullName',
    );

    const op = await OpenAPIGenerator.generateOperationSpec({
      outputQuery,
    });

    expect(op.responses['200'].content).toHaveProperty('application/xml');
  });

  it('uses source schema for input and target schema for output', async () => {
    const inputQuery = await makeQuery(
      'in',
      'from json to json transform set internalId = externalId',
    );
    const outputQuery = await makeQuery(
      'out',
      'from json to json transform set displayName = rawName',
    );

    const op = await OpenAPIGenerator.generateOperationSpec({
      inputQuery,
      outputQuery,
    });

    const reqSchema = op.requestBody.content['application/json'].schema;
    expect(reqSchema.properties).toHaveProperty('externalId');

    const resSchema = op.responses['200'].content['application/json'].schema;
    expect(resSchema.properties).toHaveProperty('displayName');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/server && npx vitest run src/tests/OpenAPIGenerator.spec.ts`
Expected: FAIL — `generateOperationSpec` is not a function

---

### Task 4: OpenAPIGenerator.generateOperationSpec() — implementation

**Files:**
- Modify: `packages/server/src/core/OpenAPIGenerator.ts`

- [ ] **Step 1: Add generateOperationSpec to OpenAPIGenerator**

Add this interface and method to the existing `OpenAPIGenerator` class. Do NOT remove or modify `generatePathSpec` — it is used by server-instance.

```typescript
// Add at top of file, after existing imports
import type { StagedQuery } from './StagedQueryManager.js';  // already imported

// Add this interface before the class
export interface OperationSpecInput {
  inputQuery?: StagedQuery;
  outputQuery?: StagedQuery;
  summary?: string;
  tags?: string[];
  operationId?: string;
}

// Add this static method to the OpenAPIGenerator class
static async generateOperationSpec(input: OperationSpecInput): Promise<any> {
  const operation: any = {};

  if (input.summary) operation.summary = input.summary;
  if (input.tags) operation.tags = input.tags;
  if (input.operationId) operation.operationId = input.operationId;

  if (input.inputQuery) {
    const requestSchema = this.schemaNodeToOpenAPI(
      input.inputQuery.analysis.source,
      input.inputQuery.meta,
    );
    const sourceMime = this.getMimeType(input.inputQuery.analysis.sourceFormat);

    if (sourceMime === 'application/xml') {
      requestSchema.xml = { name: 'root' };
    }

    operation.requestBody = {
      required: true,
      content: { [sourceMime]: { schema: requestSchema } },
    };
  }

  if (input.outputQuery) {
    const responseSchema = this.schemaNodeToOpenAPI(
      input.outputQuery.analysis.target,
      input.outputQuery.meta,
    );
    const targetMime = this.getMimeType(input.outputQuery.analysis.targetFormat);

    if (targetMime === 'application/xml') {
      responseSchema.xml = { name: 'root' };
    }

    try {
      const sampleInput = this.schemaToSample(
        this.schemaNodeToOpenAPI(
          input.outputQuery.analysis.source,
          input.outputQuery.meta,
        ),
      );
      const responseExample = await input.outputQuery.engine(sampleInput);
      responseSchema.example = responseExample;
    } catch {
      // Warning: example generation failed, schema still valid
    }

    operation.responses = {
      '200': {
        description: 'Successful response',
        content: { [targetMime]: { schema: responseSchema } },
      },
    };
  }

  return operation;
}
```

Also make `getMimeType` public static (change from `private static` to `static`) since the builder will use it:

```typescript
// Change this line:
private static getMimeType(format?: string): string {
// To:
static getMimeType(format?: string): string {
```

- [ ] **Step 2: Run tests to verify they pass**

Run: `cd packages/server && npx vitest run src/tests/OpenAPIGenerator.spec.ts`
Expected: All tests PASS

- [ ] **Step 3: Run existing tests to check backward compatibility**

Run: `cd packages/server && npx vitest run`
Expected: All tests PASS (no regressions)

- [ ] **Step 4: Commit**

```bash
git add packages/server/src/core/OpenAPIGenerator.ts packages/server/src/tests/OpenAPIGenerator.spec.ts
git commit -m "feat(server): add generateOperationSpec to OpenAPIGenerator"
```

---

### Task 5: MorphAPIBuilder — tests

**Files:**
- Create: `packages/server/src/tests/MorphAPIBuilder.spec.ts`

- [ ] **Step 1: Write tests for MorphAPIBuilder**

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { createMorphAPI } from '../core/MorphAPIBuilder.js';

describe('MorphAPIBuilder', () => {
  describe('inline queries', () => {
    it('generates a complete OpenAPI document with defaults', async () => {
      const spec = await createMorphAPI()
        .addQuery('get-users', {
          query: 'from json to json transform set id = userId',
        })
        .endpoint('/users', 'get', { outputQuery: 'get-users' })
        .generateSpecs();

      expect(spec.openapi).toBe('3.0.0');
      expect(spec.info.title).toBe('MorphQL API');
      expect(spec.info.version).toBe('1.0.0');
      expect(spec.paths).toHaveProperty('/users');
      expect(spec.paths['/users']).toHaveProperty('get');
    });

    it('applies custom title, version, description', async () => {
      const spec = await createMorphAPI()
        .title('My API')
        .version('2.0.0')
        .description('Custom desc')
        .addQuery('q', {
          query: 'from json to json transform set a = b',
        })
        .endpoint('/x', 'get', { outputQuery: 'q' })
        .generateSpecs();

      expect(spec.info.title).toBe('My API');
      expect(spec.info.version).toBe('2.0.0');
      expect(spec.info.description).toBe('Custom desc');
    });

    it('aggregates same path with different methods', async () => {
      const spec = await createMorphAPI()
        .addQuery('q', {
          query: 'from json to json transform set a = b',
        })
        .endpoint('/items', 'get', { outputQuery: 'q' })
        .endpoint('/items', 'post', {
          inputQuery: 'q',
          outputQuery: 'q',
        })
        .generateSpecs();

      expect(spec.paths['/items']).toHaveProperty('get');
      expect(spec.paths['/items']).toHaveProperty('post');
    });

    it('auto-generates operationId from method and path', async () => {
      const spec = await createMorphAPI()
        .addQuery('q', {
          query: 'from json to json transform set a = b',
        })
        .endpoint('/users/{id}', 'get', { outputQuery: 'q' })
        .generateSpecs();

      expect(spec.paths['/users/{id}'].get.operationId).toBe('get_users_id');
    });

    it('uses custom operationId when provided', async () => {
      const spec = await createMorphAPI()
        .addQuery('q', {
          query: 'from json to json transform set a = b',
        })
        .endpoint('/users', 'get', {
          outputQuery: 'q',
          operationId: 'listAllUsers',
        })
        .generateSpecs();

      expect(spec.paths['/users'].get.operationId).toBe('listAllUsers');
    });

    it('supports anonymous inline queries in endpoint def', async () => {
      const spec = await createMorphAPI()
        .endpoint('/data', 'get', {
          outputQuery: {
            query: 'from json to json transform set name = fullName',
          },
        })
        .generateSpecs();

      expect(spec.paths['/data'].get.responses['200']).toBeDefined();
    });
  });

  describe('directory loading', () => {
    let tmpDir: string;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'morphql-builder-test-'));
      fs.writeFileSync(
        path.join(tmpDir, 'list-users.morphql'),
        'from json to json transform set id = userId set name = fullName',
      );
    });

    afterEach(() => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    });

    it('loads queries from directory and uses them in endpoints', async () => {
      const spec = await createMorphAPI()
        .loadDirectory(tmpDir)
        .endpoint('/users', 'get', { outputQuery: 'list-users' })
        .generateSpecs();

      expect(spec.paths['/users'].get.responses['200']).toBeDefined();
    });

    it('mixes directory and inline queries', async () => {
      const spec = await createMorphAPI()
        .loadDirectory(tmpDir)
        .addQuery('create-user', {
          query: 'from json to json transform set userId = id',
        })
        .endpoint('/users', 'get', { outputQuery: 'list-users' })
        .endpoint('/users', 'post', {
          inputQuery: 'create-user',
          outputQuery: 'list-users',
        })
        .generateSpecs();

      expect(spec.paths['/users']).toHaveProperty('get');
      expect(spec.paths['/users']).toHaveProperty('post');
      expect(spec.paths['/users'].post.requestBody).toBeDefined();
    });
  });

  describe('generateEndpointSpec()', () => {
    it('returns a single endpoint fragment', async () => {
      const builder = createMorphAPI().addQuery('q', {
        query: 'from json to json transform set a = b',
      });

      const fragment = await builder.generateEndpointSpec('/items', 'get', {
        outputQuery: 'q',
      });

      expect(fragment.path).toBe('/items');
      expect(fragment.method).toBe('get');
      expect(fragment.spec).toBeDefined();
      expect(fragment.spec.responses).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('throws when endpoint has neither inputQuery nor outputQuery', async () => {
      const builder = createMorphAPI().endpoint('/bad', 'get', {});

      await expect(builder.generateSpecs()).rejects.toThrowError(
        /neither.*inputQuery.*outputQuery/i,
      );
    });

    it('throws when query name is not found', async () => {
      const builder = createMorphAPI().endpoint('/x', 'get', {
        outputQuery: 'nonexistent',
      });

      await expect(builder.generateSpecs()).rejects.toThrowError(
        /not found.*nonexistent/i,
      );
    });

    it('last endpoint wins on duplicate path+method', async () => {
      const spec = await createMorphAPI()
        .addQuery('q1', {
          query: 'from json to json transform set a = b',
        })
        .addQuery('q2', {
          query: 'from json to json transform set x = y',
        })
        .endpoint('/items', 'get', {
          outputQuery: 'q1',
          summary: 'First',
        })
        .endpoint('/items', 'get', {
          outputQuery: 'q2',
          summary: 'Second',
        })
        .generateSpecs();

      expect(spec.paths['/items'].get.summary).toBe('Second');
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd packages/server && npx vitest run src/tests/MorphAPIBuilder.spec.ts`
Expected: FAIL — `MorphAPIBuilder` module not found

---

### Task 6: MorphAPIBuilder — implementation

**Files:**
- Create: `packages/server/src/core/MorphAPIBuilder.ts`

- [ ] **Step 1: Implement MorphAPIBuilder**

```typescript
import { QueryRegistry, type QueryRef, type InlineQueryDef } from './QueryRegistry.js';
import { OpenAPIGenerator } from './OpenAPIGenerator.js';
import type { StagedQuery } from './StagedQueryManager.js';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface EndpointDef {
  inputQuery?: QueryRef;
  outputQuery?: QueryRef;
  summary?: string;
  tags?: string[];
  operationId?: string;
}

export interface OpenAPIFragment {
  path: string;
  method: HttpMethod;
  spec: any;
}

interface PendingEndpoint {
  path: string;
  method: HttpMethod;
  def: EndpointDef;
}

interface PendingDirectory {
  dir: string;
}

interface PendingQuery {
  name: string;
  def: InlineQueryDef;
}

export class MorphAPIBuilder {
  private _title = 'MorphQL API';
  private _version = '1.0.0';
  private _description = '';
  private pendingDirs: PendingDirectory[] = [];
  private pendingQueries: PendingQuery[] = [];
  private pendingEndpoints: PendingEndpoint[] = [];
  private registry: QueryRegistry | null = null;

  title(title: string): this {
    this._title = title;
    return this;
  }

  version(version: string): this {
    this._version = version;
    return this;
  }

  description(description: string): this {
    this._description = description;
    return this;
  }

  loadDirectory(dir: string): this {
    this.pendingDirs.push({ dir });
    return this;
  }

  addQuery(name: string, def: InlineQueryDef): this {
    this.pendingQueries.push({ name, def });
    return this;
  }

  endpoint(path: string, method: HttpMethod, def: EndpointDef): this {
    this.pendingEndpoints.push({ path, method, def });
    return this;
  }

  async generateSpecs(): Promise<any> {
    const registry = await this.buildRegistry();

    const paths: Record<string, any> = {};

    for (const ep of this.pendingEndpoints) {
      const operation = await this.buildOperation(registry, ep);
      if (!paths[ep.path]) paths[ep.path] = {};
      paths[ep.path][ep.method] = operation;
    }

    return {
      openapi: '3.0.0',
      info: {
        title: this._title,
        version: this._version,
        description: this._description,
      },
      paths,
    };
  }

  async generateEndpointSpec(
    path: string,
    method: HttpMethod,
    def: EndpointDef,
  ): Promise<OpenAPIFragment> {
    const registry = await this.buildRegistry();
    const spec = await this.buildOperation(registry, { path, method, def });
    return { path, method, spec };
  }

  private async buildRegistry(): Promise<QueryRegistry> {
    if (this.registry) return this.registry;

    const registry = new QueryRegistry();

    for (const pending of this.pendingDirs) {
      await registry.loadDirectory(pending.dir);
    }

    for (const pending of this.pendingQueries) {
      await registry.add(pending.name, pending.def);
    }

    this.registry = registry;
    return registry;
  }

  private async buildOperation(
    registry: QueryRegistry,
    ep: PendingEndpoint,
  ): Promise<any> {
    const { def, path, method } = ep;

    if (!def.inputQuery && !def.outputQuery) {
      throw new Error(
        `Endpoint ${method.toUpperCase()} ${path} has neither inputQuery nor outputQuery`,
      );
    }

    const inputQuery = def.inputQuery
      ? await this.resolveQuery(registry, def.inputQuery)
      : undefined;

    const outputQuery = def.outputQuery
      ? await this.resolveQuery(registry, def.outputQuery)
      : undefined;

    const operationId =
      def.operationId ?? this.generateOperationId(method, path);

    return OpenAPIGenerator.generateOperationSpec({
      inputQuery,
      outputQuery,
      summary: def.summary,
      tags: def.tags,
      operationId,
    });
  }

  private async resolveQuery(
    registry: QueryRegistry,
    ref: QueryRef,
  ): Promise<StagedQuery> {
    const result = registry.resolve(ref);
    if (result instanceof Promise) return result;
    return result;
  }

  private generateOperationId(method: string, path: string): string {
    const sanitized = path
      .replace(/[{}]/g, '')
      .replace(/[^a-zA-Z0-9/]/g, '')
      .split('/')
      .filter(Boolean)
      .join('_');
    return `${method}_${sanitized}`;
  }
}

export function createMorphAPI(): MorphAPIBuilder {
  return new MorphAPIBuilder();
}
```

- [ ] **Step 2: Run builder tests to verify they pass**

Run: `cd packages/server && npx vitest run src/tests/MorphAPIBuilder.spec.ts`
Expected: All tests PASS

- [ ] **Step 3: Run all tests to check nothing is broken**

Run: `cd packages/server && npx vitest run`
Expected: All tests PASS

- [ ] **Step 4: Commit**

```bash
git add packages/server/src/core/MorphAPIBuilder.ts packages/server/src/tests/MorphAPIBuilder.spec.ts
git commit -m "feat(server): add MorphAPIBuilder with fluent API for OpenAPI generation"
```

---

### Task 7: Exports and build verification

**Files:**
- Modify: `packages/server/src/core/index.ts`

- [ ] **Step 1: Update barrel exports**

Add the new exports to the existing barrel file. Keep all existing exports intact.

```typescript
// Add these lines to packages/server/src/core/index.ts:

export {
  createMorphAPI,
  MorphAPIBuilder,
  HttpMethod,
  EndpointDef,
  OpenAPIFragment,
} from './MorphAPIBuilder.js';
export {
  QueryRegistry,
  QueryRef,
  InlineQueryDef,
} from './QueryRegistry.js';
export { OperationSpecInput } from './OpenAPIGenerator.js';
```

- [ ] **Step 2: Verify TypeScript build succeeds**

Run: `cd packages/server && npm run build`
Expected: Build succeeds with no errors, declaration files generated in `dist/`

- [ ] **Step 3: Run all tests one final time**

Run: `cd packages/server && npx vitest run`
Expected: All tests PASS

- [ ] **Step 4: Commit**

```bash
git add packages/server/src/core/index.ts
git commit -m "feat(server): export OpenAPI builder public API"
```
