# Adapters

Adapters are responsible for parsing input data and serializing the transformed output. MorphQL comes with built-in support for JSON, XML, and plain JavaScript Objects, but it also allows you to register custom adapters.

## Built-in Adapters

| Adapter       | Name        | Description                                                                                                       |
| :------------ | :---------- | :---------------------------------------------------------------------------------------------------------------- |
| **JSON**      | `json`      | Native JSON parsing and serialization.                                                                            |
| **XML**       | `xml`       | Fast XML parsing and serialization via [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser). |
| **CSV**       | `csv`       | CSV parsing and serialization via [PapaParse](https://www.papaparse.com/).                                        |
| **Plaintext** | `plaintext` | Splits input into raw lines. Useful for fixed-length formats.                                                     |
| **Object**    | `object`    | Identity adapter for working with in-memory JS objects.                                                           |

## Passing Parameters

You can pass parameters to adapters directly in the `from` and `to` clauses, as well as within subquery sections. Parameters can be **positional** or **named**.

### Positional Parameters

You can pass one or more positional parameters (literals) to an adapter. These are forwarded to the adapter as an array in `options.params`.

Built-in adapters like **XML** use the first positional parameter as the `rootGenerated` name if it's not explicitly provided as a named parameter.

```morphql
// Equivalent to xml(rootGenerated="UserResponse")
from object to xml("UserResponse")

// Custom adapters can access all positional parameters
from myFormat("param1", 42, true) to json
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

### CSV Options

The CSV adapter uses [PapaParse](https://www.papaparse.com/) and supports the following options:

- `delimiter` (string): The column delimiter (defaults to `,`). Can also be passed as the first positional parameter: `csv(";")`.
- `skipEmptyLines` (boolean): Whether to skip empty lines (defaults to `true`).

#### Data Structure

When parsing, the CSV adapter produces an object with a `rows` array. Each row is an object where columns are mapped to Excel-style letters (`A`, `B`, `C`, ..., `Z`, `AA`, ...).

```morphql
from csv to object
transform
  section multiple users (
    from object to object
    transform
      set name = A
      set email = B
  ) from rows
```

When serializing, the adapter expects an object with a `rows` array containing objects with these lettered keys. The columns will be ordered alphabetically by their letter index.

### Plaintext Options

The Plaintext adapter splits input into an array of strings and supports:

- `separator` (string | RegExp): The line separator (defaults to `/\r?\n/` for parsing and `\n` for serialization). Can also be passed as the first positional parameter: `plaintext(";")`.

#### Data Structure

When parsing, it produces an object with a `rows` array of raw strings.

```morphql
from plaintext to object
transform
  section multiple records (
    set rawLine = source
  ) from rows
```

When serializing, it expects an object with a `rows` array of strings.

## Custom Adapters

You can extend MorphQL by registering your own adapters. An adapter is an object that implements the `DataAdapter` interface.

### The DataAdapter Interface

```typescript
interface DataAdapter {
  /**
   * Parse input content into a JavaScript object.
   * @param content The input string or object.
   * @param options Dictionary of named parameters and a `params` array for positional ones.
   */
  parse(content: string, options?: any): any;

  /**
   * Serialize a JavaScript object into the target format.
   * @param data The object to serialize.
   * @param options Dictionary of named parameters and a `params` array for positional ones.
   */
  serialize(data: any, options?: any): string;
}
```

> [!TIP]
> All positional parameters passed in the query (e.g., `myFormat("A", "B")`) are available in `options.params` as an array (e.g., `["A", "B"]`).

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
