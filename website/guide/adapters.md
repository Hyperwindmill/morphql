# Adapters

Adapters are responsible for parsing input data and serializing the transformed output. MorphQL comes with built-in support for JSON, XML, and plain JavaScript Objects, but it also allows you to register custom adapters.

## Built-in Adapters

| Adapter    | Name     | Description                                               |
| :--------- | :------- | :-------------------------------------------------------- |
| **JSON**   | `json`   | Native JSON parsing and serialization.                    |
| **XML**    | `xml`    | Fast XML parsing and serialization via `fast-xml-parser`. |
| **Object** | `object` | Identity adapter for working with in-memory JS objects.   |

## Passing Parameters

You can pass parameters to adapters directly in the `from` and `to` clauses, as well as within subquery sections. Parameters can be **positional** or **named**.

### Positional Parameters

A single string literal in parentheses is automatically mapped to the `rootGenerated` option (most commonly used by the XML adapter).

```morphql
from object to xml("UserResponse")
```

### Named Parameters

You can pass multiple named parameters using the `key=value` syntax. Supported value types include strings, numbers, booleans (`true`/`false`), and `null`.

```morphql
from xml(ignoreAttributes=true) to object
transform
  section output(
    from object to xml(rootGenerated="Data", indent=true)
    transform clone
  )
```

### Common XML Options

The built-in XML adapter supports many options forwarded directly to `fast-xml-parser`'s `XMLParser` and `XMLBuilder`:

- `rootGenerated` (string): The name of the root tag when serializing.
- `ignoreAttributes` (boolean): Whether to ignore XML attributes.
- `attributeNamePrefix` (string): Prefix used for attributes (default is `$`).
- `format` (boolean): Whether to format/indent the output XML.

## Custom Adapters

You can extend MorphQL by registering your own adapters. An adapter is an object that implements the `DataAdapter` interface.

### The DataAdapter Interface

```typescript
interface DataAdapter {
  parse(content: string, options?: any): any;
  serialize(data: any, options?: any): string;
}
```

### Registering an Adapter

Use the `registerAdapter` function to add your custom adapter to the registry.

```typescript
import { registerAdapter } from "@morphql/core";

registerAdapter("yaml", {
  parse: (content, options) => {
    // Implement YAML parsing logic
    return myYamlParser(content, options);
  },
  serialize: (data, options) => {
    // Implement YAML serialization logic
    return myYamlSerializer(data, options);
  },
});
```

Once registered, you can use it in your MorphQL queries:

```morphql
from yaml to json
transform clone
```

### Checking Registered Adapters

You can verify if an adapter is available or retrieve it using `getAdapter`:

```typescript
import { getAdapter } from "@morphql/core";

try {
  const adapter = getAdapter("yaml");
  console.log("YAML adapter is ready!");
} catch (e) {
  console.error("Adapter not found");
}
```
