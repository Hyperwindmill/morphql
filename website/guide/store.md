# Store Engine & REPL

The `@morphql/store` package introduces an SQL-like querying layer and interactive REPL to the MorphQL ecosystem. It allows you to query collections of data (like directories of JSON files) using familiar `SELECT` syntax, which is automatically transpiled into highly optimized MorphQL transformations under the hood.

## Interactive CLI REPL

The easiest way to experience `@morphql/store` is through the MorphQL CLI. By using the `store` subcommand, you can turn any folder of JSON files into an interactive, queriable database.

```bash
# Start the interactive REPL connected to a directory of data
morphql store -d ./my-data-folder
```

This will launch the MorphQL shell:

```
MorphQL Store Interactive REPL
Connected to folder: ./my-data-folder
Type your SQL-like query and press Enter. Type 'exit' to quit.

morphql> SELECT *, type = 'fruit' FROM products
┌─────────┬────┬──────────┬─────────┐
│ (index) │ id │ name     │ type    │
├─────────┼────┼──────────┼─────────┤
│ 0       │ 1  │ 'Apple'  │ 'fruit' │
│ 1       │ 2  │ 'Banana' │ 'fruit' │
└─────────┴────┴──────────┴─────────┘
```

You can also run single-shot queries directly for scripts, CI/CD, or pipelining into `jq`:

```bash
morphql store -d ./data -q "SELECT id, name FROM users WHERE age >= 18 ORDER BY age DESC LIMIT 10"
```

## SQL to MorphQL Transpilation

The Store Engine does not execute SQL directly. Instead, it parses your SQL query into an Abstract Syntax Tree (AST) and transpiles it into pure MorphQL code.

For example, this SQL query:

```sql
SELECT *, fullName = firstName + " " + lastName
FROM users
WHERE age >= 18
ORDER BY age DESC
LIMIT 10
```

Is transpiled in real-time to the following MorphQL:

```morphql
from object to object
transform
  section multiple data(
    clone()
    set fullName = firstName + " " + lastName
  ) from source where age >= 18 orderby age desc limit 10
```

This ensures that the SQL interface benefits from the exact same JIT compilation, caching, and blazing-fast execution speeds as standard MorphQL queries.

## Programmatic Usage

You can use the `@morphql/store` package directly in your Node.js or browser applications to orchestrate data fetching and MorphQL compilation automatically.

### Installation

```bash
npm install @morphql/store
```

### Setup with Adapters

The engine requires a `StorageAdapter` to know how to resolve table names (e.g., `FROM users`) into data arrays.

**Using the built-in Memory Adapter (Browser/Node):**

```typescript
import { Store, MemoryAdapter } from '@morphql/store';

const store = new Store(new MemoryAdapter({
  users: [
    { id: 1, name: "Alice", age: 30 },
    { id: 2, name: "Bob", age: 17 }
  ]
}));

const adults = await store.query("SELECT * FROM users WHERE age >= 18");
console.log(adults); // [{ id: 1, name: "Alice", age: 30 }]
```

**Using the built-in Folder Adapter (Node.js only):**

The Folder Adapter maps table names to `.json` files in a specific directory (e.g., `users` maps to `users.json`). To ensure the main `@morphql/store` package remains browser-compatible (isomorphic), Node-specific adapters are exported from a dedicated `/node` subpath.

```typescript
import { Store } from '@morphql/store';
import { FolderAdapter } from '@morphql/store/node';

const store = new Store(new FolderAdapter('./data-folder'));

const products = await store.query("SELECT * FROM products ORDER BY price ASC");
```

## Supported SQL Features

The current transpiler supports the following clauses and concepts:

- `SELECT *` (Transpiles to `clone()`)
- `SELECT field` (Transpiles to `set field`)
- `SELECT field = expression` (Transpiles to `set field = expression`)
- `SELECT expression AS field` (Transpiles to `set field = expression`)
- `FROM table`
- `WHERE expression`
- `ORDER BY field [ASC|DESC]`
- `LIMIT number`

The syntax is designed to be forgiving, supporting multiline queries and ignoring inconsistencies in whitespace or capitalization.
