# MorphQL Query Inversion Design Document

This document outlines the design and proposed architecture for **MorphQL Inverter**, a static-analysis tool that generates an inverse MorphQL query from an existing one, using a recursive AST-visiting approach and heuristics for non-trivial mappings.

---

## 1. Overview & Objective

MorphQL compiles declarative queries to optimize high-performance data transformations. In bidirectional mapping environments (such as read/write APIs), developers frequently need to translate data in both directions:
1. **Direct mapping:** Reading internal DB records and shaping them into public API responses (`from DB to API`).
2. **Inverse mapping:** Taking incoming API payloads (POST/PUT) and shaping them back into the internal DB schema (`from API to DB`).

Writing the inverse mapping manually is tedious and error-prone. However, since transformations are often lossy or non-bijective, fully automatic runtime inversion is not mathematically possible for all cases.

### The Solution: Heuristic Query Generation
Instead of attempting complex runtime constraint solving, we introduce a static-analysis utility, `MorphInverter`. It:
- Swaps the overall target and source schemas.
- Recursively reverses section hierarchies.
- Automatically inverts 1-to-1 assignments and simple mappings.
- Identifies lossy or complex mappings and generates boilerplate comments (with `TODO` notices and suggested syntax) so the developer can complete them manually.

---

## 2. Core Architecture

The inverter will reside in a new module within the core package: `packages/core/src/core/inverter.ts`. It will leverage Chevrotain's Concrete Syntax Tree (CST) Visitor, similar to the existing compiler.

```
┌─────────────────┐      ┌───────────────┐      ┌────────────────┐
│  MorphQL Query  │ ───> │ parser.parse  │ ───> │  MorphParser   │
│    (String)     │      │   (Tokens)    │      │     (CST)      │
└─────────────────┘      └───────────────┘      └────────────────┘
                                                        │
                                                        ▼
                                                ┌────────────────┐
                                                │ MorphInverter  │
                                                │ (CST Visitor)  │
                                                └────────────────┘
                                                        │
                                                        ▼
                                                ┌────────────────┐
                                                │ Inverted Query │
                                                │  (MorphQL DSL) │
                                                └────────────────┘
```

### Public API

```typescript
// packages/core/src/index.ts
export { invert } from './core/inverter.js';
```

```typescript
// packages/core/src/core/inverter.ts
import { parser } from './parser.js';
import { lexer } from './lexer.js';

const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

export class MorphInverter extends (BaseCstVisitor as any) {
  // Visitor implementation to reconstruct MorphQL DSL string...
}

export function invert(queryString: string): string {
  const lexResult = lexer.tokenize(queryString);
  parser.input = lexResult.tokens;
  const cst = parser.query();
  
  if (parser.errors.length > 0) {
    throw new Error(`Parsing errors encountered: ${parser.errors.map(e => e.message).join(', ')}`);
  }

  const inverter = new MorphInverter();
  return inverter.visit(cst);
}
```

---

## 3. Recursive Inversion Strategies & Rules

The visitor reconstructs the MorphQL query string by translating and reversing each statement.

### 3.1. Query Header
Swaps the source and target formats.
```morphql
from formatA to formatB(options)
```
Inverts to:
```morphql
from formatB(options) to formatA
```

### 3.2. Nested Sections (`sectionRule`) - Recursive Mirroring
Since sections can be nested to an arbitrary depth, this rule is processed recursively:
1. **Structure Swap:** The target name of the original section becomes the path (`from`) in the inverted section. The original source path (`from`) becomes the name of the inverted section.
2. **Recursive Traversal:** The inverter invokes `visit` on all nested actions of the section.
3. **Optional Clauses:** Clauses like `where`, `orderby`, and `limit` are preserved but marked with an optional warning if they refer to source properties that have not been inverted.

*Example:*
```morphql
section multiple items(
  set sku = itemSku
) from orderItems
```
Inverts to:
```morphql
section multiple orderItems(
  set itemSku = sku
) from items
```

### 3.3. Assignments (`setRule`)
- **Direct 1-to-1 Mapping:** If the right-hand expression is a simple identifier, swap left and right sides.
  - `set targetId = sourceId` $\rightarrow$ `set sourceId = targetId`
- **Constant Mapping:** Constant assignments do not map to source fields, so they are commented out.
  - `set status = "active"` $\rightarrow$ `// set status = "active" (Constant - skipped in inverse)`
- **Complex Expressions:** If the expression contains operators, arithmetic, or function calls, comment out the rule and add a `TODO` comment with an estimated template.
  - `set price = number(unitPrice)` $\rightarrow$ `set unitPrice = text(price) // TODO: Verify inverted cast`

### 3.4. Modification Rules (`modifyRule`)
Since `modify` updates a property on the target, inverting it requires context. The inverter generates:
```morphql
// TODO: Check manual inversion for target modifications
// modify ...
```

### 3.5. Cloning (`cloneRule`)
- `clone()` inverts to `clone()` (deep copies target back to source).
- `clone(field1, field2)` inverts to `clone(field1, field2)`.

### 3.6. Deletions (`deleteRule`)
Since `delete` removes fields from the target object, its inverse means either reinstating the field or ignoring it.
- `delete password` $\rightarrow$ `// TODO: 'password' was deleted in target. Re-supply or handle manually.`

---

## 4. Heuristic Generators & Code Snippets

For complex transformations, the inverter provides contextual help in comments.

### String Concatenation Heuristic
If the inverter detects a string concatenation containing string literals, it suggests a `split` or `regex` fallback.
*Original:*
```morphql
set fullName = firstName + " " + lastName
```
*Generated Inverse:*
```morphql
// TODO (Heuristic Inversion): 'fullName' is a concatenation.
// Please refine this extraction logic:
// set firstName = split(fullName, " ")[0]
// set lastName = split(fullName, " ")[1]
```

### Unary/Binary Expressions
If arithmetic is used, the inverter attempts basic algebraic inversion if it is simple (e.g. `x = y * 1.2` $\rightarrow$ `y = x / 1.2`), otherwise it outputs the commented-out expression for user review.

---

## 5. CLI Command Integration

We will add a new command to `@morphql/cli`: `morphql invert`.

### Syntax
```bash
# Invert inline query and print to stdout
morphql invert -q "from json to json transform set id = orderId"

# Invert query file and output to a new file
morphql invert --from my-query.morphql --to my-query-inverse.morphql
```

### Inverted Output with Comments
The output file will contain beautiful, syntax-highlighted code matching the MorphQL dialect, with generated comments clearly demarcated:
```morphql
from json to json
transform
  set orderId = id
  
  // TODO (Heuristic Inversion): 'fullName' is a concatenation.
  // set firstName = split(fullName, " ")[0]
  // set lastName = split(fullName, " ")[1]
```

---

## 6. Verification Plan

### Automated Unit Tests
We will add a test suite `packages/core/src/tests/inverter.spec.ts` covering:
- Simple 1-to-1 queries.
- Deeply nested section queries (validating recursive structures).
- Clone rules and constants.
- Heuristic outputs for concatenations and casts.

### CLI E2E Tests
We will add tests in `packages/cli` verifying that the `invert` command correctly reads, parses, inverts, and writes the output query.
