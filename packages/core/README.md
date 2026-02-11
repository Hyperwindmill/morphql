<p align="center">
  <img src="https://raw.githubusercontent.com/Hyperwindmill/morphql/main/morphql.png" alt="MorphQL" width="200" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@morphql/core"><img src="https://img.shields.io/npm/v/@morphql/core?label=%40morphql%2Fcore" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
</p>

# @morphql/core

A high-performance, isomorphic Query-to-Code engine. It provides the **Morph Query Language** (MorphQL) to transform structural data (JSON, XML, or Objects) by compiling queries into specialized, pure JavaScript functions.

## Key Features

- 🚀 **Performance**: Compiles DSL to native JS for maximum execution speed.
- 🌐 **Isomorphic**: Runs seamlessly in Node.js and the Browser.
- 🧩 **Format Agnostic**: Built-in support for JSON, XML, CSV, EDIFACT, Plaintext, and raw Objects.
- ➗ **Expressions**: Support for arithmetic, string concatenation, and unary minus.
- 🔀 **Conditional Logic**: `if` function with comparison and logical operators.
- 🔄 **Structural Mapping**: Easy handling of nested objects and arrays (`multiple`).

## Installation

```bash
npm install @morphql/core
```

## Usage

```typescript
import { compile, morphQL } from '@morphql/core';

const query = morphQL`
  from object to json
  transform
    set fullName = firstName + " " + lastName
    set isAdult = age >= 18
`;

const engine = await compile(query);
const result = engine({ firstName: 'John', lastName: 'Doe', age: 30 });
// → '{"fullName":"John Doe","isAdult":true}'
```

## Learn More

- 👉 **[Official Documentation](https://hyperwindmill.github.io/morphql/)**
- 🏠 **[Main Repository](https://github.com/Hyperwindmill/morphql)**

## License

MIT
