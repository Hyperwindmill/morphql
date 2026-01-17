# query-morph

A high-performance, isomorphic Query-to-Code engine. It provides a DSL to transform structural data (JSON, XML, or Objects) by compiling queries into specialized, pure JavaScript functions.

## Key Features

- 🚀 **Performance**: Compiles DSL to native JS for maximum execution speed.
- 🌐 **Isomorphic**: Runs seamlessly in Node.js and the Browser.
- 🧩 **Format Agnostic**: Input and output can be JSON, XML, or raw Objects.
- ➗ **Expressions**: Support for arithmetic, string concatenation, and unary minus.
- 🛠️ **Modular Functions**: Extensible function registry (e.g., `substring`).
- 🔄 **Structural Mapping**: Easy handling of nested objects and arrays (`multiple`).
- 🎨 **Playground**: Real-time editor to test and visualize generated code.

## Installation

```bash
npm install query-morph
```

## Usage Example

```typescript
import { compile } from 'query-morph';

const query = `
  from source as object
  to return as json
  transform
    set fullName = firstName + " " + lastName
    set shortSku = substring(sku, 0, 3)
    set total = (price * amount) - discount
    section header(
      set id = orderId
    )
`;

const engine = compile(query);

const source = {
  firstName: 'John',
  lastName: 'Doe',
  sku: 'ABC12345',
  price: 100,
  amount: 2,
  discount: 10,
  orderId: 'ORD-99',
};

const result = engine(source);
console.log(result);
// Output: JSON string with fullName, shortSku, total, and header object
```

## DSL Snippets

### Arithmetic & Concatenation

`set total = price + tax`
`set label = "Item: " + name`

### Functions & Negative Indices

`set lastChars = substring(sku, -5)`

### Array Mapping

`section multiple items( set sku = itemSku )`

## Development

### Playground

Launch the interactive playground to test your queries in real-time:

```bash
npm run playground
```

### Build & Test

```bash
npm run build
npm run test
```

## License

MIT
