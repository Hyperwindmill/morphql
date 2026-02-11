import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Transpose Function (Variadic)', () => {
  it('should transpose parallel arrays from a source object', async () => {
    const query = morphQL`
      from object to object
      transform
        section multiple joined(
          set name = names
          set age = ages
        ) from transpose(_source, "names", "ages")
    `;
    const engine = await compile(query);
    const result = engine({
      names: ['Alice', 'Bob'],
      ages: [25, 30],
    });
    expect(result.joined).toEqual([
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
    ]);
  });

  it('should handle unbalanced arrays by filling with undefined', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple joined(
          set name = names
          set age = ages
        ) from transpose(_source, "names", "ages")
    `);

    const result = engine({
      names: ['Alice', 'Bob', 'Charlie'],
      ages: [25, 30],
    });

    expect(result.joined).toEqual([
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 30 },
      { name: 'Charlie', age: undefined },
    ]);
  });

  it('should handle scalar values as single-item arrays', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple joined(
          set name = names
          set group = groupName
        ) from transpose(_source, "names", "groupName")
    `);

    const result = engine({
      names: ['Alice', 'Bob'],
      groupName: 'Admins',
    });

    expect(result.joined).toEqual([
      { name: 'Alice', group: 'Admins' },
      { name: 'Bob', group: undefined },
    ]);
  });
});
