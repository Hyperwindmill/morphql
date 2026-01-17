import { describe, it, expect } from 'vitest';
import { compile } from './index.js';

describe('Functions in expressions', () => {
  it('should support substring with 3 arguments', () => {
    const query = `
      from source as object
      to return as object
      transform
        set short = substring(sku, 0, 3)
    `;
    const engine = compile(query);
    const source = { sku: 'ABC12345' };
    const result = engine(source);
    expect(result.short).toBe('ABC');
  });

  it('should support substring with 2 arguments', () => {
    const query = `
      from source as object
      to return as object
      transform
        set rest = substring(sku, 3)
    `;
    const engine = compile(query);
    const source = { sku: 'ABC12345' };
    const result = engine(source);
    expect(result.rest).toBe('12345');
  });

  it('should support nested expressions in substring arguments', () => {
    const query = `
      from source as object
      to return as object
      transform
        set result = substring(sku, 0, a + b)
    `;
    const engine = compile(query);
    const source = { sku: 'ABC12345', a: 1, b: 2 };
    const result = engine(source);
    expect(result.result).toBe('ABC');
  });

  it('should support expressions as the string argument', () => {
    const query = `
      from source as object
      to return as object
      transform
        set result = substring(prefix + sku, 0, 5)
    `;
    const engine = compile(query);
    const source = { prefix: 'SKU-', sku: '12345' };
    const result = engine(source);
    expect(result.result).toBe('SKU-1');
  });

  it('should throw error for unknown function', () => {
    const query = `
      from source as object
      to return as object
      transform
        set result = unknownFunc(sku)
    `;
    expect(() => compile(query)).toThrow('Unknown function: unknownFunc');
  });
});
