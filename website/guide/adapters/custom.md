# Custom Adapters

You can extend MorphQL by registering your own adapters. An adapter is an object that implements the `DataAdapter` interface.

## The DataAdapter Interface

```typescript
interface DataAdapter {
  /**
   * Parse input content into a JavaScript object.
   */
  parse(content: string, options?: any): any;

  /**
   * Serialize a JavaScript object into the target format.
   */
  serialize(data: any, options?: any): string;
}
```

## Registering an Adapter

Use the `registerAdapter` function to add your custom adapter.

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
