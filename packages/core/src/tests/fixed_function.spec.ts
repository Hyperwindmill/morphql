import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('fixed() function', async () => {
  it('should format to 2 decimal places by default', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = fixed(value)
    `);
    expect(engine({ value: 9.99 }).result).toBe('9.99');
    expect(engine({ value: 1 }).result).toBe('1.00');
    expect(engine({ value: 1.5 }).result).toBe('1.50');
  });

  it('should format to a specified number of decimal places', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set r0 = fixed(value, 0)
        set r1 = fixed(value, 1)
        set r3 = fixed(value, 3)
    `);
    const result = engine({ value: 3.14159 });
    expect(result.r0).toBe('3');
    expect(result.r1).toBe('3.1');
    expect(result.r3).toBe('3.142');
  });

  it('should use half-away-from-zero rounding (.5 rounds up)', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set r = fixed(value, 0)
    `);
    expect(engine({ value: 0.5 }).r).toBe('1');
    expect(engine({ value: 1.5 }).r).toBe('2');
    expect(engine({ value: 2.5 }).r).toBe('3');
    expect(engine({ value: 3.5 }).r).toBe('4');
  });

  it('should handle negative numbers with half-away-from-zero rounding', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set r = fixed(value, 0)
    `);
    expect(engine({ value: -0.5 }).r).toBe('-1');
    expect(engine({ value: -1.5 }).r).toBe('-2');
    expect(engine({ value: -2.5 }).r).toBe('-3');
  });

  it('should pad trailing zeros', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = fixed(value, 4)
    `);
    expect(engine({ value: 1.5 }).result).toBe('1.5000');
    expect(engine({ value: 42 }).result).toBe('42.0000');
  });

  it('should work with expressions as arguments', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = fixed(price * quantity, 2)
    `);
    expect(engine({ price: 9.99, quantity: 3 }).result).toBe('29.97');
  });

  it('should work with 0 decimal places', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = fixed(value, 0)
    `);
    expect(engine({ value: 4.4 }).result).toBe('4');
    expect(engine({ value: 4.6 }).result).toBe('5');
  });

  it('should handle string number inputs', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set result = fixed(value, 2)
    `);
    expect(engine({ value: '3.14159' }).result).toBe('3.14');
  });
});
