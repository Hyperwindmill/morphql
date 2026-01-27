import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Generated Code Inspection', async () => {
  it('should show generated code for simple transformation', async () => {
    const query = morphQL`
      from object to object
      transform
        set greeting = "Hello " + name
        set age = number(ageStr)
    `;
    const engine = await compile(query);
    console.log('=== SIMPLE TRANSFORMATION ===');
    console.log(engine.code);
    expect(engine.code).toBeTruthy();
  });

  it('should show generated code with error-prone operations', async () => {
    const query = morphQL`
      from object to object
      transform
        set result = price / quantity
        set extracted = extractnumber(text)
    `;
    const engine = await compile(query);
    console.log('\n=== ERROR-PRONE OPERATIONS ===');
    console.log(engine.code);
    expect(engine.code).toBeTruthy();
  });

  it('should show generated code with sections and return', async () => {
    const query = morphQL`
      from object to object
      transform
        section multiple items(
          set sku = productCode
          set total = price * qty
        ) from products
        return target
    `;
    const engine = await compile(query);
    console.log('\n=== SECTIONS + RETURN ===');
    console.log(engine.code);
    expect(engine.code).toBeTruthy();
  });
});
