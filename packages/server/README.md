# Query Morph Server

A high-performance, stateless NestJS API for the Query Morph transformation engine.

## Overview

This server provides a RESTful interface to compile and execute Morph Query Language (MQL) transformations. Built with NestJS, it's designed to be a lightweight, scalable microservice that can be deployed in containerized environments.

### Features

- 🚀 **Stateless Execution**: Designed for horizontal scaling
- 🔄 **Isomorphic Engine**: Run the exact same transformations as the client-side library
- ⚡ **Redis Caching**: Built-in compiled query caching for high-throughput scenarios
- 🐳 **Docker Ready**: Production-optimized multi-stage container images
- 🔐 **API Key Authentication**: Optional security via `X-API-KEY` header
- 📊 **Swagger Documentation**: Interactive API docs at `/api`
- 🏥 **Health Checks**: Liveness and readiness endpoints for orchestration

## Quick Start

### Docker Compose (Recommended)

```bash
# Start server + Redis
docker compose up -d

# View logs
docker compose logs -f server

# Stop services
docker compose down
```

The server will be available at `http://localhost:3000` with Swagger docs at `http://localhost:3000/api`.

### Development Mode

```bash
# From monorepo root
npm run server

# Or from packages/server
npm run start:dev
```

## API Reference

All endpoints are prefixed with `/v1`. Full interactive documentation is available at `/api` when the server is running.

### 1. Execute Transformation

Compile and execute a query against data in a single request.

**Endpoint**: `POST /v1/execute`

**Request**:

```json
{
  "query": "from json to json transform set firstName = split(fullName, ' ')[0]",
  "data": { "fullName": "John Doe" }
}
```

**Response**:

```json
{
  "success": true,
  "result": { "firstName": "John" },
  "executionTime": 2.5
}
```

**Example with curl**:

```bash
curl -X POST http://localhost:3000/v1/execute \
  -H "Content-Type: application/json" \
  -d '{
    "query": "from json to json transform set name = fullName",
    "data": { "fullName": "Jane Smith" }
  }'
```

### 2. Compile Query

Get the generated JavaScript code for a query without executing it.

**Endpoint**: `POST /v1/compile`

**Request**:

```json
{
  "query": "from json to xml transform set name = fullName"
}
```

**Response**:

```json
{
  "success": true,
  "code": "function(source) { /* generated code */ }"
}
```

### 3. Health Checks

**Liveness**: `GET /v1/health`

```json
{ "status": "ok", "timestamp": "2026-01-20T00:00:00.000Z" }
```

**Readiness**: `GET /v1/health/ready`

- Returns `200` if service and Redis (if configured) are ready
- Returns `503` if Redis is configured but unavailable

## Configuration

Configure the server via environment variables:

| Variable       | Description                          | Default | Required |
| -------------- | ------------------------------------ | ------- | -------- |
| `PORT`         | Server port                          | `3000`  | No       |
| `NODE_ENV`     | Environment mode                     | -       | No       |
| `REDIS_HOST`   | Redis hostname for caching           | -       | No       |
| `REDIS_PORT`   | Redis port                           | `6379`  | No       |
| `REDIS_PREFIX` | Cache key prefix                     | `mql:`  | No       |
| `API_KEY`      | Optional API key for auth            | -       | No       |
| `API_KEY_FILE` | Optional API key file (for secrets)  | -       | No       |

**Note**: If `REDIS_HOST` is not set, the server runs without caching (queries are compiled on every request).

## Authentication

The server supports optional API key authentication via the `X-API-KEY` header.

**Enable authentication**:

```bash
# Set API_KEY environment variable
export API_KEY=your-secret-key

# Or in docker-compose.yml
environment:
  - API_KEY=your-secret-key
```

**Making authenticated requests**:

```bash
curl -X POST http://localhost:3000/v1/execute \
  -H "X-API-KEY: your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"query": "...", "data": {...}}'
```

If `API_KEY` is not set, all requests are allowed (useful for development).

## Docker Deployment

### Building the Image

```bash
# From monorepo root
docker build -f packages/server/Dockerfile -t query-morph-server .
```

### Running with Docker

```bash
# Without Redis
docker run -p 3000:3000 query-morph-server

# With Redis
docker run -p 3000:3000 \
  -e REDIS_HOST=redis.example.com \
  -e REDIS_PORT=6379 \
  query-morph-server
```

### Docker Compose Production

The included `docker-compose.yml` provides a production-ready setup with:

- NestJS server with health checks
- Redis for query caching
- Persistent Redis data volume
- Automatic restart policies

## Development

### Available Scripts

| Command               | Description              |
| --------------------- | ------------------------ |
| `npm run start`       | Start in production mode |
| `npm run start:dev`   | Start with hot-reload    |
| `npm run start:debug` | Start with debugger      |
| `npm run build`       | Build for production     |
| `npm run test`        | Run unit tests           |
| `npm run test:e2e`    | Run end-to-end tests     |
| `npm run lint`        | Lint and fix code        |

### Project Structure

```
packages/server/
├── src/
│   ├── main.ts              # Application entry point
│   ├── app.module.ts        # Root module
│   ├── morph.controller.ts  # API endpoints
│   └── auth.guard.ts        # API key authentication
├── test/                    # E2E tests
├── Dockerfile               # Multi-stage production build
├── docker-compose.yml       # Local deployment stack
└── package.json
```

## Performance

- **Caching**: When Redis is enabled, compiled queries are cached indefinitely (queries are deterministic)
- **Stateless**: Each request is independent, enabling horizontal scaling
- **Async**: All endpoints use async/await for non-blocking I/O

## Monitoring

The server provides structured logging via NestJS:

- Request routing and mapping on startup
- Error logging with stack traces
- Performance metrics in `executionTime` field

For production monitoring, consider:

- Health check endpoints for Kubernetes/Docker Swarm
- Redis monitoring for cache hit rates
- Application Performance Monitoring (APM) tools

## License

MIT
