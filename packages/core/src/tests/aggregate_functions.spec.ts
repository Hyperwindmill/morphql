import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

// ── avg ─────────────────────────────────────────────────────────────────────

describe('avg()', () => {
  it('should return the average of a field', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = avg(items, value)
    `);
    expect(engine({ items: [{ value: 10 }, { value: 20 }, { value: 30 }] }).result).toBe(20);
  });

  it('should support an expression as value', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = avg(items, price * quantity)
    `);
    expect(
      engine({ items: [{ price: 10, quantity: 2 }, { price: 5, quantity: 4 }] }).result
    ).toBe(20); // (10*2 + 5*4) / 2 = (20 + 20) / 2 = 20
  });

  it('should skip null and undefined values in both sum and count', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = avg(items, value)
    `);
    // null is skipped entirely (not counted as 0) → avg = (10+30)/2 = 20
    expect(engine({ items: [{ value: 10 }, { value: null }, { value: 30 }] }).result).toBe(20);
  });

  it('should return 0 for empty array', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = avg(items, value)
    `);
    expect(engine({ items: [] }).result).toBe(0);
  });

  it('should return 0 for missing field', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = avg(items, value)
    `);
    expect(engine({}).result).toBe(0);
  });
});

// ── minof / maxof ────────────────────────────────────────────────────────────

describe('minof()', () => {
  it('should return the minimum value', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = minof(items, price)
    `);
    expect(engine({ items: [{ price: 30 }, { price: 5 }, { price: 20 }] }).result).toBe(5);
  });

  it('should support an expression', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = minof(items, price * qty)
    `);
    expect(
      engine({ items: [{ price: 10, qty: 3 }, { price: 2, qty: 5 }, { price: 8, qty: 2 }] }).result
    ).toBe(10); // min(30, 10, 16)
  });

  it('should return null for empty array', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = minof(items, price)
    `);
    expect(engine({ items: [] }).result).toBeNull();
  });

  it('should skip non-numeric values', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = minof(items, price)
    `);
    expect(
      engine({ items: [{ price: 'N/A' }, { price: 7 }, { price: null }] }).result
    ).toBe(7);
  });
});

describe('maxof()', () => {
  it('should return the maximum value', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = maxof(items, price)
    `);
    expect(engine({ items: [{ price: 30 }, { price: 5 }, { price: 20 }] }).result).toBe(30);
  });

  it('should return null for empty array', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = maxof(items, price)
    `);
    expect(engine({ items: [] }).result).toBeNull();
  });
});

// ── every / some ─────────────────────────────────────────────────────────────

describe('every()', () => {
  it('should return true when all items satisfy the condition', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = every(items, amount > 0)
    `);
    expect(engine({ items: [{ amount: 1 }, { amount: 5 }, { amount: 10 }] }).result).toBe(true);
  });

  it('should return false when at least one item fails the condition', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = every(items, amount > 0)
    `);
    expect(engine({ items: [{ amount: 1 }, { amount: 0 }, { amount: 10 }] }).result).toBe(false);
  });

  it('should return true for an empty array (vacuously true)', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = every(items, amount > 0)
    `);
    expect(engine({ items: [] }).result).toBe(true);
  });

  it('should work with string comparisons', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = every(orders, status == "paid")
    `);
    expect(
      engine({ orders: [{ status: 'paid' }, { status: 'paid' }] }).result
    ).toBe(true);
    expect(
      engine({ orders: [{ status: 'paid' }, { status: 'pending' }] }).result
    ).toBe(false);
  });
});

describe('some()', () => {
  it('should return true when at least one item satisfies the condition', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = some(items, amount > 100)
    `);
    expect(engine({ items: [{ amount: 50 }, { amount: 150 }, { amount: 30 }] }).result).toBe(true);
  });

  it('should return false when no items satisfy the condition', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = some(items, amount > 100)
    `);
    expect(engine({ items: [{ amount: 50 }, { amount: 30 }] }).result).toBe(false);
  });

  it('should return false for an empty array', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = some(items, amount > 0)
    `);
    expect(engine({ items: [] }).result).toBe(false);
  });

  it('should work in a where clause on groupby', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple withOverdue(
          set client = key
        ) from groupby(invoices, client) where some(items, overdue == true)
    `);
    const result = engine({
      invoices: [
        { client: 'A', overdue: false },
        { client: 'B', overdue: true },
        { client: 'A', overdue: true },
        { client: 'C', overdue: false },
      ],
    });
    // A and B have at least one overdue invoice; C does not
    expect(result.withOverdue.map((g: any) => g.client).sort()).toEqual(['A', 'B']);
  });
});

// ── distinct ─────────────────────────────────────────────────────────────────

describe('distinct()', () => {
  it('should return unique values in first-seen order', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = distinct(items, category)
    `);
    const result = engine({
      items: [
        { category: 'B' },
        { category: 'A' },
        { category: 'B' },
        { category: 'C' },
        { category: 'A' },
      ],
    });
    expect(result.result).toEqual(['B', 'A', 'C']);
  });

  it('should support an expression', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = distinct(items, uppercase(tag))
    `);
    const result = engine({
      items: [{ tag: 'foo' }, { tag: 'BAR' }, { tag: 'FOO' }, { tag: 'bar' }],
    });
    expect(result.result).toEqual(['FOO', 'BAR']);
  });

  it('should return empty array for missing field', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = distinct(items, category)
    `);
    expect(engine({}).result).toEqual([]);
  });
});
