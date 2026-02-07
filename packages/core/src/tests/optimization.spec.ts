import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Compiler Optimization', () => {
  it('should evaluate transpose only once in section from', async () => {
    // We can verify this by inspecting the generated code
    const query = morphQL`
      from object to object
      transform
        section multiple items(
          set val = source
        ) from transpose(_source, "names")
    `;

    const engine = await compile(query);

    // Check that we have the optimization variable
    expect(engine.code).toContain('const _sectionSource =');

    // Count occurrences of transpose call in the code
    const matches = engine.code.match(/env\.functions\.transpose/g);
    expect(matches?.length).toBe(1);

    // Verify it still works
    const result = engine({ names: ['Alice', 'Bob'] });
    expect(result.items).toEqual([{ val: { names: 'Alice' } }, { val: { names: 'Bob' } }]);
  });

  it('should avoid redeclaration of _sectionSource when multiple sections are used', async () => {
    const query = morphQL`
      from object to object
      transform
        section multiple items1(
          set val = source
        ) from transpose(_source, "names")

        section multiple items2(
          set val = source
        ) from transpose(_source, "ages")
    `;

    // This should not throw 'SyntaxError: Identifier "_sectionSource" has already been declared'
    const engine = await compile(query);

    expect(engine.code).toContain('const _sectionSource =');

    // Verify results
    const result = engine({ names: ['Alice'], ages: [25] });
    expect(result.items1).toEqual([{ val: { names: 'Alice' } }]);
    expect(result.items2).toEqual([{ val: { ages: 25 } }]);
  });
});
