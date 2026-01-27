import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Explicit Context Detection', async () => {
  it('should prepend source context for bare identifiers in set', async () => {
    const query = morphQL`
      from object to object
      transform
        set result = price
    `;
    const engine = await compile(query);
    const result = engine({ price: 100 });
    expect(result.result).toBe(100);
  });

  it('should not double-prepend when using explicit source prefix', async () => {
    const query = morphQL`
      from object to object
      transform
        set result = source.price
    `;
    const engine = await compile(query);
    const result = engine({ price: 100 });
    expect(result.result).toBe(100);
  });

  it('should allow explicit target access in set', async () => {
    const query = morphQL`
      from object to object
      transform
        set first = value
        set second = target.first
    `;
    const engine = await compile(query);
    const result = engine({ value: 42 });
    expect(result.first).toBe(42);
    expect(result.second).toBe(42);
  });

  it('should use target context by default in return', async () => {
    const query = morphQL`
      from object to object
      transform
        set greeting = "Hello"
        return greeting
    `;
    const engine = await compile(query);
    const result = engine({});
    expect(result).toBe('Hello');
  });

  it('should allow explicit source access in return', async () => {
    const query = morphQL`
      from object to object
      transform
        set temp = "ignored"
        return source.original
    `;
    const engine = await compile(query);
    const result = engine({ original: 'value' });
    expect(result).toBe('value');
  });

  it('should allow explicit target access in return', async () => {
    const query = morphQL`
      from object to object
      transform
        set computed = "result"
        return target.computed
    `;
    const engine = await compile(query);
    const result = engine({});
    expect(result).toBe('result');
  });

  it('should work with modify using target context', async () => {
    const query = morphQL`
      from object to object
      transform
        set value = num
        modify value = value + 10
    `;
    const engine = await compile(query);
    const result = engine({ num: 5 });
    expect(result.value).toBe(15);
  });

  it('should allow explicit target in modify', async () => {
    const query = morphQL`
      from object to object
      transform
        set value = num
        modify value = target.value * 2
    `;
    const engine = await compile(query);
    const result = engine({ num: 5 });
    expect(result.value).toBe(10);
  });

  it('should handle complex expressions with mixed contexts', async () => {
    const query = morphQL`
      from object to object
      transform
        set base = price
        set markup = source.price * 0.1
        set total = target.base + target.markup
    `;
    const engine = await compile(query);
    const result = engine({ price: 100 });
    expect(result.base).toBe(100);
    expect(result.markup).toBe(10);
    expect(result.total).toBe(110);
  });
});
