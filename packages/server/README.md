# Query Morph Server

A high-performance, stateless API for the Query Morph engine.

## Overview

This server provides a RESTful interface to compile and execute Morph Query Language (MQL) transformations. It is designed to be a lightweight, scalable microservice.

### Features

- **Stateless Execution**: Designed for horizontal scaling.
- **Isomorphic Engine**: Run the exact same transformations as the client-side library.
- **Redis Caching**: Built-in AST caching for high-throughput scenarios.
- **Docker Ready**: Production-optimized container images.

## API Reference

### 1. Execute Transformation

Compile and run a query against a dataset in a single request.

- **Endpoint**: `POST /v1/execute`
- **Body**:
  ```json
  {
    "query": "from json to json transform set name = split(fullName, ' ').0",
    "data": { "fullName": "John Doe" }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "result": { "name": "John" },
    "executionTime": 2
  }
  ```

### 2. Compile Only

Get the generated JavaScript code for a query. Useful for debugging or client-side hydration.

- **Endpoint**: `POST /v1/compile`
- **Body**: `{ "query": "..." }`
- **Response**: `{ "code": "..." }`

## Configuration

The server is configured via environment variables:

| Variable       | Description      | Default     |
| -------------- | ---------------- | ----------- |
| `PORT`         | Server port      | `3000`      |
| `REDIS_HOST`   | Redis hostname   | `localhost` |
| `REDIS_PORT`   | Redis port       | `6379`      |
| `REDIS_PREFIX` | Cache key prefix | `mql:`      |

## Running

### Docker Compose (Recommended)

```bash
docker compose up -d
```

### Manual

```bash
# Install dependencies
npm install

# Start Redis (optional, but recommended)
# docker run -p 6379:6379 redis:alpine

# Run server
npm run start:dev
```
