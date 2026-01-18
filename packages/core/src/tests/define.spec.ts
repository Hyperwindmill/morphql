import { describe, it, expect } from 'vitest';
import { compile } from '../index.js';

describe('Define action', async () => {
  it('should define a simple variable', async () => {
    const query = `
      from object to object
      transform
        define fullName = firstName + " " + lastName
        set greeting = "Hello, " + fullName
    `;
    const engine = await compile(query);
    const source = { firstName: 'John', lastName: 'Doe' };
    const result = engine(source);
    expect(result.greeting).toBe('Hello, John Doe');
  });

  it('should define a variable with arithmetic', async () => {
    const query = `
      from object to object
      transform
        define total = price * quantity
        set finalPrice = total - discount
    `;
    const engine = await compile(query);
    const source = { price: 100, quantity: 3, discount: 50 };
    const result = engine(source);
    expect(result.finalPrice).toBe(250);
  });

  it('should define a variable with function call', async () => {
    const query = `
      from object to object
      transform
        define shortSku = substring(sku, 0, 3)
        set code = shortSku + "-" + id
    `;
    const engine = await compile(query);
    const source = { sku: 'ABC12345', id: '999' };
    const result = engine(source);
    expect(result.code).toBe('ABC-999');
  });

  it('should define a variable with conditional expression', async () => {
    const query = `
      from object to object
      transform
        define discountRate = if(isPremium, 0.2, 0.1)
        set finalPrice = price * (1 - discountRate)
    `;
    const engine = await compile(query);
    const source1 = { price: 100, isPremium: true };
    const result1 = engine(source1);
    expect(result1.finalPrice).toBe(80);

    const source2 = { price: 100, isPremium: false };
    const result2 = engine(source2);
    expect(result2.finalPrice).toBe(90);
  });

  it('should support multiple define statements', async () => {
    const query = `
      from object to object
      transform
        define firstName = "John"
        define lastName = "Doe"
        define fullName = firstName + " " + lastName
        set name = fullName
    `;
    const engine = await compile(query);
    const source = {};
    const result = engine(source);
    expect(result.name).toBe('John Doe');
  });

  it('should combine define with clone action', async () => {
    const query = `
      from object to object
      transform
        define category = "Electronics"
        clone(id, name)
        set type = category
    `;
    const engine = await compile(query);
    const source = { id: '123', name: 'Laptop', price: 999 };
    const result = engine(source);
    expect(result.id).toBe('123');
    expect(result.name).toBe('Laptop');
    expect(result.type).toBe('Electronics');
    expect(result.price).toBeUndefined();
  });

  it('should combine define with delete action', async () => {
    const query = `
      from object to object
      transform
        define temp = password + "-backup"
        clone
        delete password
        set backup = temp
    `;
    const engine = await compile(query);
    const source = { username: 'john', password: 'secret123' };
    const result = engine(source);
    expect(result.username).toBe('john');
    expect(result.password).toBeUndefined();
    expect(result.backup).toBe('secret123-backup');
  });

  it('should use defined variables in if action blocks', async () => {
    const query = `
      from object to object
      transform
        define threshold = 100
        if (price > threshold) (
          set status = "expensive"
        ) else (
          set status = "affordable"
        )
    `;
    const engine = await compile(query);
    const source1 = { price: 150 };
    const result1 = engine(source1);
    expect(result1.status).toBe('expensive');

    const source2 = { price: 50 };
    const result2 = engine(source2);
    expect(result2.status).toBe('affordable');
  });

  it('should define variables using other defined variables', async () => {
    const query = `
      from object to object
      transform
        define a = 10
        define b = 20
        define c = a + b
        define d = c * 2
        set result = d
    `;
    const engine = await compile(query);
    const source = {};
    const result = engine(source);
    expect(result.result).toBe(60);
  });

  it('should support complex expressions in define', async () => {
    const query = `
      from object to object
      transform
        define isEligible = age >= 18 && hasLicense == true
        define discount = if(isEligible, price * 0.15, 0)
        set finalPrice = price - discount
    `;
    const engine = await compile(query);
    const source = { age: 25, hasLicense: true, price: 100 };
    const result = engine(source);
    expect(result.finalPrice).toBe(85);
  });
});
