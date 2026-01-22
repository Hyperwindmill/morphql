import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Expressions in set directive', async () => {
  it('should support simple addition', async () => {
    const query = morphQL`
      from object to object
      transform
        set total = price + tax
    `;
    const engine = await compile(query);
    const source = { price: 100, tax: 22 };
    const result = engine(source);
    expect(result.total).toBe(122);
  });

  it('should support string concatenation', async () => {
    const query = morphQL`
      from object to object
      transform
        set fullName = firstName + " " + lastName
    `;
    const engine = await compile(query);
    const source = { firstName: 'John', lastName: 'Doe' };
    const result = engine(source);
    expect(result.fullName).toBe('John Doe');
  });

  it('should support mixed arithmetic with precedence', async () => {
    const query = morphQL`
      from object to object
      transform
        set result = a + b * c
    `;
    const engine = await compile(query);
    const source = { a: 10, b: 5, c: 2 };
    const result = engine(source);
    // 10 + (5 * 2) = 20
    expect(result.result).toBe(20);
  });

  it('should support parentheses for precedence', async () => {
    const query = morphQL`
      from object to object
      transform
        set result = (a + b) * c
    `;
    const engine = await compile(query);
    const source = { a: 10, b: 5, c: 2 };
    const result = engine(source);
    // (10 + 5) * 2 = 30
    expect(result.result).toBe(30);
  });

  it('should support numeric literals in expressions', async () => {
    const query = morphQL`
      from object to object
      transform
        set next = count + 1
    `;
    const engine = await compile(query);
    const source = { count: 41 };
    const result = engine(source);
    expect(result.next).toBe(42);
  });

  it('should support subtraction and division', async () => {
    const query = morphQL`
      from object to object
      transform
        set balance = income - expenses
        set ratio = a / b
    `;
    const engine = await compile(query);
    const source = { income: 1000, expenses: 400, a: 10, b: 2 };
    const result = engine(source);
    expect(result.balance).toBe(600);
    expect(result.ratio).toBe(5);
  });
});
