import { describe, it, expect } from 'vitest';
import { compile } from '../index.js';

describe('MorphQL Subqueries (Dependency Injection)', () => {
  it('should inject and execute a subquery via morph()', async () => {
    const addressQuery = await compile(`
      from object to object
      transform
        set full = street + ", " + city
    `);

    const mainQuery = await compile(`
      from object to object
      transform
        set addr = morph('addressTransform', source.address)
    `, {
      queries: {
        'addressTransform': addressQuery
      }
    });

    const result = mainQuery({
      address: { street: "123 Main St", city: "New York" }
    });
    
    expect(result).toEqual({
      addr: { full: "123 Main St, New York" }
    });
  });

  it('should throw an error at runtime if subquery is missing', async () => {
    const mainQuery = await compile(`
      from object to object
      transform
        set addr = morph('missingQuery', source.address)
    `);

    expect(() => mainQuery({ address: {} })).toThrow(/missingQuery/);
  });
});
