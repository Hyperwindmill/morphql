# Store Engine & REPL

The `@morphql/store` package introduces an SQL-like querying and mutation layer to the MorphQL ecosystem. It allows you to treat collections of data (like directories of JSON files) as a functional database, supporting both complex `SELECT` queries and persistent data modifications.

## Interactive CLI REPL

The easiest way to experience `@morphql/store` is through the MorphQL CLI. By using the `store` subcommand, you can turn any folder of JSON files into an interactive, queriable database. **If no directory is specified, it defaults to the current working directory (`.`).**

```bash
# Start the interactive REPL in the current directory (.)
morphql store

# Or connect to a specific directory
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

## Data Mutability

MorphQL Store supports standard SQL mutation statements to modify your persistent data.

### INSERT
You can insert data using standard SQL syntax or a hybrid JSON syntax for complex objects.

```sql
-- Standard SQL syntax
INSERT INTO users (id, name, age) VALUES (1, 'Alice', 30)

-- Hybrid JSON syntax (ideal for nested objects)
INSERT INTO users { "id": 2, "name": "Bob", "metadata": { "active": true } }
```

### UPDATE
Update existing records using a `WHERE` clause. Mutations are transpiled into optimized MorphQL transformations.

```sql
UPDATE users SET active = true, status = 'verified' WHERE age >= 18
```

### DELETE
Remove records from a collection.

```sql
DELETE FROM users WHERE id = 1
```

## Automatic ID Generation

To simplify record creation, MorphQL Store provides an `autoincrement()` helper that automatically calculates the next available ID based on the existing records in the table (calculating `max(id) + 1`).

- **SQL Syntax**: Use `auto()` or `autoincrement()`.
- **JSON Syntax**: Use the `"$auto"` string placeholder.

```sql
-- SQL
INSERT INTO users (id, name) VALUES (auto(), 'Charlie')

-- JSON
INSERT INTO users { "id": "$auto", "name": "Dave" }
```

> [!TIP]
> If you need to store the literal string `"$auto"` in a JSON insert, escape it as `"\\$auto"`.

## SQL to MorphQL Transpilation

The Store Engine does not execute SQL directly. It parses your SQL query and transpiles it into highly optimized MorphQL code.

For example, an `UPDATE` statement:
```sql
UPDATE users SET active = true WHERE age >= 18
```

Is transpiled to:
```morphql
from object to object
transform
  section multiple data(
    clone()
    if (age >= 18) (
      set active = true
    )
  ) from source
```

## Programmatic Usage

### Setup with Adapters

The engine requires a `StorageAdapter` to resolve table names into data arrays and persist changes.

**Using the Folder Adapter (Node.js):**
The Folder Adapter maps table names to `.json` files. Data is stored **minified** by default to optimize performance and disk space.

```typescript
import { Store } from '@morphql/store';
import { FolderAdapter } from '@morphql/store/node';

const store = new Store(new FolderAdapter('./data-folder', { 
  pretty: false // set to true for readable JSON output
}));

// SELECT returns an array
const users = await store.query("SELECT * FROM users");

// Mutations return a MutationResult object
const result = await store.query("INSERT INTO users { \"id\": \"$auto\", \"name\": \"New User\" }");
console.log(result); // { type: 'insert', table: 'users' }
```

## Supported SQL Features

The Store Engine supports:

- **SELECT**: `*`, specific fields, calculated aliases (`AS` or `=`), `WHERE`, `ORDER BY`, `LIMIT`.
- **INSERT**: SQL `VALUES` syntax and direct `JSON` object injection.
- **UPDATE**: Multi-field `SET` with conditional `WHERE` filters.
- **DELETE**: Conditional record removal.
- **Auto-Increment**: `auto()`, `autoincrement()`, and `$auto`.
- **Operators**: Automatic mapping of SQL operators (e.g., `=` to `==`) for MorphQL compatibility.
