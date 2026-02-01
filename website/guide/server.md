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

### OpenAPI Integration

The server core can generate OpenAPI specification fragments for your staged queries, making it easy to integrate into your existing documentation.

```typescript
const fragments = await morph.getOpenAPIFragments();
// Merge these into your Swagger/OpenAPI definition
```

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

### Advanced Documentation (Metadata)

You can manually refine the auto-generated Swagger documentation by providing a parallel metadata file (`.meta.yaml` or `.meta.json`).

**Example `queries/user-profiles.meta.yaml`:**

```yaml
"users.userId":
  type: "number"
  description: "Internal user ID"
  example: 123
"profiles.fullName":
  description: "Display name"
```

The system uses path-based lookups (ignoring array indices) to apply these overrides to the generated schema.

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
