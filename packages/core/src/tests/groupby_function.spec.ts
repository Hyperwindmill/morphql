import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('groupby()', () => {
  it('should group items by a field and expose key/items in section scope', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple byCategory(
          set category = key
          set count = items.length
        ) from groupby(products, category)
    `);

    const result = engine({
      products: [
        { category: 'electronics', name: 'Phone' },
        { category: 'clothing', name: 'Shirt' },
        { category: 'electronics', name: 'Laptop' },
      ],
    });

    expect(result.byCategory).toEqual([
      { category: 'electronics', count: 2 },
      { category: 'clothing', count: 1 },
    ]);
  });

  it('should preserve insertion order of first-seen keys', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple grouped(
          set label = key
        ) from groupby(rows, status)
    `);

    const result = engine({
      rows: [
        { status: 'pending' },
        { status: 'done' },
        { status: 'pending' },
        { status: 'error' },
        { status: 'done' },
      ],
    });

    expect(result.grouped.map((g: any) => g.label)).toEqual(['pending', 'done', 'error']);
  });

  it('should allow nesting a section multiple from items', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple byStatus(
          set status = key
          section multiple orders(
            set id = id
            set amount = amount
          ) from items
        ) from groupby(orders, status)
    `);

    const result = engine({
      orders: [
        { id: 1, status: 'paid', amount: 100 },
        { id: 2, status: 'pending', amount: 50 },
        { id: 3, status: 'paid', amount: 200 },
      ],
    });

    expect(result.byStatus).toHaveLength(2);

    const paid = result.byStatus.find((g: any) => g.status === 'paid');
    expect(paid.orders).toEqual([
      { id: 1, amount: 100 },
      { id: 3, amount: 200 },
    ]);

    const pending = result.byStatus.find((g: any) => g.status === 'pending');
    expect(pending.orders).toEqual([{ id: 2, amount: 50 }]);
  });

  it('should support a computed key expression', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple byType(
          set type = key
          set count = items.length
        ) from groupby(products, uppercase(category))
    `);

    const result = engine({
      products: [
        { category: 'food', name: 'Apple' },
        { category: 'Food', name: 'Banana' },
        { category: 'FOOD', name: 'Cherry' },
      ],
    });

    // All three map to "FOOD" after uppercase
    expect(result.byType).toHaveLength(1);
    expect(result.byType[0]).toEqual({ type: 'FOOD', count: 3 });
  });

  it('should return an empty array when the source array is empty', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple grouped(
          set k = key
        ) from groupby(items, type)
    `);

    const result = engine({ items: [] });
    expect(result.grouped).toEqual([]);
  });

  it('should return an empty array when the source field is missing', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple grouped(
          set k = key
        ) from groupby(items, type)
    `);

    const result = engine({});
    expect(result.grouped).toEqual([]);
  });

  it('should handle null/undefined key values as distinct groups via String()', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple grouped(
          set k = key
        ) from groupby(items, category)
    `);

    const result = engine({
      items: [
        { category: null, name: 'A' },
        { category: undefined, name: 'B' },
        { category: null, name: 'C' },
      ],
    });

    // String(null) = "null", String(undefined) = "undefined" — two distinct groups
    expect(result.grouped).toHaveLength(2);
    const keys = result.grouped.map((g: any) => g.k);
    expect(keys).toContain(null);      // A and C land here
    expect(keys).toContain(undefined); // B lands here
  });

  it('should work with _source root access inside the nested section', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple byCategory(
          set category = key
          set total = items.length
          set currency = _source.currency
        ) from groupby(products, category)
    `);

    const result = engine({
      currency: 'EUR',
      products: [
        { category: 'A', name: 'x' },
        { category: 'B', name: 'y' },
        { category: 'A', name: 'z' },
      ],
    });

    expect(result.byCategory[0]).toMatchObject({ category: 'A', total: 2, currency: 'EUR' });
    expect(result.byCategory[1]).toMatchObject({ category: 'B', total: 1, currency: 'EUR' });
  });

  it('should work with where clause on the outer section multiple', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple bigGroups(
          set category = key
          set count = items.length
        ) from groupby(products, category) where items.length > 1
    `);

    const result = engine({
      products: [
        { category: 'A', name: 'x' },
        { category: 'B', name: 'y' },
        { category: 'A', name: 'z' },
      ],
    });

    // Only group 'A' has more than 1 item
    expect(result.bigGroups).toHaveLength(1);
    expect(result.bigGroups[0].category).toBe('A');
  });
});
