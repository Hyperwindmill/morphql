<p align="center">
  <img src="https://raw.githubusercontent.com/Hyperwindmill/morphql/main/morphql.png" alt="MorphQL" width="200" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@morphql/language-definitions"><img src="https://img.shields.io/npm/v/@morphql/language-definitions?label=%40morphql%2Flanguage-definitions" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
</p>

# @morphql/language-definitions

The **single source of truth** for MorphQL language definitions (keywords, functions, operators) across all platforms. This package ensures consistency between the engine, IDE extensions, and documentation.

## Purpose

This shared package centralizes the MorphQL grammar for reuse in:

- **VSCode Extension**: TextMate grammar and hover providers.
- **Monaco Editor (Playground)**: Language configuration and Monarch tokens.
- **Documentation**: Automatic generation of function and keyword references.
- **Type Safety**: TypeScript interfaces for language features.

## Installation

```bash
npm install @morphql/language-definitions
```

## Basic Usage

```typescript
import {
  KEYWORDS,
  FUNCTIONS,
  getKeywordNames,
  getFunctionNames,
} from "@morphql/language-definitions";

// Get all keyword names for a lexer
const keywords = getKeywordNames();

// Get documentation for hover providers
import { getKeywordDoc } from "@morphql/language-definitions";
const doc = getKeywordDoc("set");
// { signature: "set <target> = <expression>", description: "..." }
```

## Maintenance

To add a new language feature (keyword, function, or operator), you should:

1.  Update the appropriate file in `src/` (e.g., `src/functions.ts`).
2.  Run `npm run build`.
3.  Changes will propagate to the VS Code extension and Playground on their next build.

## Learn More

- 👉 **[Official Documentation](https://hyperwindmill.github.io/morphql/)**
- 🏠 **[Main Repository](https://github.com/Hyperwindmill/morphql)**

## License

MIT
