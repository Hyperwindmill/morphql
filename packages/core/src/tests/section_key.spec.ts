import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Section Key (_key)', () => {
  it('should expose _key as iteration index in section multiple', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple items(
          set originalIndex = _key
          set value = source
        ) from data
    `);

    const result = engine({
      data: ['a', 'b', 'c'],
    });

    expect(result.items).toEqual([
      { originalIndex: 0, value: 'a' },
      { originalIndex: 1, value: 'b' },
      { originalIndex: 2, value: 'c' },
    ]);
  });

  it('should support _key in where clause', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple specificItems(
          set val = source
          set idx = _key
        ) from data where _key == 0 || _key == 2
    `);

    const result = engine({
      data: [10, 20, 30, 40, 50],
    });

    expect(result.specificItems).toHaveLength(2);
    expect(result.specificItems[0]).toEqual({ val: 10, idx: 0 });
    expect(result.specificItems[1]).toEqual({ val: 30, idx: 1 });
  });

  it('should support _key in single section with where', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section thirdItem(
          set val = source
          set originalIdx = _key
        ) from data where _key == 2
    `);

    const result = engine({
      data: ['first', 'second', 'third', 'fourth'],
    });

    expect(result.thirdItem).toEqual({ val: 'third', originalIdx: 2 });
  });

  it('should support _key in subquery sections', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple processed(
          from json to object
          transform
            set id = id
            set pos = _key
        ) from rawStrings
    `);

    const result = engine({
      rawStrings: ['{"id": "A"}', '{"id": "B"}', '{"id": "C"}'],
    });

    expect(result.processed).toEqual([
      { id: 'A', pos: 0 },
      { id: 'B', pos: 1 },
      { id: 'C', pos: 2 },
    ]);
  });

  it('should shadow _key in nested sections', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        section multiple groups(
          set groupKey = _key
          section multiple items(
            set itemIdx = _key
          ) from elements
        ) from rows
    `);

    const result = engine({
      rows: [{ elements: ['a1', 'a2'] }, { elements: ['b1'] }],
    });

    expect(result.groups).toHaveLength(2);
    expect(result.groups[0].groupKey).toBe(0);
    expect(result.groups[0].items).toEqual([{ itemIdx: 0 }, { itemIdx: 1 }]);
    expect(result.groups[1].groupKey).toBe(1);
    expect(result.groups[1].items).toEqual([{ itemIdx: 0 }]);
  });
});
