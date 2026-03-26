The MorphQL Server is available in two forms: as a **headless core library** for embedding into existing Node.js applications, and as a **standalone server** (Docker-ready) for direct deployment.

## Choice of Integration

| Usage                 | Package           | Best For                                                                           |
| :-------------------- | :---------------- | :--------------------------------------------------------------------------------- |
| **Headless Core**     | `@morphql/server` | Embedding staged queries and OpenAPI generation into your own Express/NestJS apps. |
| **Standalone Server** | (Docker Instance) | Deploying a dedicated microservice with REST endpoints for transformations.        |

## Headless Core (`@morphql/server`)

The core library is framework-agnostic and provides high-level abstractions to manage transformations.

### Installation

The server core requires `@morphql/core` as a peer dependency. You must install both:

```bash
npm install @morphql/server @morphql/core
```

> [!NOTE]
> Since `@morphql/core` maintains an internal registry of adapters, having it as a peer dependency ensures that only one instance of the engine is used, preventing "Adapter not found" errors when using custom adapters.

### Basic Usage

The `MorphServer` class is the primary entry point.

```typescript
import { MorphServer } from "@morphql/server";

const morph = new MorphServer({
  queriesDir: "./queries", // optional: load .morphql files
  cache: myCache, // optional: Redis or memory cache
});

// Initialize (loads staged queries)
await morph.initialize();

// Execute a staged query by name
const result = await morph.executeStaged("user-transform", { id: 1 });

// Execute a dynamic query
const dynamicResult = await morph.execute(
  "from object to json transform set a = 1",
  data,
);
```

### OpenAPI Builder

MorphQL can generate a complete OpenAPI 3.0 specification from your transformation queries. This is especially useful when using MorphQL as a **gateway / mapping layer** in front of backend APIs — you define your endpoints, attach input and output transformations, and the library produces the OpenAPI document for you.

#### Quick Start

```typescript
import { createMorphAPI } from "@morphql/server";

const spec = await createMorphAPI()
  .title("My Gateway API")
  .version("2.0.0")
  .description("API gateway with MorphQL transformations")
  .loadDirectory("./queries")
  .endpoint("/users", "get", { outputQuery: "list-users" })
  .endpoint("/users", "post", {
    inputQuery: "create-user-request",
    outputQuery: "create-user-response",
  })
  .generateSpecs();

// spec is a valid OpenAPI 3.0 document, ready for Swagger UI
```

Every method is chainable. The builder loads queries from multiple sources and generates the document at the end.

#### Defining Endpoints

Each `.endpoint()` call maps a path and HTTP method to one or two MorphQL queries:

| Parameter     | Description                                      |
| :------------ | :----------------------------------------------- |
| `inputQuery`  | Transforms the **request body** (source schema → requestBody). Optional for GET/DELETE. |
| `outputQuery` | Transforms the **response** (target schema → response 200). |
| `summary`     | Custom summary for the operation.                |
| `tags`        | OpenAPI tags array.                              |
| `operationId` | Custom operationId (auto-generated if omitted).  |

```typescript
.endpoint("/orders/{id}", "get", {
  outputQuery: "get-order-response",
  summary: "Get order by ID",
  tags: ["Orders"],
})
```

Multiple methods on the same path are aggregated automatically:

```typescript
.endpoint("/users", "get", { outputQuery: "list-users" })
.endpoint("/users", "post", { inputQuery: "create-user-input", outputQuery: "create-user-output" })
// → /users: { get: { ... }, post: { ... } }
```

#### Query Sources

Queries can come from **files**, **inline definitions**, or **both**:

```typescript
// From a directory of .morphql files
createMorphAPI()
  .loadDirectory("./queries")
  .endpoint("/users", "get", { outputQuery: "list-users" })  // resolved by filename

// Inline definition (no files needed)
createMorphAPI()
  .addQuery("transform-out", {
    query: "from json to json transform set id = userId set name = fullName",
    meta: { userId: { description: "User identifier", example: 42 } },
  })
  .endpoint("/users", "get", { outputQuery: "transform-out" })

// Anonymous inline (directly in the endpoint)
createMorphAPI()
  .endpoint("/items", "get", {
    outputQuery: {
      query: "from json to json transform set name = rawName",
    },
  })

// Mix: directory + inline overrides
createMorphAPI()
  .loadDirectory("./queries")
  .addQuery("custom-transform", { query: "..." })
  .endpoint("/data", "post", {
    inputQuery: "file-based-query",        // from directory
    outputQuery: "custom-transform",       // inline, registered by name
  })
```

#### Single Endpoint Fragments

If you have your own OpenAPI document and want to generate fragments to merge manually:

```typescript
const builder = createMorphAPI().loadDirectory("./queries");

const fragment = await builder.generateEndpointSpec("/users", "get", {
  outputQuery: "list-users",
});

// fragment = { path: "/users", method: "get", spec: { ... } }
// Merge into your existing document:
myOpenAPIDoc.paths[fragment.path] = {
  ...myOpenAPIDoc.paths[fragment.path],
  [fragment.method]: fragment.spec,
};
```

#### Schema Derivation

Schemas are derived automatically from the MorphQL query analysis:

| Query Role    | Schema Used                | Maps To                                      |
| :------------ | :------------------------- | :------------------------------------------- |
| `inputQuery`  | Source schema (`from` side) | `requestBody.content.{mime}.schema`          |
| `outputQuery` | Target schema (`to` side)  | `responses.200.content.{mime}.schema`        |

Content types are inferred from the query format: `json` → `application/json`, `xml` → `application/xml`, otherwise `text/plain`.

Response **examples** are generated automatically by running the query engine with sample data. If execution fails, the schema is still generated without the example.

#### Metadata Enrichment

Use `.meta.yaml` or `.meta.json` files alongside your `.morphql` files to add descriptions, types and examples to the generated schemas:

```yaml
# queries/list-users.meta.yaml
"users.userId":
  type: "number"
  description: "Internal user ID"
  example: 123
"users.fullName":
  description: "Display name"
```

These annotations are applied using path-based lookups and appear in the generated OpenAPI schemas.

#### Gateway Pattern

A common pattern is using MorphQL as a transformation layer between your public API and backend services. Even if a query is not actually executed at runtime, you can use it purely to **describe the API contract**:

```typescript
const spec = await createMorphAPI()
  .title("Public API")
  .version("1.0.0")
  // Input transformation: what the client sends → what the backend expects
  .addQuery("create-user-in", {
    query: `from json to json transform
      set internal_id = externalId
      set full_name = firstName + " " + lastName`,
  })
  // Output transformation: what the backend returns → what the client sees
  .addQuery("create-user-out", {
    query: `from json to json transform
      set id = internal_id
      set displayName = full_name
      set status = if (is_active, "active", "inactive")`,
  })
  .endpoint("/users", "post", {
    inputQuery: "create-user-in",
    outputQuery: "create-user-out",
    tags: ["Users"],
  })
  .generateSpecs();
```

The generated spec describes your **public-facing** contract: the client sends `{ externalId, firstName, lastName }` and receives `{ id, displayName, status }`. The internal backend format stays hidden.

---

## Standalone Server

The standalone server is a pre-configured NestJS application that exposes the MorphQL engine via REST endpoints. It is ideal for microservice architectures.

### Key Features:

- **Redis Caching**: Caches compiled queries for extreme performance.
- **Docker Ready**: Production-optimized images for Kubernetes or Swarm.
- **Auto-Documentation**: Serves a Swagger UI with endpoints for all staged queries.
- **API Key Auth**: Built-in simple header-based authentication.

---

### Starter Template

If you are building a custom transformation service from scratch, we recommend using the `packages/server-instance` folder from our monorepo as a **Starter Template**. It provides a production-ready foundation with:

- NestJS structure and dependency injection.
- Health checks (Liveness/Readiness).
- Docker and Docker Compose configurations.
- Pre-configured Swagger / OpenAPI documentation.

Simply copy the folder and customize the controllers or services to fit your specific needs while keeping the `@morphql/server` core for the heavy lifting.

> [!TIP]
> **Standalone Docker Usage**: If you are using this as a template outside the monorepo, use the `Dockerfile.standalone` provided in the folder. It is pre-configured to install all MorphQL dependencies from the npm registry instead of local workspaces.
>
> ```bash
> # Rename it to use it as default
> mv Dockerfile.standalone Dockerfile
> docker build -t my-custom-morphql-server .
> ```

## Deployment

### Docker Compose

The easiest way to run the server is with Docker Compose. This sets up the API server and a Redis instance for caching.

```yaml
version: "3"
services:
  morphql-server:
    image: morphql-server
    ports:
      - "3000:3000"
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - redis

  redis:
    image: redis:alpine
```

Run it:

```bash
docker compose up -d
```

The server will be available at `http://localhost:3000`.

### Configuration

You can configure the server using environment variables:

| Variable              | Description                              | Default     |
| :-------------------- | :--------------------------------------- | :---------- |
| `PORT`                | Server port                              | `3000`      |
| `REDIS_HOST`          | Hostname for Redis (optional)            | -           |
| `REDIS_PORT`          | Redis port                               | `6379`      |
| `API_KEY`             | Secret key for authentication (optional) | -           |
| `MORPHQL_QUERIES_DIR` | Directory for staged `.morphql` files    | `./queries` |

> If `REDIS_HOST` is not provided, the server will run in memory-only mode without persistent caching across restarts.

## API Reference

### Execute Transformation

`POST /v1/execute`

Compiles (if not cached) and executes a query against provided data.

**Request Body:**

```json
{
  "query": "from json to json transform set name = fullName",
  "data": { "fullName": "John Doe" }
}
```

**Response:**

```json
{
  "success": true,
  "result": { "name": "John Doe" },
  "executionTime": 1.2
}
```

### Compile Only

`POST /v1/compile`

Returns the generated JavaScript code for a query.

**Request Body:**

```json
{
  "query": "from json to xml"
}
```

### Execute Staged Query

`POST /v1/q/:name`

Executes a pre-compiled query stored in the queries directory.

**Example:** `POST /v1/q/user-profiles`

The Request Body and Response types are automatically inferred from the query logic and served via Swagger.

### Admin: Refresh Documentation

`POST /v1/admin/refresh-docs`

Triggers a reload of all staged queries and regenerates the OpenAPI documentation fragments.

**Response:**

```json
{
  "success": true,
  "timestamp": "2026-01-29T22:00:00.000Z"
}
```

## Staged Queries

Staged queries allow you to pre-define and name transformations, which are then exposed as dedicated API endpoints.

1.  Create a `.morphql` file in your queries directory (e.g., `queries/user-profiles.morphql`).
2.  The server automatically compiles and caches it on startup.
3.  Access it via `POST /v1/q/user-profiles`.

### Metadata

You can refine the auto-generated schemas with `.meta.yaml` or `.meta.json` files alongside your queries. See [Metadata Enrichment](#metadata-enrichment) in the OpenAPI Builder section for details.

## CLI Tools

### Generate Documentation

`npm run docs:generate`

Generates OpenAPI documentation fragments for all staged queries without starting the full server. Useful for build pipelines.

### Health Checks

- `GET /v1/health`: Liveness probe.
- `GET /v1/health/ready`: Readiness probe (checks Redis connection).

## Security

You can secure the API using the `API_KEY` environment variable. When set, clients must provide the key in the `X-API-KEY` header.

```bash
curl -H "X-API-KEY: my-secret" ...
```
