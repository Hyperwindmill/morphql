import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Query-Centric Unsafe Mode', async () => {
  it('should use safe mode by default', async () => {
    const query = morphQL`
      from object to object
      transform
        set result = price / quantity
    `;
    const engine = await compile(query);
    console.log('=== SAFE MODE (default) ===');
    console.log(engine.code);

    // Should use optional chaining
    expect(engine.code).toContain('source?.price');
    expect(engine.code).toContain('source?.quantity');
  });

  it('should disable safety when unsafe keyword is used', async () => {
    const query = morphQL`
      from object to object
      transform unsafe
        set result = price / quantity
    `;
    const engine = await compile(query);
    console.log('\n=== UNSAFE MODE ===');
    console.log(engine.code);

    // Should NOT use optional chaining
    expect(engine.code).toContain('source.price');
    expect(engine.code).toContain('source.quantity');
    expect(engine.code).not.toContain('source?.price');
  });

  it('should work correctly in safe mode with null values', async () => {
    const query = morphQL`
      from object to object
      transform
        set result = price / quantity
    `;
    const engine = await compile(query);

    const result = engine({ price: 100, quantity: null });
    expect(result.result).toBe(Infinity); // 100 / undefined = Infinity
  });

  it('should work correctly in unsafe mode with valid values', async () => {
    const query = morphQL`
      from object to object
      transform unsafe
        set result = price / quantity
    `;
    const engine = await compile(query);

    const result = engine({ price: 100, quantity: 10 });
    expect(result.result).toBe(10);
  });
});
