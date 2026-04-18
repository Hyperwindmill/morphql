import { describe, expect, it } from 'vitest';
import { runtimeFunctions } from '../runtime/functions.js';

describe('_sortBy runtime helper', () => {
  it('should sort objects by numeric key ascending', () => {
    const data = [{ id: 3 }, { id: 1 }, { id: 2 }];
    const result = runtimeFunctions._sortBy(data, (item) => item.id, false);
    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  it('should sort objects by numeric key descending', () => {
    const data = [{ id: 3 }, { id: 1 }, { id: 2 }];
    const result = runtimeFunctions._sortBy(data, (item) => item.id, true);
    expect(result).toEqual([{ id: 3 }, { id: 2 }, { id: 1 }]);
  });

  it('should sort objects by string key', () => {
    const data = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];
    const result = runtimeFunctions._sortBy(data, (item) => item.name, false);
    expect(result).toEqual([{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }]);
  });

  it('should handle nulls and undefined keys properly', () => {
    const data = [{ val: 10 }, { val: null }, { val: 5 }, { val: undefined }];
    
    const ascResult = runtimeFunctions._sortBy(data, (item) => item.val, false);
    // null/undefined should come first in ascending order
    expect(ascResult[0].val == null).toBe(true);
    expect(ascResult[1].val == null).toBe(true);
    expect(ascResult[2].val).toBe(5);
    expect(ascResult[3].val).toBe(10);

    const descResult = runtimeFunctions._sortBy(data, (item) => item.val, true);
    // null/undefined should come last in descending order
    expect(descResult[0].val).toBe(10);
    expect(descResult[1].val).toBe(5);
    expect(descResult[2].val == null).toBe(true);
    expect(descResult[3].val == null).toBe(true);
  });

  it('should return empty array for non-array input', () => {
    expect(runtimeFunctions._sortBy(null as any, () => 1, false)).toEqual([]);
    expect(runtimeFunctions._sortBy({} as any, () => 1, false)).toEqual([]);
  });

  it('should not mutate original array', () => {
    const data = [{ id: 2 }, { id: 1 }];
    const dataCopy = [...data];
    const result = runtimeFunctions._sortBy(data, (item) => item.id, false);
    expect(result).not.toBe(data);
    expect(data).toEqual(dataCopy); // original should be untouched
  });
});
