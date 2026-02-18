import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Modulo operator (%)', async () => {
  it('should compute basic remainder', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set remainder = value % 3
    `);
    expect(engine({ value: 10 }).remainder).toBe(1);
    expect(engine({ value: 9 }).remainder).toBe(0);
    expect(engine({ value: 7 }).remainder).toBe(1);
  });

  it('should determine even/odd', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set isEven = (n % 2) == 0
    `);
    expect(engine({ n: 4 }).isEven).toBe(true);
    expect(engine({ n: 7 }).isEven).toBe(false);
  });

  it('should work with _key for alternating rows', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple rows(
          set index = _key
          set isEven = (_key % 2) == 0
        ) from items
    `);
    const result = engine({ items: ['a', 'b', 'c', 'd'] });
    expect(result.rows[0].isEven).toBe(true);
    expect(result.rows[1].isEven).toBe(false);
    expect(result.rows[2].isEven).toBe(true);
    expect(result.rows[3].isEven).toBe(false);
  });

  it('should compose with other arithmetic operators', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = (a + b) % c
    `);
    expect(engine({ a: 7, b: 5, c: 4 }).result).toBe(0); // (7+5) % 4 = 0
    expect(engine({ a: 7, b: 5, c: 3 }).result).toBe(0); // (7+5) % 3 = 0
    expect(engine({ a: 7, b: 6, c: 4 }).result).toBe(1); // (7+6) % 4 = 1
  });

  it('should have same precedence as * and /', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = a + b % c
    `);
    // b % c evaluated first (same precedence group as *), then + a
    expect(engine({ a: 10, b: 7, c: 3 }).result).toBe(11); // 10 + (7 % 3) = 10 + 1 = 11
  });
});
