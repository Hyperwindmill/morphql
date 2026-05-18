<p align="center">
  <img src="https://raw.githubusercontent.com/Hyperwindmill/morphql/main/morphql.png" alt="MorphQL" width="200" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@morphql/store"><img src="https://img.shields.io/npm/v/@morphql/store?label=%40morphql%2Fstore" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
</p>

# @morphql/store

A lightweight data store for **MorphQL** with a familiar SQL-like query interface. `SELECT`, `INSERT`, `UPDATE`, and `DELETE` statements are transpiled to MorphQL and executed against pluggable storage adapters.

## Key Features

- 🗂️ **SQL-like API**: Query and mutate data with `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
- 🔌 **Pluggable Adapters**: In-memory adapter for tests and runtime data, folder adapter for JSON-on-disk persistence.
- 🚀 **Powered by MorphQL**: Statements are transpiled to MorphQL and compiled to native JS for fast execution.
- 🔢 **Autoincrement**: Built-in `auto()` / `$auto` placeholders for numeric primary keys.
- 🌐 **Isomorphic Core**: The in-memory adapter runs in both Node.js and the browser; the folder adapter is Node-only.

## Installation

```bash
npm install @morphql/store
```

## Usage

### In-memory store

```typescript
import { Store, MemoryAdapter } from '@morphql/store';

const store = new Store(new MemoryAdapter());

await store.query(`INSERT INTO users (id, name, age) VALUES (auto(), 'Alice', 30)`);
await store.query(`INSERT INTO users (id, name, age) VALUES (auto(), 'Bob', 17)`);

const adults = await store.query(`SELECT name FROM users WHERE age >= 18`);
// → [{ name: 'Alice' }]
```

### Persistent folder store (Node.js)

```typescript
import { Store } from '@morphql/store';
import { FolderAdapter } from '@morphql/store/node';

const store = new Store(new FolderAdapter('./data', { pretty: true }));

await store.query(`UPDATE users SET status = 'active' WHERE age >= 18`);
```

Each table is persisted as a JSON file inside the directory (e.g. `./data/users.json`).

## Learn More

- 👉 **[Official Documentation](https://hyperwindmill.github.io/morphql/)**
- 🏠 **[Main Repository](https://github.com/Hyperwindmill/morphql)**

## License

MIT
