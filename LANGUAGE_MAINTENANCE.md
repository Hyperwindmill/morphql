# MorphQL Language Maintenance Guide (Updated)

## 🎯 Single Source of Truth: @morphql/language-definitions

**NEW:** All language definitions are now centralized in the `@morphql/language-definitions` package!

### Package Location

[`packages/language-definitions/`](./morphql/packages/language-definitions/)

---

## ✅ Simplified Workflow: Adding New Features

### 1. Update Language Definitions Package

**Files to edit:**

- **Keywords**: `packages/language-definitions/src/keywords.ts`
- **Functions**: `packages/language-definitions/src/functions.ts`
- **Operators**: `packages/language-definitions/src/operators.ts`

### 2. Update the Lexer (Core)

**File:** `packages/core/src/core/lexer.ts`

Add the token definition and update `allTokens` array.

### 3. Rebuild Language Definitions

```bash
cd packages/language-definitions
npm run build
```

### 4. Update Consumers

The VSCode extension and Monaco playground will automatically use the new definitions!

---

## 📋 Example: Adding a New Keyword

### Step 1: Add to Language Definitions

**File:** `packages/language-definitions/src/keywords.ts`

```typescript
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
```

### Step 2: Update Lexer

**File:** `packages/core/src/core/lexer.ts`

```typescript
export const Loop = createToken({
  name: "Loop",
  pattern: /loop/i,
  longer_alt: Identifier,
});

export const allTokens = [
  // ...
  Loop, // Add here
  // ...
];
```

### Step 3: Rebuild

```bash
cd packages/language-definitions
npm run build

cd ../core
npm run build
```

### Step 4: Done! ✅

The VSCode extension and playground will automatically pick up the new keyword on their next build.

---

## 📋 Example: Adding a New Function

### Step 1: Add to Language Definitions

**File:** `packages/language-definitions/src/functions.ts`

```typescript
export const FUNCTIONS: FunctionDef[] = [
  // ... existing functions ...
  {
    name: "trim",
    doc: {
      signature: "trim(str)",
      description: "Removes whitespace from both ends of a string.",
      parameters: [{ name: "str", description: "The string to trim" }],
      returns: "string",
      example: 'trim("  hello  ")  // "hello"',
    },
  },
];
```

### Step 2: Implement in Core

**File:** `packages/core/src/core/functions.ts`

```typescript
export const FUNCTIONS: Record<string, FunctionHandler> = {
  // ... existing functions ...
  trim: (str: string) => str.trim(),
};
```

### Step 3: Rebuild

```bash
cd packages/language-definitions
npm run build

cd ../core
npm run build
```

---

## 🔄 How It Works

### Before (Manual Sync Required)

```
Add keyword → Update lexer → Update TextMate grammar → Update Monaco config → Update hover docs → Update README
```

### After (Automatic Sync)

```
Add keyword → Update lexer → Rebuild language-definitions → Done!
                    ↓
            All consumers auto-update
```

### Consumers

1. **VSCode Extension**
   - Imports `@morphql/language-definitions`
   - Uses `generateHoverDocs()` for hover provider
   - Uses keyword/function lists for TextMate grammar generation

2. **Monaco Playground**
   - Imports `@morphql/language-definitions`
   - Uses `generateMonacoLanguageConfig()` for syntax highlighting
   - Uses hover docs for Monaco hover provider

3. **Documentation**
   - Can generate reference docs from the definitions
   - Always in sync with actual implementation

---

## 📁 File Structure

```
packages/language-definitions/
├── src/
│   ├── types.ts       # TypeScript interfaces
│   ├── keywords.ts    # ✏️ EDIT: Add keywords here
│   ├── functions.ts   # ✏️ EDIT: Add functions here
│   ├── operators.ts   # ✏️ EDIT: Add operators here
│   └── index.ts       # Exports + generators
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎯 Quick Reference

| Task             | Files to Edit                                                                 | Commands                                                                 |
| ---------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Add Keyword**  | 1. `language-definitions/src/keywords.ts`<br>2. `core/src/core/lexer.ts`      | `cd language-definitions && npm run build`<br>`cd core && npm run build` |
| **Add Function** | 1. `language-definitions/src/functions.ts`<br>2. `core/src/core/functions.ts` | Same as above                                                            |
| **Add Operator** | 1. `language-definitions/src/operators.ts`<br>2. `core/src/core/lexer.ts`     | Same as above                                                            |

---

## ✅ Benefits

✅ **Single source of truth** - Edit once, use everywhere  
✅ **Type-safe** - Full TypeScript support  
✅ **Auto-sync** - No more manual updates to multiple files  
✅ **Consistent** - Impossible to have mismatched definitions  
✅ **Documented** - Documentation lives with definitions  
✅ **Testable** - Can unit test the definitions themselves

---

## 🚨 Important Notes

1. **Always rebuild language-definitions first** before rebuilding consumers
2. **Lexer order matters** for operators (multi-char before single-char)
3. **Documentation is required** for all keywords and functions
4. **Test in all environments** after adding new features

---

## 📞 For Future LLMs

When maintaining this codebase:

1. ✅ **DO** edit `packages/language-definitions/src/` files
2. ✅ **DO** update the lexer in `packages/core/src/core/lexer.ts`
3. ✅ **DO** rebuild language-definitions package
4. ❌ **DON'T** manually edit TextMate grammars
5. ❌ **DON'T** manually edit Monaco configs
6. ❌ **DON'T** manually edit hover documentation

The language-definitions package is the **single source of truth**!

---

**Last Updated:** 2026-01-21  
**Maintainer:** AI Assistant  
**Package:** @morphql/language-definitions v0.1.0
