# @morphql/core

A high-performance, isomorphic Query-to-Code engine. It provides the **Morph Query Language** (MQL) to transform structural data (JSON, XML, or Objects) by compiling queries into specialized, pure JavaScript functions.

## Key Features

- 🚀 **Performance**: Compiles DSL to native JS for maximum execution speed.
- 🌐 **Isomorphic**: Runs seamlessly in Node.js and the Browser.
- 🧩 **Format Agnostic**: Input and output can be JSON, XML, or raw Objects.
- ➗ **Expressions**: Support for arithmetic, string concatenation, and unary minus.
- 🔀 **Conditional Logic**: `if` function with comparison and logical operators.
- 🔄 **Structural Mapping**: Easy handling of nested objects and arrays (`multiple`).

## Installation

```bash
npm install @morphql/core
```

## Usage

```typescript
import { compile } from '@morphql/core';

const query = `
  from json to xml
  transform
    set fullName = firstName + " " + lastName
`;

const engine = await compile(query);
const result = engine({ firstName: 'John', lastName: 'Doe' });
// <root><fullName>John Doe</fullName></root>
```

For full documentation of the Morph Query Language, see the [main repository README](https://github.com/Hyperwindmill/query-morph).

## License

MIT
