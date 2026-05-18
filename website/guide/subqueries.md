# Subqueries

MorphQL supports executing one query from within another via **Subqueries**. This allows you to split complex transformations into smaller, reusable components, maintaining high readability and testability.

## The `morph()` Function

To execute a subquery, use the built-in `morph(queryName, inputData)` function inside your query. 

```morphql
from object to object
transform
  set billingAddress = morph('addressFormatter', source.billing)
  set shippingAddress = morph('addressFormatter', source.shipping)
```

The `morph()` function is completely synchronous at runtime. There is zero I/O overhead.

## Loading Subqueries

MorphQL uses a **Dependency Injection** pattern. Subqueries must be pre-compiled and passed to the main query's engine during compilation. How this is done depends on the tool you are using:

### Using the CLI

The CLI automatically handles subqueries using the `-s, --subquery` flag.

```bash
morphql batch \
  -Q main.morphql \
  -s addressFormatter=addressFormatter.morphql \
  --in ./data --out ./dist
```

If the filename matches the query name, you can simply pass the name:

```bash
morphql watch -Q main.morphql -s addressFormatter --in ./data --out ./dist
```

### Using VSCode (Smart Loading)

The MorphQL VSCode Extension supports **Smart Loading**. When you open a query in the Live Preview panel, the extension automatically parses your query, finds any `morph('subName')` calls, and looks for `subName.morphql` in the same directory. 

You don't need to configure anything—just keep your subquery files adjacent to the main query and the Live Preview will update automatically!

### Using the Core Library (Node.js)

If you are using `@morphql/core` directly, you must manually compile the subqueries and pass them via the `CompileOptions.queries` map.

```typescript
import { compile } from "@morphql/core";

// 1. Compile the subquery
const addressEngine = await compile(`
  from object to object
  transform set full = street + " " + city
`);

// 2. Inject it into the main query
const mainEngine = await compile(`
  from object to object
  transform set address = morph('addressFormatter', source)
`, {
  queries: {
    'addressFormatter': addressEngine
  }
});

// 3. Execute!
const result = mainEngine({ street: "123 Main", city: "NY" });
```
