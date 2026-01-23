import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Modify Action', async () => {
  it('should modify a property by reading from target', async () => {
    const query = morphQL`
      from object to object
      transform
        set total = price * quantity
        modify total = total * 1.1
    `;
    const engine = await compile(query);
    const source = { price: 100, quantity: 2 };
    const result = engine(source);

    // Using toBeCloseTo because of floating point math
    expect(result.total).toBeCloseTo(220);
  });

  it('should handle string concatenation on target', async () => {
    const query = morphQL`
      from object to object
      transform
        set msg = "Hello"
        modify msg = msg + " World"
    `;
    const engine = await compile(query);
    const result = engine({});
    expect(result.msg).toBe('Hello World');
  });

  it('should work inside sections', async () => {
    const query = morphQL`
      from object to object
      transform
        section meta (
            set value = 10
            modify value = value + 5
        )
    `;
    const engine = await compile(query);
    const result = engine({ meta: {} });
    expect(result.meta.value).toBe(15);
  });

  it('should work with complex expressions', async () => {
    const query = morphQL`
      from object to object
      transform
        set a = 10
        set b = 20
        modify a = (a + b) * 2
    `;
    const engine = await compile(query);
    const result = engine({});
    expect(result.a).toBe(60);
  });

  it('should fail if referring to source when modify is used for a field that only exists in target', async () => {
    // This test ensures that 'modify' actually looks at target.
    // If it looked at source, 'targetOnly' would be undefined.
    const query = morphQL`
      from object to object
      transform
        set targetOnly = 10
        modify targetOnly = targetOnly + 5
    `;
    const engine = await compile(query);
    const result = engine({ targetOnly: 100 }); // Source has 100
    // If it used source, it would be 100 + 5 = 105.
    // If it uses target, it's 10 + 5 = 15.
    expect(result.targetOnly).toBe(15);
  });

  it('should work inside conditional blocks', async () => {
    const query = morphQL`
      from object to object
      transform
        set value = 10
        if (applyBonus) (
            modify value = value * 2
        )
    `;
    const engine = await compile(query);
    expect(engine({ applyBonus: true }).value).toBe(20);
    expect(engine({ applyBonus: false }).value).toBe(10);
  });
});
