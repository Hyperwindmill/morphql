# @morphql/store Design

## Overview
`@morphql/store` is a new package acting as a lightweight, flexible in-memory data store with SQL-like querying capabilities. It allows users to write simple, semi-Transact SQL queries (`SELECT ... FROM ... WHERE ...`) which are automatically transpiled into MorphQL queries, compiled, and executed against data retrieved via a generic `StorageAdapter`.

The store implements a pure "database behavior": when querying, the returned output is directly the naked array of matched/transformed records, discarding the typical outer container object used by default in MorphQL array mapping.

## Architecture & Components

### 1. Storage Adapters
The store abstracts where the data actually comes from (memory, JSON files on disk, network, etc.) through a `StorageAdapter` interface:
```typescript
export interface StorageAdapter {
  read(collection: string): Promise<any[]>;
}
```
A default `MemoryAdapter` and a `FileAdapter` (for Node.js filesystem JSON access) can be provided.

### 2. The SQL Parser
Instead of a heavy AST-based SQL parser that could break when encountering MorphQL-specific functions (e.g. `substring(name, 0, 3)`), we implement a **custom regex-based lightweight parser**. 

The parser splits the query into its primary clauses (`SELECT`, `FROM`, `WHERE`, `ORDER BY`, `LIMIT`) by looking for keywords, and carefully splits the `SELECT` clause by commas while honoring parentheses `()` and quotes `""` to preserve MorphQL expressions.

It extracts:
- **Select fields**: Parses aliases (`expr AS alias` or `expr alias`) and catches the `*` wildcard.
- **From**: The collection identifier.
- **Where**: The exact expression string to be injected into MorphQL.
- **OrderBy**: The column and sort direction (`ASC`/`DESC`).
- **Limit**: The limit count.

### 3. The Transpiler
Converts the parsed SQL-like structure into a rigid MorphQL query string:
```morphql
from object to object
transform
  section multiple data(
    // clone() injected if '*' was in SELECT
    // set alias = expr injected for each selected field
  ) from source where <WHERE_CLAUSE> orderby <ORDER_CLAUSE> limit <LIMIT_CLAUSE>
```

### 4. The Store Class
The main `Store` class orchestrates the execution:
1. Receives the SQL string.
2. Calls the Parser and Transpiler to get the MorphQL query.
3. Requests the data from the `StorageAdapter` using the extracted `FROM` collection name.
4. Compiles the MorphQL query via `@morphql/core`.
5. Executes the compiled engine with the data.
6. Returns `result.data` directly, stripping away the outer object wrapper.

## Future Extensions
While this iteration focuses entirely on the `SELECT` query, the design leaves room for future `INSERT`, `UPDATE`, and `DELETE` commands which will follow a similar "SQL to MorphQL transformation" strategy.
