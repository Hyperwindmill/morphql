# OpenAPI Builder — Design Spec

## Problem

`@morphql/server` generates OpenAPI fragments tightly coupled to the NestJS server instance. Developers using MorphQL as a transformation/gateway layer behind their own APIs cannot extract OpenAPI schema segments to merge into their custom specs.

## Goal

Provide a standalone, framework-agnostic API in `@morphql/server` that:
- Loads MorphQL queries from directories, inline definitions, or both
- Generates OpenAPI 3.0 fragments per endpoint or a complete document
- Lets the developer define their own paths/methods and map queries to them

## Architecture

### Components

```
createMorphAPI()  →  MorphAPIBuilder  →  QueryRegistry (internal)
                                      →  OpenAPIGenerator (existing, extended)
```

Three layers:

1. **QueryRegistry** — accumulates queries from any source, resolves by name or inline
2. **MorphAPIBuilder** — fluent public API, collects endpoints and metadata, delegates generation
3. **OpenAPIGenerator** — existing class, extended to produce endpoint-level fragments (not just full path specs)

### QueryRegistry

Internal component. Wraps `StagedQueryManager` for directory loading and adds inline query support.

```typescript
class QueryRegistry {
  async loadDirectory(dir: string): Promise<void>;
  async add(name: string, def: InlineQueryDef): Promise<void>;
  resolve(ref: QueryRef): StagedQuery;
  getAll(): StagedQuery[];
}

type QueryRef = string | InlineQueryDef;

interface InlineQueryDef {
  query: string;
  meta?: Record<string, any>;
}
```

- `resolve(string)` — looks up by name in the registry, throws if not found (with list of available names)
- `resolve(InlineQueryDef)` — compiles on the fly during `generateSpecs()`/`generateEndpointSpec()`, cached by query string for the lifetime of the builder instance
- Directory loading reuses `StagedQueryManager.loadFromDirectory()` internally

### MorphAPIBuilder

Public API. Created via `createMorphAPI()` factory function.

```typescript
function createMorphAPI(): MorphAPIBuilder;

class MorphAPIBuilder {
  // Document metadata (fluent)
  title(title: string): this;
  version(version: string): this;
  description(description: string): this;

  // Query sources (fluent)
  loadDirectory(dir: string): this;
  addQuery(name: string, def: InlineQueryDef): this;

  // Endpoint definitions (fluent)
  endpoint(path: string, method: HttpMethod, def: EndpointDef): this;

  // Output
  async generateSpecs(): Promise<OpenAPIDocument>;
  async generateEndpointSpec(
    path: string,
    method: HttpMethod,
    def: EndpointDef,
  ): Promise<OpenAPIFragment>;
}

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface EndpointDef {
  inputQuery?: QueryRef;
  outputQuery?: QueryRef;
  summary?: string;
  tags?: string[];
  operationId?: string;
}
```

Fluent methods record intent. All async work (directory loading, query compilation) happens at `generateSpecs()` / `generateEndpointSpec()` time.

### Usage Examples

**Complete document:**

```typescript
import { createMorphAPI } from '@morphql/server';

const spec = await createMorphAPI()
  .title('My Gateway API')
  .version('2.0.0')
  .description('Backend gateway')
  .loadDirectory('./queries')
  .endpoint('/users', 'get', { outputQuery: 'list-users' })
  .endpoint('/users', 'post', {
    inputQuery: 'create-user-request',
    outputQuery: 'create-user-response',
  })
  .generateSpecs();

// spec is a valid OpenAPI 3.0 document
```

**Single fragment for manual merge:**

```typescript
const builder = createMorphAPI().loadDirectory('./queries');

const fragment = await builder.generateEndpointSpec('/users', 'get', {
  outputQuery: 'list-users',
});

// fragment.spec contains the operation object, ready for Object.assign
```

**Inline queries, no files:**

```typescript
const spec = await createMorphAPI()
  .title('Inline API')
  .addQuery('transform-out', {
    query: 'from json to json transform set id = userId',
    meta: { userId: { description: 'User identifier' } },
  })
  .endpoint('/items', 'get', { outputQuery: 'transform-out' })
  .generateSpecs();
```

**Mixed sources:**

```typescript
const spec = await createMorphAPI()
  .loadDirectory('./queries')
  .addQuery('custom-transform', { query: '...' })
  .endpoint('/data', 'post', {
    inputQuery: 'file-based-query',        // from directory
    outputQuery: { query: '...', meta: {} }, // inline, anonymous
  })
  .generateSpecs();
```

## Output Structure

### `generateSpecs()` — Complete OpenAPI Document

```typescript
{
  openapi: '3.0.0',
  info: { title, version, description },
  paths: {
    '/users': {
      get: {
        summary: '...',
        operationId: 'get_users',
        responses: {
          '200': {
            description: 'Successful response',
            content: { 'application/json': { schema: { /* target schema */ } } }
          }
        }
      },
      post: {
        summary: '...',
        operationId: 'post_users',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { /* source schema */ } } }
        },
        responses: {
          '200': {
            description: 'Successful response',
            content: { 'application/json': { schema: { /* target schema */ } } }
          }
        }
      }
    }
  }
}
```

Defaults: `title = 'MorphQL API'`, `version = '1.0.0'`, `description = ''`.

### `generateEndpointSpec()` — Single Endpoint Fragment

```typescript
{
  path: '/users',
  method: 'post',
  spec: {
    summary: '...',
    operationId: '...',
    requestBody: { ... },
    responses: { ... }
  }
}
```

### Schema Mapping

| Query role | Schema used | Maps to |
|---|---|---|
| `inputQuery` | source schema (analysis.source) | `requestBody.content.{mime}.schema` |
| `outputQuery` | target schema (analysis.target) | `responses.200.content.{mime}.schema` |

Content type derived from query format declaration: `json` → `application/json`, `xml` → `application/xml`, else `text/plain`.

### Endpoint Aggregation

Multiple `.endpoint()` calls with the same path but different methods aggregate under one path object:

```typescript
.endpoint('/users', 'get', { ... })
.endpoint('/users', 'post', { ... })
// → paths: { '/users': { get: { ... }, post: { ... } } }
```

### OperationId Generation

Auto-generated from method + path: `get /users/{id}` → `get_users_id`. Overridable via `EndpointDef.operationId`.

### Response Examples

Generated by executing the query engine with sample input data (derived from schema). If execution fails, the schema is generated without an example (warning logged, no error thrown).

## Error Handling

| Condition | Behavior |
|---|---|
| Endpoint with neither `inputQuery` nor `outputQuery` | Error at `generateSpecs()`, identifies which path/method |
| Query name not found in registry | Error with query name + list of available names |
| Query compilation failure | Error with query name + original compilation error |
| Directory does not exist | Warning, no queries loaded, continues |
| Example generation fails | Warning, schema generated without example |
| Duplicate endpoint (same path + method) | Last definition wins, no error |

## Integration with Existing Code

- `QueryRegistry` wraps `StagedQueryManager` — reuses `loadFromDirectory()` and `add()` (compile with `analyze: true`)
- `OpenAPIGenerator.schemaNodeToOpenAPI()` reused as-is for schema conversion
- `OpenAPIGenerator.schemaToSample()` reused for example generation
- `OpenAPIGenerator.getMimeType()` reused for content type detection
- `OpenAPIGenerator.generatePathSpec()` preserved for backward compatibility (NestJS server-instance continues to use it)
- New method `OpenAPIGenerator.generateOperationSpec()` added for endpoint-level generation (used by builder)

## Exports

All new public API exported from `@morphql/server`:

```typescript
export { createMorphAPI, MorphAPIBuilder } from './core/MorphAPIBuilder.js';
export { QueryRegistry, QueryRef, InlineQueryDef } from './core/QueryRegistry.js';
// Existing exports preserved
```

## File Structure (new files)

```
packages/server/src/core/
  QueryRegistry.ts        # Query accumulation and resolution
  MorphAPIBuilder.ts      # Fluent builder + spec generation
  OpenAPIGenerator.ts     # Extended with generateOperationSpec()
  StagedQueryManager.ts   # Unchanged
  MorphServer.ts          # Unchanged
```
