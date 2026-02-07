import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Source Access in Sections', () => {
  it('should access array items via source[index] in where clause', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple filtered(
          set val = source[1]
        ) from data where source[0] == "A"
    `);

    const result = engine({
      data: [
        ['A', 'Apple'],
        ['B', 'Banana'],
        ['A', 'Ape'],
      ],
    });

    expect(result.filtered).toHaveLength(2);
    expect(result.filtered[0].val).toBe('Apple');
    expect(result.filtered[1].val).toBe('Ape');
  });

  it('should access array items via source[index] in actions', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section item(
          set type = source[0]
          set name = source[1]
        ) from info
    `);

    const result = engine({
      info: ['User', 'Alice'],
    });

    expect(result.item.type).toBe('User');
    expect(result.item.name).toBe('Alice');
  });

  it('should handle composite indices source[0][0]', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section item(
          set id = source[0][0]
          set val = source[1]
        ) from info
    `);

    const result = engine({
      info: [['ID123', 'extra'], 'Shared'],
    });

    expect(result.item.id).toBe('ID123');
    expect(result.item.val).toBe('Shared');
  });
});
