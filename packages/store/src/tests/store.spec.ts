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

  it('should support auto() in SQL INSERT', async () => {
    const store = new Store(new MemoryAdapter({ users: [{ id: 5, name: 'Alice' }, { id: 10, name: 'Bob' }] }));
    await store.query("INSERT INTO users (id, name) VALUES (auto(), 'Charlie')");
    const data = await store.query('SELECT * FROM users');
    if (Array.isArray(data)) {
      expect(data).toHaveLength(3);
      expect(data[2].id).toBe(11); // max(10) + 1
      expect(data[2].name).toBe('Charlie');
    }
  });

  it('should support autoincrement() in SQL INSERT', async () => {
    const store = new Store(new MemoryAdapter({ users: [{ id: 1, name: 'Alice' }] }));
    await store.query("INSERT INTO users (id, name) VALUES (autoincrement(), 'Bob')");
    const data = await store.query('SELECT * FROM users');
    if (Array.isArray(data)) {
      expect(data[1].id).toBe(2);
    }
  });

  it('should support $auto in JSON INSERT', async () => {
    const store = new Store(new MemoryAdapter({ items: [{ id: 3, label: 'A' }] }));
    await store.query('INSERT INTO items { "id": "$auto", "label": "B" }');
    const data = await store.query('SELECT * FROM items');
    if (Array.isArray(data)) {
      expect(data).toHaveLength(2);
      expect(data[1].id).toBe(4); // max(3) + 1
    }
  });

  it('should treat \\$auto as literal $auto in JSON INSERT', async () => {
    const store = new Store(new MemoryAdapter({ items: [{ id: 1 }] }));
    await store.query('INSERT INTO items { "id": 2, "tag": "\\\\$auto" }');
    const data = await store.query('SELECT * FROM items');
    if (Array.isArray(data)) {
      expect(data[1].tag).toBe('$auto');
    }
  });

  it('should start autoincrement at 1 for empty tables', async () => {
    const store = new Store(new MemoryAdapter({ empty: [] }));
    await store.query("INSERT INTO empty (id, name) VALUES (auto(), 'First')");
    const data = await store.query('SELECT * FROM empty');
    if (Array.isArray(data)) {
      expect(data[0].id).toBe(1);
    }
  });
});
