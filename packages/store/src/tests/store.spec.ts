import { describe, expect, it } from 'vitest';
import { Store } from '../store.js';
import { MemoryAdapter } from '../adapters/memory.js';

describe('MorphStore', () => {
  it('should execute end-to-end SQL query', async () => {
    const data = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 25 },
      { id: 3, name: 'Charlie', age: 35 }
    ];
    
    const store = new Store(new MemoryAdapter({ users: data }));
    
    const result = await store.query('SELECT *, isAdult = true FROM users WHERE age >= 30 ORDER BY age DESC LIMIT 1');
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(3);
    expect(result[0].name).toBe('Charlie');
    expect(result[0].isAdult).toBe(true);
  });
});
