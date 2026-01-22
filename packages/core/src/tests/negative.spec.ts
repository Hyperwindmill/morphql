import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Negative numbers and unary minus', async () => {
  it('should support negative numeric literals in function arguments', async () => {
    const query = morphQL`
      from object to object
      transform
        set last5 = substring(sku, -5)
    `;
    const engine = await compile(query);
    const source = { sku: 'ABC12345' };
    const result = engine(source);
    expect(result.last5).toBe('12345');
  });

  it('should support unary minus with variables', async () => {
    const query = morphQL`
      from object to object
      transform
        set invBalance = -balance
    `;
    const engine = await compile(query);
    const source = { balance: 100 };
    const result = engine(source);
    expect(result.invBalance).toBe(-100);
  });

  it('should support mixed unary and binary operators', async () => {
    const query = morphQL`
      from object to object
      transform
        set result = a - -b
    `;
    const engine = await compile(query);
    const source = { a: 10, b: 5 };
    const result = engine(source);
    expect(result.result).toBe(15);
  });

  it('should support substring with negative start and length', async () => {
    const query = morphQL`
      from object to object
      transform
        set mid = substring(sku, -5, 3)
    `;
    const engine = await compile(query);
    const source = { sku: 'ABC12345' };
    const result = engine(source);
    // last 5 are "12345", from -5 with length 3 is "123"
    expect(result.mid).toBe('123');
  });
});
