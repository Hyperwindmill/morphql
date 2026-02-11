<p align="center">
  <img src="https://raw.githubusercontent.com/Hyperwindmill/morphql/main/morphql.png" alt="MorphQL" width="200" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@morphql/server"><img src="https://img.shields.io/npm/v/@morphql/server?label=%40morphql%2Fserver" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
</p>

# @morphql/server

A headless transformation server core for **MorphQL**. Designed to be embedded into existing NestJS or Node.js applications to provide managed transformation endpoints with caching and OpenAPI support.

## Core Features

- 🏗️ **Headless Core**: Embed MorphQL management into your own backend.
- 🔗 **Staged Queries**: Map `.morphql` files to named API endpoints automatically.
- ⚡ **Redis Integration**: Strategic caching of compiled queries for maximum throughput.
- 📖 **Auto-OpenAPI**: Generates Swagger/OpenAPI fragments for all defined transformations.
- 🛡️ **Type-Safe**: Inferred schemas for request and response formats.

## Installation

```bash
npm install @morphql/server @morphql/core
```

## Basic Usage (NestJS/Node)

```typescript
import { MorphServer } from '@morphql/server';

const morph = new MorphServer({
  queriesDir: './queries', // automatically load .morphql files
  cache: redisCache, // optional Redis caching
});

await morph.initialize();

// Execute a named staged query
const result = await morph.executeStaged('user-profile', sourceData);
```

## Standalone Usage

If you need a ready-to-deploy microservice, check the **[Server Instance Starter Template](https://github.com/Hyperwindmill/morphql/tree/main/packages/server-instance)** in our repository. It includes:

- Docker & Docker Compose setup
- Pre-configured NestJS application
- Health checks (Liveness/Readiness)
- API Key authentication

## Learn More

- 👉 **[Official Documentation](https://hyperwindmill.github.io/morphql/)**
- 🏠 **[Main Repository](https://github.com/Hyperwindmill/morphql)**

## License

MIT
