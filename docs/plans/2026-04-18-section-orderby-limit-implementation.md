# Section OrderBy and Limit Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Implement native `orderby` and `limit` clauses for `section` and `section multiple` in MorphQL, allowing robust array sorting and pagination.

**Architecture:** Extend the Chevrotain lexer/parser to support new keywords, map them in the CST/AST visitor, create a `_sortBy` runtime helper implementing the Schwartzian Transform for O(N) key evaluation, and compile the AST nodes to `_sortBy(...)` and `.slice(...)` calls.

**Tech Stack:** TypeScript, Chevrotain (Parser/Lexer), Vitest (Testing)

---

### Task 1: Update Lexer and Parser Grammar

**Files:**
- Modify: `packages/core/src/core/lexer.ts`
- Modify: `packages/core/src/core/parser.ts`

**Step 1: Write the failing test**

Create `packages/core/src/tests/orderby_limit_parse.spec.ts`:
```typescript
import { describe, expect, it } from 'vitest';
import { parse } from '../core/index';

describe('OrderBy and Limit parsing', () => {
  it('should parse orderby and limit successfully without crashing', () => {
    const query = `
      from object to object
      transform
        section multiple items(
          set id = id
        ) from items where active == true orderby score desc limit 10
    `;
    const ast = parse(query);
    expect(ast).toBeDefined();
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npx vitest run packages/core/src/tests/orderby_limit_parse.spec.ts`
Expected: FAIL with parsing errors (unexpected token 'orderby')

**Step 3: Write minimal implementation**
In `lexer.ts`, define and export tokens: `OrderBy` (`/orderby/i`), `Asc` (`/asc/i`), `Desc` (`/desc/i`), `Limit` (`/limit/i`). Remember to register them in the `allTokens` array.

In `parser.ts`, inject the options inside `sectionRule`, right after the `where` option:
```typescript
this.OPTION2(() => {
  this.CONSUME(t.OrderBy, { LABEL: 'orderByClause' });
  this.SUBRULE2(this.expression, { LABEL: 'orderByExpr' });
  this.OPTION3(() => {
    this.OR([
      { ALT: () => this.CONSUME(t.Asc, { LABEL: 'orderDirAsc' }) },
      { ALT: () => this.CONSUME(t.Desc, { LABEL: 'orderDirDesc' }) }
    ]);
  });
});
this.OPTION4(() => {
  this.CONSUME(t.Limit, { LABEL: 'limitClause' });
  this.SUBRULE3(this.expression, { LABEL: 'limitExpr' });
});
```

**Step 4: Run test to verify it passes**
Run: `npx vitest run packages/core/src/tests/orderby_limit_parse.spec.ts`
Expected: PASS

**Step 5: Commit**
Run: `git add packages/core/src/core/lexer.ts packages/core/src/core/parser.ts packages/core/src/tests/orderby_limit_parse.spec.ts && git commit -m "feat(core): add lexer and parser support for orderby and limit"`

---

### Task 2: AST Mapping

**Files:**
- Modify: `packages/core/src/core/parse-types.ts`
- Modify: `packages/core/src/core/ast-visitor.ts`

**Step 1: Write the failing test**
Update `packages/core/src/tests/orderby_limit_parse.spec.ts`:
```typescript
  it('should map orderby and limit properties to AST', () => {
    const query = `
      from object to object
      transform
        section multiple items(
          set id = id
        ) from items orderby score desc limit 10
    `;
    const ast = parse(query);
    const section = ast.transform![0] as any;
    expect(section.orderBy).toBe('score');
    expect(section.orderDesc).toBe(true);
    expect(section.limit).toBe('10');
  });
```

**Step 2: Run test to verify it fails**
Run: `npx vitest run packages/core/src/tests/orderby_limit_parse.spec.ts`
Expected: FAIL (AST node doesn't have the properties)

**Step 3: Write minimal implementation**
In `parse-types.ts`, add `orderBy?: string; orderDesc?: boolean; limit?: string;` to `SectionNode`.
In `ast-visitor.ts` inside `sectionRule(ctx: any)`, extract `orderByExpr` and `limitExpr`, recursively visit them via `this.visit()`, and check if `orderDirDesc` exists to set `orderDesc: true`. Add these fields to the returned AST node.

**Step 4: Run test to verify it passes**
Run: `npx vitest run packages/core/src/tests/orderby_limit_parse.spec.ts`
Expected: PASS

**Step 5: Commit**
Run: `git add packages/core/src/core/parse-types.ts packages/core/src/core/ast-visitor.ts packages/core/src/tests/orderby_limit_parse.spec.ts && git commit -m "feat(core): map orderby and limit from CST to AST"`

---

### Task 3: Implement Runtime Helper

**Files:**
- Modify: `packages/core/src/runtime/functions.ts` (or `helpers.ts` where internal engine functions are exported)
- Create: `packages/core/src/tests/sortby_helper.spec.ts`

**Step 1: Write the failing test**
```typescript
import { describe, expect, it } from 'vitest';
import { _sortBy } from '../runtime/functions'; // Adjust import based on actual file

describe('_sortBy runtime helper', () => {
  it('should sort array using a key extractor', () => {
    const arr = [{val: 'b', rank: 2}, {val: 'a', rank: 1}];
    const sorted = _sortBy(arr, (item) => item.rank, false);
    expect(sorted[0].val).toBe('a');
  });
  
  it('should sort descending', () => {
    const arr = [{val: 'a', rank: 1}, {val: 'b', rank: 2}];
    const sorted = _sortBy(arr, (item) => item.rank, true);
    expect(sorted[0].val).toBe('b');
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npx vitest run packages/core/src/tests/sortby_helper.spec.ts`
Expected: FAIL (`_sortBy` is not defined)

**Step 3: Write minimal implementation**
In `packages/core/src/runtime/functions.ts`, add:
```typescript
export function _sortBy(array: any[], keyExtractorFn: (item: any, index: number) => any, isDesc: boolean): any[] {
  if (!Array.isArray(array)) return array;
  
  const wrapped = array.map((item, index) => ({
    _val: item,
    _key: keyExtractorFn(item, index)
  }));
  
  wrapped.sort((a, b) => {
    const keyA = a._key;
    const keyB = b._key;
    if (keyA === keyB) return 0;
    const cmp = keyA > keyB ? 1 : -1;
    return isDesc ? -cmp : cmp;
  });
  
  return wrapped.map(w => w._val);
}
```
*Note: Make sure this helper is exported and attached to the runtime context generated in `compiler.ts` (usually where `_safeSource` is provided).*

**Step 4: Run test to verify it passes**
Run: `npx vitest run packages/core/src/tests/sortby_helper.spec.ts`
Expected: PASS

**Step 5: Commit**
Run: `git add packages/core/src/runtime/functions.ts packages/core/src/tests/sortby_helper.spec.ts && git commit -m "feat(core): add _sortBy runtime helper"`

---

### Task 4: Compile OrderBy and Limit

**Files:**
- Modify: `packages/core/src/core/compiler.ts`
- Create: `packages/core/src/tests/orderby_limit_compile.spec.ts`

**Step 1: Write the failing test**
Create `packages/core/src/tests/orderby_limit_compile.spec.ts`:
```typescript
import { describe, expect, it } from 'vitest';
import { compile, morphQL } from '../core/index';

describe('OrderBy and Limit compilation', () => {
  it('should order items and slice them', async () => {
    const query = morphQL\`
      from object to object
      transform
        section multiple items(
          set v = val
        ) from list orderby rank desc limit 2
    \`;
    const fn = await compile(query);
    const result = fn({
      list: [
        {val: 'a', rank: 1},
        {val: 'c', rank: 3},
        {val: 'b', rank: 2}
      ]
    });
    
    expect(result.items).toHaveLength(2);
    expect(result.items[0].v).toBe('c');
    expect(result.items[1].v).toBe('b');
  });
});
```

**Step 2: Run test to verify it fails**
Run: `npx vitest run packages/core/src/tests/orderby_limit_compile.spec.ts`
Expected: FAIL (results won't be ordered or sliced)

**Step 3: Write minimal implementation**
In `compiler.ts`, inside the logic that handles sections (around `hasWhere` checks):
1. Extract `orderByCondition` using `this.visit(ctx.orderBy)`.
2. Extract `limitCondition` using `this.visit(ctx.limit)`.
3. Wrap the intermediate array variable (the one that comes after `from` and `.filter` if `where` is present) with `_sortBy` if `orderBy` is defined:
   ```javascript
   if (hasOrderBy) {
       const isDesc = ctx.orderDesc ? 'true' : 'false';
       _filtered = \`_sortBy(\${_filtered}, (item, index) => { const source = \${ctx.unsafe ? 'item' : '_safeSource(item)'}; const _key = index; return \${orderByCondition}; }, \${isDesc})\`;
   }
   ```
4. Add `.slice(0, ${limitCondition})` if `limit` is defined:
   ```javascript
   if (hasLimit) {
       _filtered = \`\${_filtered}.slice(0, \${limitCondition})\`;
   }
   ```
*Ensure `_sortBy` is added to the closure header in `compiler.ts` alongside other runtime functions if necessary.*

**Step 4: Run test to verify it passes**
Run: `npx vitest run packages/core/src/tests/orderby_limit_compile.spec.ts`
Expected: PASS

**Step 5: Commit**
Run: `git add packages/core/src/core/compiler.ts packages/core/src/tests/orderby_limit_compile.spec.ts && git commit -m "feat(core): compile orderby and limit clauses in sections"`
