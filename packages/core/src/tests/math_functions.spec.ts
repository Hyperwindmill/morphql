import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Math functions', async () => {
  describe('floor()', async () => {
    it('should round down positive decimals', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = floor(value)
      `);
      expect(engine({ value: 4.9 }).result).toBe(4);
      expect(engine({ value: 4.1 }).result).toBe(4);
      expect(engine({ value: 4.0 }).result).toBe(4);
    });

    it('should round down negative decimals', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = floor(value)
      `);
      expect(engine({ value: -4.1 }).result).toBe(-5);
    });

    it('should work in expressions', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = floor(price * 1.1)
      `);
      expect(engine({ price: 9.99 }).result).toBe(10); // floor(10.989) = 10
    });
  });

  describe('ceil()', async () => {
    it('should round up positive decimals', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = ceil(value)
      `);
      expect(engine({ value: 4.1 }).result).toBe(5);
      expect(engine({ value: 4.9 }).result).toBe(5);
      expect(engine({ value: 4.0 }).result).toBe(4);
    });

    it('should round up negative decimals', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = ceil(value)
      `);
      expect(engine({ value: -4.9 }).result).toBe(-4);
    });
  });

  describe('round()', async () => {
    it('should round to nearest integer', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = round(value)
      `);
      expect(engine({ value: 4.4 }).result).toBe(4);
      expect(engine({ value: 4.5 }).result).toBe(5);
      expect(engine({ value: 4.9 }).result).toBe(5);
    });

    it('should be useful for price rounding', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set total = round(price * quantity)
      `);
      expect(engine({ price: 9.99, quantity: 3 }).total).toBe(30); // round(29.97) = 30
    });
  });

  describe('abs()', async () => {
    it('should return absolute value of negative numbers', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = abs(value)
      `);
      expect(engine({ value: -42 }).result).toBe(42);
      expect(engine({ value: 42 }).result).toBe(42);
      expect(engine({ value: 0 }).result).toBe(0);
    });

    it('should work with expressions', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set diff = abs(a - b)
      `);
      expect(engine({ a: 3, b: 7 }).diff).toBe(4);
      expect(engine({ a: 7, b: 3 }).diff).toBe(4);
    });
  });

  describe('min()', async () => {
    it('should return the smallest of two values', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = min(a, b)
      `);
      expect(engine({ a: 3, b: 7 }).result).toBe(3);
      expect(engine({ a: 7, b: 3 }).result).toBe(3);
    });

    it('should work with three or more arguments', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = min(a, b, c)
      `);
      expect(engine({ a: 5, b: 2, c: 8 }).result).toBe(2);
    });

    it('should work with literal values', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set clamped = min(value, 100)
      `);
      expect(engine({ value: 150 }).clamped).toBe(100);
      expect(engine({ value: 50 }).clamped).toBe(50);
    });
  });

  describe('max()', async () => {
    it('should return the largest of two values', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = max(a, b)
      `);
      expect(engine({ a: 3, b: 7 }).result).toBe(7);
      expect(engine({ a: 7, b: 3 }).result).toBe(7);
    });

    it('should work with three or more arguments', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = max(a, b, c)
      `);
      expect(engine({ a: 5, b: 2, c: 8 }).result).toBe(8);
    });

    it('should be useful for clamping to a minimum', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set discount = max(0, value)
      `);
      expect(engine({ value: -10 }).discount).toBe(0);
      expect(engine({ value: 5 }).discount).toBe(5);
    });
  });
});
