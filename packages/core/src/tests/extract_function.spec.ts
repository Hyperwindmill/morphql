import { describe, it, expect } from 'vitest';
import { compile } from '../index';

describe('Extract Function', () => {
  it('should extract specific fields from an object', async () => {
    const query = `
      from object to object
      transform
        set result = extract(source, "name", "age")
    `;
    const engine = await compile(query);
    const output = await engine({ name: 'Alice', age: 30, city: 'Paris' });
    expect(output.result).toEqual({ name: 'Alice', age: 30 });
    expect(output.result.city).toBeUndefined();
  });

  it('should support field renaming with target:source syntax', async () => {
    const query = `
      from object to object
      transform
        set result = extract(source, "fullName:name", "years:age")
    `;
    const engine = await compile(query);
    const output = await engine({ name: 'Alice', age: 30 });
    expect(output.result).toEqual({ fullName: 'Alice', years: 30 });
  });

  it('should handle mixed simple and renamed fields', async () => {
    const query = `
      from object to object
      transform
        set result = extract(source, "name", "years:age")
    `;
    const engine = await compile(query);
    const output = await engine({ name: 'Alice', age: 30 });
    expect(output.result).toEqual({ name: 'Alice', years: 30 });
  });

  it('should return undefined for missing source fields', async () => {
    const query = `
      from object to object
      transform
        set result = extract(source, "missing", "mapped:alsoMissing")
    `;
    const engine = await compile(query);
    const output = await engine({ name: 'Alice' });
    expect(output.result).toEqual({ missing: undefined, mapped: undefined });
  });

  it('should support chaining with list() to create arrays', async () => {
    const query = `
      from object to object
      transform
        set result = list(
          extract(source, "id:id1", "val:val1"),
          extract(source, "id:id2", "val:val2")
        )
    `;
    const engine = await compile(query);
    const output = await engine({ id1: 'A', val1: 100, id2: 'B', val2: 200 });
    expect(output.result).toEqual([
      { id: 'A', val: 100 },
      { id: 'B', val: 200 },
    ]);
  });

  it('should handle null/undefined source gracefully', async () => {
    const query = `
      from object to object
      transform
        set result = extract(source.missingObj, "key")
    `;
    const engine = await compile(query);
    const output = await engine({ missingObj: null });
    expect(output.result).toEqual({});
  });

  it('should support nested paths in extraction specs', async () => {
    const query = `
      from object to object
      transform
        set result = extract(source, "city:user.address.city")
    `;
    const engine = await compile(query);
    const output = await engine({ user: { address: { city: 'London' } } });
    expect(output.result).toEqual({ city: 'London' });
  });

  it('should be safe by default when accessing nested paths', async () => {
    const query = `
      from object to object
      transform
        set result = extract(source, "city:user.address.city")
    `;
    const engine = await compile(query);
    const output = await engine({ user: {} }); // address is missing
    expect(output.result).toEqual({ city: undefined });
  });

  it('should crash in unsafe mode when accessing property of null/undefined', async () => {
    const query = `
      from object to object
      transform unsafe
        set result = extract(source, "city:user.address.city")
    `;
    const engine = await compile(query);
    // In unsafe mode, this should throw because user.address is missing (undefined)
    // and we try to access .city on it.
    expect(() => engine({ user: {} })).toThrow();
  });
});
