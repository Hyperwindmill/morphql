import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('sum()', () => {
  it('should sum a field across an array', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set total = sum(orders, amount)
    `);

    const result = engine({ orders: [{ amount: 10 }, { amount: 25 }, { amount: 5 }] });
    expect(result.total).toBe(40);
  });

  it('should support an expression as value', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set total = sum(items, price * quantity)
    `);

    const result = engine({
      items: [
        { price: 10, quantity: 3 },
        { price: 5, quantity: 2 },
      ],
    });
    expect(result.total).toBe(40); // 30 + 10
  });

  it('should treat null and undefined values as 0', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set total = sum(items, amount)
    `);

    const result = engine({
      items: [{ amount: 10 }, { amount: null }, { amount: undefined }, { amount: 5 }],
    });
    expect(result.total).toBe(15);
  });

  it('should return 0 for an empty array', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set total = sum(items, amount)
    `);

    expect(engine({ items: [] }).total).toBe(0);
  });

  it('should return 0 when the source field is missing', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set total = sum(items, amount)
    `);

    expect(engine({}).total).toBe(0);
  });

  it('should combine with groupby to produce per-group totals', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple byCategory(
          set category = key
          set total = sum(items, price)
        ) from groupby(products, category)
    `);

    const result = engine({
      products: [
        { category: 'A', price: 10 },
        { category: 'B', price: 20 },
        { category: 'A', price: 30 },
      ],
    });

    expect(result.byCategory).toHaveLength(2);
    const a = result.byCategory.find((g: any) => g.category === 'A');
    const b = result.byCategory.find((g: any) => g.category === 'B');
    expect(a.total).toBe(40);
    expect(b.total).toBe(20);
  });
});
