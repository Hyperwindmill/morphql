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

  it('should execute INSERT with JSON syntax', async () => {
    const store = new Store(new MemoryAdapter({ users: [{ id: 1, name: 'Alice' }] }));
    const result = await store.query('INSERT INTO users { "id": 2, "name": "Bob" }');
    expect(result).toEqual({ type: 'insert', table: 'users' });
    // Verify the data was actually persisted
    const data = await store.query('SELECT * FROM users');
    expect(Array.isArray(data)).toBe(true);
    if (Array.isArray(data)) {
      expect(data).toHaveLength(2);
      expect(data[1].name).toBe('Bob');
    }
  });

  it('should execute UPDATE', async () => {
    const store = new Store(new MemoryAdapter({ users: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }] }));
    const result = await store.query("UPDATE users SET name = 'UPDATED' WHERE id = 2");
    expect(result).toEqual({ type: 'update', table: 'users' });
    const data = await store.query('SELECT * FROM users');
    if (Array.isArray(data)) {
      expect(data[1].name).toBe('UPDATED');
    }
  });

  it('should execute DELETE', async () => {
    const store = new Store(new MemoryAdapter({ users: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }] }));
    const result = await store.query('DELETE FROM users WHERE id = 2');
    expect(result).toEqual({ type: 'delete', table: 'users' });
    const data = await store.query('SELECT * FROM users');
    if (Array.isArray(data)) {
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('Alice');
    }
  });
});
