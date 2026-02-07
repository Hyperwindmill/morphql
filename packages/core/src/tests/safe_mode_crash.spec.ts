import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Safe Mode Fault Tolerance', () => {
  it('should not crash when accessing missing array properties in safe mode', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set val = NAD[0][1]
    `);

    // NAD is missing
    const result = engine({});
    expect(result.val).toBeUndefined();
  });

  it('should not crash when using explicit source prefix in safe mode', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set val = source.missing.array[0]
    `);

    const result = engine({});
    expect(result.val).toBeUndefined();
  });

  it('should crash in unsafe mode when accessing missing properties', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform unsafe
        set val = missing.array[0]
    `);

    expect(() => engine({})).toThrow();
  });
});
