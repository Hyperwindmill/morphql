# @morphql/language-definitions

**Single source of truth** for MQL language definitions across all platforms.

## Purpose

This package centralizes all MQL language definitions (keywords, functions, operators, documentation) in TypeScript, eliminating duplication across:

- VSCode extension
- Monaco Editor (playground)
- Documentation

## Installation

```bash
npm install @morphql/language-definitions
```

## Usage

### Get Language Data

```typescript
import {
  KEYWORDS,
  FUNCTIONS,
  OPERATORS,
  getKeywordNames,
  getFunctionNames,
  getOperatorSymbols,
} from "@morphql/language-definitions";

// Get all keyword names
const keywords = getKeywordNames();
// ['from', 'to', 'transform', 'set', ...]

// Get all function names
const functions = getFunctionNames();
// ['substring', 'split', 'replace', ...]

// Get documentation for a keyword
import { getKeywordDoc } from "@morphql/language-definitions";
const doc = getKeywordDoc("set");
// { signature: 'set <target> = <expression>', description: '...', ... }
```

### Generate VSCode TextMate Grammar

```typescript
import { generateTextMateKeywordsPattern } from "@morphql/language-definitions";

const keywordsPattern = generateTextMateKeywordsPattern();
// Use in mql.tmLanguage.json
```

### Generate Monaco Language Config

```typescript
import { generateMonacoLanguageConfig } from "@morphql/language-definitions";

const monacoConfig = generateMonacoLanguageConfig();
monaco.languages.register({ id: "mql" });
monaco.languages.setMonarchTokensProvider("mql", monacoConfig);
```

### Generate Hover Documentation

```typescript
import { generateHoverDocs } from "@morphql/language-definitions";

const { keywordDocs, functionDocs } = generateHoverDocs();
// Use in VSCode HoverProvider or Monaco HoverProvider
```

## Adding New Language Features

### 1. Add to This Package

Edit the appropriate file:

- **Keywords**: `src/keywords.ts`
- **Functions**: `src/functions.ts`
- **Operators**: `src/operators.ts`

### 2. Update the Lexer

Update `@morphql/core/src/core/lexer.ts` with the new token.

### 3. Rebuild

```bash
npm run build
```

### 4. Update Consumers

The VSCode extension and playground will automatically use the new definitions on their next build.

## Structure

```
src/
├── types.ts       # TypeScript interfaces
├── keywords.ts    # Keyword definitions + docs
├── functions.ts   # Function definitions + docs
├── operators.ts   # Operator definitions
└── index.ts       # Exports + generators
```

## Benefits

✅ **Single source of truth** - Edit once, use everywhere  
✅ **Type-safe** - Full TypeScript support  
✅ **Auto-generated** - Configs generated from definitions  
✅ **Consistent** - No more sync issues between platforms  
✅ **Documented** - All definitions include documentation

## Example: Adding a New Keyword

```typescript
// 1. Edit src/keywords.ts
export const KEYWORDS: KeywordDef[] = [
  // ... existing keywords ...
  {
    name: "loop",
    category: "control",
    doc: {
      signature: "loop <count> ( <actions> )",
      description: "Repeats actions a specified number of times.",
      parameters: [
        { name: "count", description: "Number of iterations" },
        { name: "actions", description: "Actions to repeat" },
      ],
      example: "loop 5 (\n  set item = value\n)",
    },
  },
];

// 2. Update lexer in @morphql/core
// 3. Rebuild this package: npm run build
// 4. VSCode and Monaco will pick it up automatically!
```

## License

MIT
