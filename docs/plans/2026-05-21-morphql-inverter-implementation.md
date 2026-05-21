# MorphQL Query Inversion Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Create a query inverter for MorphQL that parses a query, recursively reverses target/source formats and section hierarchies, automatically inverts 1-to-1 mappings, and generates helpful commented templates for non-invertible or complex structures.

**Architecture:** Create a `MorphInverter` class in `@morphql/core` extending Chevrotain's `BaseCstVisitor`. It reconstructs the original query syntax in reverse by traversing CST nodes. Add CLI integration via a new `morphql invert` subcommand.

**Tech Stack:** TypeScript, Chevrotain (CST Visitor), Commander.js (CLI), Vitest (Testing).

---

### Task 1: Core AST Inverter Implementation

**Files:**
- Create: `packages/core/src/core/inverter.ts`
- Modify: `packages/core/src/index.ts`
- Test: `packages/core/src/tests/inverter.spec.ts`

**Step 1: Write the failing test**

Create `packages/core/src/tests/inverter.spec.ts` with basic tests for header and simple mappings.
```typescript
import { describe, it, expect } from 'vitest';
import { invert } from '../index.js';

describe('MorphQL Inverter', () => {
  it('should invert simple 1-to-1 queries and header', () => {
    const query = `from json to xml
transform
  set id = orderId
  set name = firstName`;

    const expected = `from xml to json
transform
  set orderId = id
  set firstName = name`;

    expect(invert(query).trim()).toBe(expected.trim());
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run packages/core/src/tests/inverter.spec.ts`
Expected: FAIL (invert is not exported / file not found)

**Step 3: Write minimal implementation**

Create `packages/core/src/core/inverter.ts` with the basic visitor and `invert()` function as defined in the design.
Modify `packages/core/src/index.ts` to export it.

**Step 4: Run test to verify it passes**

Run: `npx vitest run packages/core/src/tests/inverter.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add packages/core/src/core/inverter.ts packages/core/src/index.ts packages/core/src/tests/inverter.spec.ts
git commit -m "feat: implement basic core MorphQL inverter and 1-to-1 mapping inversion"
```

---

### Task 2: Implement Recursive Section Mapping

**Files:**
- Modify: `packages/core/src/core/inverter.ts`
- Modify: `packages/core/src/tests/inverter.spec.ts`

**Step 1: Write the failing test**

Add tests for nested sections in `packages/core/src/tests/inverter.spec.ts`.
```typescript
  it('should invert nested sections recursively', () => {
    const query = `from json to xml
transform
  section multiple items(
    set sku = itemSku
  ) from orderItems`;

    const expected = `from xml to json
transform
  section multiple orderItems(
    set itemSku = sku
  ) from items`;

    expect(invert(query).trim()).toBe(expected.trim());
  });
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run packages/core/src/tests/inverter.spec.ts`
Expected: FAIL (section mapping not implemented or outputting incorrect structures)

**Step 3: Implement section mapping**

In `packages/core/src/core/inverter.ts`, implement `sectionRule(ctx)` to correctly swap structure name and `from` path and process internal actions.

**Step 4: Run test to verify it passes**

Run: `npx vitest run packages/core/src/tests/inverter.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add packages/core/src/core/inverter.ts packages/core/src/tests/inverter.spec.ts
git commit -m "feat: support recursive section mapping in inverter"
```

---

### Task 3: Implement Heuristics, Constants, Clone, Delete and If Rules

**Files:**
- Modify: `packages/core/src/core/inverter.ts`
- Modify: `packages/core/src/tests/inverter.spec.ts`

**Step 1: Write the failing test**

Add tests for clone, constants, concatenation heuristics, delete and conditionals in `packages/core/src/tests/inverter.spec.ts`.
```typescript
  it('should handle constants, clone, delete, conditions, and concat heuristics', () => {
    const query = `from json to xml
transform
  clone(a, b)
  delete c
  set status = "active"
  set fullName = firstName + " " + lastName
  if (flag) (
    set active = isAct
  )`;

    const inverted = invert(query);
    expect(inverted).toContain('clone(a, b)');
    expect(inverted).toContain("// set status = \"active\" (Constant - skipped in inverse)");
    expect(inverted).toContain("// TODO (Heuristic Inversion): 'fullName' is a concatenation.");
    expect(inverted).toContain("set isAct = active");
  });
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run packages/core/src/tests/inverter.spec.ts`
Expected: FAIL

**Step 3: Implement visitor rules**

Implement the rest of the AST visiting rules (`setRule` checks for concatenation and constants, `cloneRule`, `deleteRule`, `ifAction`, `modifyRule`, `defineRule`) in `packages/core/src/core/inverter.ts`.

**Step 4: Run test to verify it passes**

Run: `npx vitest run packages/core/src/tests/inverter.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add packages/core/src/core/inverter.ts packages/core/src/tests/inverter.spec.ts
git commit -m "feat: add support for constants, clone, delete, ifs, and concat heuristics"
```

---

### Task 4: CLI Integration

**Files:**
- Modify: `packages/cli/src/index.ts`
- Create: `packages/cli/src/tests/invert.spec.ts`

**Step 1: Write the E2E CLI test**

Create `packages/cli/src/tests/invert.spec.ts` that runs the CLI bin program via execa or shell and checks output.
```typescript
import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import * as path from 'path';

describe('CLI invert subcommand', () => {
  it('should run morphql invert command correctly', () => {
    const binPath = path.resolve(__dirname, '../../bin/morphql.js');
    const result = execSync(`node ${binPath} invert -q "from json to json transform set id = orderId"`).toString();
    expect(result).toContain('set orderId = id');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run packages/cli/src/tests/invert.spec.ts`
Expected: FAIL (invert command does not exist in CLI)

**Step 3: Implement CLI invert subcommand**

Add the command to `packages/cli/src/index.ts`. Make sure to rebuild dependencies first if needed.

**Step 4: Run test to verify it passes**

Run: `npx vitest run packages/cli/src/tests/invert.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add packages/cli/src/index.ts packages/cli/src/tests/invert.spec.ts
git commit -m "feat: add invert subcommand to CLI and integration tests"
```
