# Adapters Overview

Adapters are responsible for parsing input data and serializing the transformed output. MorphQL comes with built-in support for multiple formats, and it allows you to register custom ones.

## Built-in Adapters

| Adapter       | Name        | Description                                   |
| :------------ | :---------- | :-------------------------------------------- |
| **JSON**      | `json`      | Native JSON parsing and serialization.        |
| **XML**       | `xml`       | Fast XML parsing and serialization.           |
| **CSV**       | `csv`       | CSV parsing and serialization via PapaParse.  |
| **Plaintext** | `plaintext` | Splits input into raw lines.                  |
| **EDIFACT**   | `edifact`   | UN/EDIFACT message parsing and serialization. |
| **Object**    | `object`    | Working with in-memory JS objects.            |

## Passing Parameters

You can pass parameters to adapters directly in the `from` and `to` clauses:

### Positional Parameters

Forwarded as an array in `options.params`.

```morphql
from myFormat("param1", 42) to json
```

### Named Parameters

Passed using the `key=value` syntax.

```morphql
from xml(ignoreAttributes=true) to object
```

For detailed options and behavior of each individual adapter, see the respective pages in this section.
