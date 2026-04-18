# MorphQL Language Extension: Section OrderBy and Limit

## Overview
This design document outlines the implementation of `orderby` and `limit` clauses to the `section` syntax in the `@morphql/core` engine. This enhancement allows native sorting and pagination of arrays, filling a functional gap compared to SQL-like queries, and serving as a foundational feature for future wrappers like `@morphql/store`.

## Architecture & Components

### 1. Lexer and Parser (`lexer.ts`, `parser.ts`)
We will introduce four new tokens to the Chevrotain lexer:
- `OrderBy` (`orderby`)
- `Asc` (`asc`)
- `Desc` (`desc`)
- `Limit` (`limit`)

The grammar of `sectionRule` will be extended to accept the new optional clauses immediately following the optional `where` clause:
```
section [multiple] name(...) [from expr] [where expr] [orderby expr [asc|desc]] [limit expr]
```

### 2. AST Definition (`parse-types.ts`, `ast-visitor.ts`)
The `SectionNode` type will be updated to include the parsed expressions for sorting and limiting:
- `orderBy?: string`
- `orderDesc?: boolean`
- `limit?: string`

The CST Visitor will extract these clauses and attach them to the resulting AST nodes during traversal.

### 3. Runtime Compilation (`compiler.ts`)
MorphQL compiles queries into pure JavaScript strings. To support sorting efficiently without impacting runtime performance, we will utilize the **Schwartzian Transform**.

Instead of injecting inline sorting logic, we will rely on a new runtime helper function `_sortBy` injected into the environment. 
The generated code chain for a section will look like:
```javascript
let _code = sourceArray;

// 1. Where
if (hasWhere) {
    _code = `${_code}.filter(...)`;
}

// 2. OrderBy
if (hasOrderBy) {
    _code = `_sortBy(${_code}, (item, index) => { /* eval context */ return ${orderByCondition}; }, ${isDesc})`;
}

// 3. Limit
if (hasLimit) {
    _code = `${_code}.slice(0, ${limitCondition})`;
}
```

### 4. Runtime Helper
A new `_sortBy` utility function will be provided to the generated function scope (similar to `_safeSource` and aggregate functions). It maps the array to compute the sort key exactly once per element, sorts the wrapper objects, and maps back to the original items.

## Single vs Multiple Sections
When `orderby` or `limit` are applied to a single section (i.e. without the `multiple` keyword):
- Currently, `where` uses `.find()` to get the first match.
- With `orderby`, the compilation will extract all elements, sort them, and select the 0-th element (`[0]`), returning a single object representing the first ordered result.

## Performance Considerations
The use of the Schwartzian Transform guarantees $O(N)$ evaluation of the MorphQL order expression, preventing catastrophic $O(N \log N)$ complexity if standard array `.sort()` were used with inline evaluations. Limit operations using `.slice()` are natively optimized.
