# MQL Language Definition Maintenance Guide

## Overview

This guide helps maintain consistency across all MQL language definitions when adding new features (keywords, functions, operators, etc.).

## 🎯 Single Source of Truth: The Lexer

**Primary Reference:** [`packages/core/src/core/lexer.ts`](file:///mnt/a341655b-7af5-403e-a435-792e0e283f08/Dev/query-morph/packages/core/src/core/lexer.ts)

The lexer is the **authoritative source** for all MQL tokens. When adding new language features, **always start here**.

---

## 📋 Checklist: Adding a New Keyword

When adding a new keyword (e.g., `loop`, `break`, `continue`):

### 1. Update the Lexer ✅ REQUIRED

**File:** `packages/core/src/core/lexer.ts`

```typescript
// Add token definition
export const Loop = createToken({
  name: "Loop",
  pattern: /loop/i,
  longer_alt: Identifier,
});

// Add to allTokens array (order matters!)
export const allTokens = [
  WhiteSpace,
  LineComment,
  BlockComment,
  // ... existing keywords ...
  Loop, // ← Add here
  // ... rest of tokens ...
];
```

### 2. Update VSCode Extension

**Files to update:**

#### a) TextMate Grammar

**File:** `packages/vscode-extension/syntaxes/mql.tmLanguage.json`

```json
{
  "repository": {
    "keywords": {
      "patterns": [
        {
          "name": "keyword.control.mql",
          "match": "\\b(from|to|transform|if|else|loop)\\b"
          //                                        ^^^^ Add here
        }
      ]
    }
  }
}
```

#### b) Hover Documentation (if applicable)

**File:** `packages/vscode-extension/src/hoverProvider.ts`

```typescript
const KEYWORD_DOCS: Record<string, DocEntry> = {
  // ... existing docs ...
  loop: {
    signature: "loop <count> ( <actions> )",
    description: "Repeats actions a specified number of times.",
    parameters: [
      { name: "count", description: "Number of iterations" },
      { name: "actions", description: "Actions to repeat" },
    ],
    example: "loop 5 (\n  set item = value\n)",
  },
};
```

### 3. Update Monaco Editor (Playground)

**File:** `packages/playground/src/mqlLanguage.ts` (if exists)

```typescript
export const mqlLanguage = {
  keywords: [
    "from",
    "to",
    "transform",
    "set",
    "section",
    "multiple",
    "clone",
    "delete",
    "define",
    "if",
    "else",
    "loop", // ← Add here
  ],
  // ...
};
```

### 4. Update Documentation

**Files:**

- `README.md` - Add to MQL Reference section
- `overview.md` - Add to Quick Reference
- `packages/vscode-extension/README.md` - Add to Syntax Support section

---

## 📋 Checklist: Adding a New Function

When adding a new function (e.g., `trim`, `join`, `filter`):

### 1. Update the Function Registry ✅ REQUIRED

**File:** `packages/core/src/core/functions.ts`

```typescript
export const FUNCTIONS: Record<string, FunctionHandler> = {
  // ... existing functions ...
  trim: (str: string) => str.trim(),
};
```

### 2. Update VSCode Extension

#### a) TextMate Grammar

**File:** `packages/vscode-extension/syntaxes/mql.tmLanguage.json`

```json
{
  "repository": {
    "functions": {
      "patterns": [
        {
          "name": "entity.name.function.mql",
          "match": "\\b(substring|split|replace|text|number|uppercase|lowercase|xmlnode|extractnumber|if|trim)(?=\\s*\\()"
          //                                                                                              ^^^^ Add here
        }
      ]
    }
  }
}
```

#### b) Hover Documentation

**File:** `packages/vscode-extension/src/hoverProvider.ts`

```typescript
const FUNCTION_DOCS: Record<string, DocEntry> = {
  // ... existing docs ...
  trim: {
    signature: "trim(str)",
    description: "Removes whitespace from both ends of a string.",
    parameters: [{ name: "str", description: "The string to trim" }],
    returns: "string",
    example: 'trim("  hello  ")  // "hello"',
  },
};
```

### 3. Update Monaco Editor

**File:** `packages/playground/src/mqlLanguage.ts`

```typescript
export const mqlLanguage = {
  // ...
  builtinFunctions: [
    "substring",
    "split",
    "replace",
    "text",
    "number",
    "uppercase",
    "lowercase",
    "xmlnode",
    "extractnumber",
    "if",
    "trim", // ← Add here
  ],
  // ...
};
```

### 4. Update Documentation

Add function to:

- `README.md` - Functions table
- `overview.md` - Functions list
- `packages/vscode-extension/README.md` - Built-in Functions section

---

## 📋 Checklist: Adding a New Operator

When adding a new operator (e.g., `%` for modulo, `**` for power):

### 1. Update the Lexer ✅ REQUIRED

**File:** `packages/core/src/core/lexer.ts`

```typescript
// Add token (multi-char operators BEFORE single-char!)
export const Power = createToken({ name: "Power", pattern: /\*\*/ });
export const Modulo = createToken({ name: "Modulo", pattern: /%/ });

// Add to allTokens in correct order
export const allTokens = [
  // ...
  // Multi-character operators
  EqualsEqualsEquals,
  EqualsEquals,
  Power, // ← Add multi-char BEFORE single-char
  // ...
  // Single-character operators
  Times,
  Modulo, // ← Add single-char here
  // ...
];
```

### 2. Update VSCode Extension

**File:** `packages/vscode-extension/syntaxes/mql.tmLanguage.json`

```json
{
  "repository": {
    "operators": {
      "patterns": [
        {
          "name": "keyword.operator.arithmetic.mql",
          "match": "(\\+|-|\\*\\*|\\*|/|%)"
          //                ^^^^      ^ Add here (escape special chars!)
        }
      ]
    }
  }
}
```

### 3. Update Monaco Editor

**File:** `packages/playground/src/mqlLanguage.ts`

```typescript
export const mqlLanguage = {
  operators: [
    "===",
    "!==",
    "==",
    "!=",
    "<=",
    ">=",
    "<",
    ">",
    "&&",
    "||",
    "!",
    "+",
    "-",
    "**",
    "*",
    "/",
    "%", // ← Add here
    "=",
  ],
  // ...
};
```

### 4. Update Documentation

Add to operators list in all READMEs.

---

## 📋 Checklist: Adding Comment Support (Already Done!)

Comments are already supported:

- ✅ Lexer: `LineComment` and `BlockComment` tokens
- ✅ VSCode: TextMate grammar with `comment.line.double-slash.mql` and `comment.block.mql`
- ✅ Language config: `lineComment: "//"` and `blockComment: ["/*", "*/"]`

---

## 🔄 Automated Sync Strategy (Future Improvement)

To reduce manual work, consider:

### Option 1: Generate from Lexer

Create a script that reads `lexer.ts` and generates:

- TextMate grammar JSON
- Monaco language definition
- Hover documentation templates

### Option 2: Shared Configuration

Extract all language definitions to a single JSON file:

```json
{
  "keywords": [
    { "name": "from", "category": "control", "doc": "..." },
    { "name": "to", "category": "control", "doc": "..." }
  ],
  "functions": [{ "name": "substring", "signature": "...", "doc": "..." }],
  "operators": [{ "symbol": "===", "category": "comparison" }]
}
```

Then generate all artifacts from this single source.

---

## 🎯 Quick Reference: Files to Update

| Change Type  | Core           | VSCode                                                 | Monaco           | Docs        |
| ------------ | -------------- | ------------------------------------------------------ | ---------------- | ----------- |
| **Keyword**  | `lexer.ts`     | `mql.tmLanguage.json`<br>`hoverProvider.ts`            | `mqlLanguage.ts` | All READMEs |
| **Function** | `functions.ts` | `mql.tmLanguage.json`<br>`hoverProvider.ts`            | `mqlLanguage.ts` | All READMEs |
| **Operator** | `lexer.ts`     | `mql.tmLanguage.json`                                  | `mqlLanguage.ts` | All READMEs |
| **Comment**  | `lexer.ts`     | `mql.tmLanguage.json`<br>`language-configuration.json` | `mqlLanguage.ts` | -           |

---

## 🧪 Testing Checklist

After making changes:

1. **Core Tests**

   ```bash
   cd packages/core
   npm test
   ```

2. **VSCode Extension**
   - Open `packages/vscode-extension` in VSCode
   - Press F5 to launch Extension Development Host
   - Test syntax highlighting, hover, and diagnostics

3. **Playground**
   ```bash
   cd packages/playground
   npm run dev
   ```

   - Verify syntax highlighting
   - Test with examples

---

## 📝 Example: Complete Workflow

**Scenario:** Adding `foreach` keyword

### Step 1: Lexer

```typescript
// packages/core/src/core/lexer.ts
export const Foreach = createToken({
  name: "Foreach",
  pattern: /foreach/i,
  longer_alt: Identifier,
});

export const allTokens = [
  // ...
  Foreach, // Add after other keywords
  // ...
];
```

### Step 2: Parser (if needed)

```typescript
// packages/core/src/core/parser.ts
// Add grammar rule for foreach
```

### Step 3: VSCode

```json
// packages/vscode-extension/syntaxes/mql.tmLanguage.json
{
  "match": "\\b(from|to|transform|if|else|foreach)\\b"
}
```

```typescript
// packages/vscode-extension/src/hoverProvider.ts
foreach: {
  signature: 'foreach <item> in <array> ( <actions> )',
  description: 'Iterates over array elements.',
  // ...
}
```

### Step 4: Monaco

```typescript
// packages/playground/src/mqlLanguage.ts
keywords: ['from', 'to', 'transform', 'foreach', ...]
```

### Step 5: Documentation

Update all README files with the new keyword.

### Step 6: Test

- Run core tests
- Test in VSCode extension
- Test in playground

---

## 🚨 Common Pitfalls

1. **Operator Order in Lexer**: Multi-char operators MUST come before single-char
   - ❌ Wrong: `Times` before `Power`
   - ✅ Right: `Power` (`**`) before `Times` (`*`)

2. **Regex Escaping**: Special chars need escaping in TextMate grammar
   - ❌ Wrong: `"match": "**"`
   - ✅ Right: `"match": "\\*\\*"`

3. **Case Sensitivity**: MQL keywords are case-insensitive
   - Lexer: Use `/pattern/i` flag
   - TextMate: Use `\\b(keyword)\\b` (case-insensitive by default)

4. **Hover Docs**: Keep examples concise and practical

---

## 📞 Need Help?

If you're an LLM maintaining this codebase:

1. Always check `lexer.ts` first
2. Follow the checklists above
3. Test in all three environments (core, VSCode, playground)
4. Update documentation last

---

**Last Updated:** 2026-01-21  
**Maintainer:** AI Assistant
