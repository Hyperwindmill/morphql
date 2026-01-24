# Server & API

The MorphQL Server is a high-performance, stateless REST API built with NestJS. It allows you to offload transformation logic to a dedicated microservice.

## Overview

The server provides a simple HTTP interface to compile and execute MorphQL transformations. It is designed for horizontal scalability and containerized environments.

**Key Features:**
*   **Stateless**: Scale simply by adding more instances.
*   **Redis Caching**: Caches compiled queries for high throughput.
*   **Docker Ready**: Ships with production-optimized Docker images.
*   **Swagger Docs**: Built-in interactive API documentation.

## Deployment

### Docker Compose

The easiest way to run the server is with Docker Compose. This sets up the API server and a Redis instance for caching.

```yaml
version: '3'
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

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Server port | `3000` |
| `REDIS_HOST` | Hostname for Redis (optional) | - |
| `REDIS_PORT` | Redis port | `6379` |
| `API_KEY` | Secret key for authentication (optional) | - |

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

**Response:**

```json
{
  "success": true,
  "code": "function(source) { ... }"
}
```

### Health Checks

*   `GET /v1/health`: Liveness probe.
*   `GET /v1/health/ready`: Readiness probe (checks Redis connection).

## Security

You can secure the API using the `API_KEY` environment variable. When set, clients must provide the key in the `X-API-KEY` header.

```bash
curl -H "X-API-KEY: my-secret" ...
```
