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

describe('BUG A — string values with newlines/quotes in UPDATE', () => {
  it('UPDATE with a multi-line string value stores the real newline', async () => {
    const store = new Store(new MemoryAdapter({ notes: [{ id: 1, body: 'old' }] }));
    const multiline = "line1\nline2";
    // The SQL string literal embeds a real newline inside the quoted value
    await store.query(`UPDATE notes SET body = 'line1\nline2' WHERE id = 1`);
    const data = await store.query('SELECT * FROM notes');
    expect(Array.isArray(data)).toBe(true);
    if (Array.isArray(data)) {
      expect(data[0].body).toBe(multiline);
    }
  });

  it("UPDATE with an embedded single-quote (apostrophe) stores the exact string", async () => {
    const store = new Store(new MemoryAdapter({ notes: [{ id: 1, body: 'old' }] }));
    // Use double-quoted SQL string to carry the apostrophe
    await store.query(`UPDATE notes SET body = "it's done" WHERE id = 1`);
    const data = await store.query('SELECT * FROM notes');
    if (Array.isArray(data)) {
      expect(data[0].body).toBe("it's done");
    }
  });
});

describe('BUG C — JS-string escape decoding in UPDATE and INSERT', () => {
  it("UPDATE SET name = 'it\\'s' stores it's (backslash-apostrophe decoded)", async () => {
    const store = new Store(new MemoryAdapter({ users: [{ id: 1, name: 'old' }] }));
    // SQL string literal with a backslash-escaped apostrophe: 'it\'s'
    await store.query("UPDATE users SET name = 'it\\'s' WHERE id = 1");
    const data = await store.query('SELECT * FROM users');
    if (Array.isArray(data)) {
      expect(data[0].name).toBe("it's");
    }
  });

  it("UPDATE SET name = 'a\\\\b' stores a\\b (double-backslash decoded to one backslash)", async () => {
    const store = new Store(new MemoryAdapter({ users: [{ id: 1, name: 'old' }] }));
    // SQL literal 'a\\b': two chars \\ then b — should decode to one backslash
    await store.query("UPDATE users SET name = 'a\\\\b' WHERE id = 1");
    const data = await store.query('SELECT * FROM users');
    if (Array.isArray(data)) {
      expect(data[0].name).toBe('a\\b');
    }
  });

  it("UPDATE with 'a\\\\nb' stores a\\nb (backslash-backslash consumed before n — not a newline)", async () => {
    const store = new Store(new MemoryAdapter({ users: [{ id: 1, name: 'old' }] }));
    // SQL literal 'a\\nb': \\ is consumed first -> \, then n is literal — result: a\nb (3 chars a \ n b)
    await store.query("UPDATE users SET name = 'a\\\\nb' WHERE id = 1");
    const data = await store.query('SELECT * FROM users');
    if (Array.isArray(data)) {
      expect(data[0].name).toBe('a\\nb');
      expect(data[0].name).toHaveLength(4); // a, backslash, n, b
      expect(data[0].name).not.toBe('a\nb'); // must NOT be a newline
    }
  });

  it("UPDATE SET name = 'line1\\nline2' stores a real newline character", async () => {
    const store = new Store(new MemoryAdapter({ users: [{ id: 1, name: 'old' }] }));
    // SQL literal 'line1\nline2': \n should decode to real newline
    await store.query("UPDATE users SET name = 'line1\\nline2' WHERE id = 1");
    const data = await store.query('SELECT * FROM users');
    if (Array.isArray(data)) {
      expect(data[0].name).toBe('line1\nline2');
    }
  });

  it("INSERT VALUES ('it\\'s') stores it's (backslash-apostrophe decoded)", async () => {
    const store = new Store(new MemoryAdapter({ items: [] }));
    await store.query("INSERT INTO items (id, label) VALUES (1, 'it\\'s')");
    const data = await store.query('SELECT * FROM items');
    if (Array.isArray(data)) {
      expect(data[0].label).toBe("it's");
    }
  });
});

describe('BUG C (double quotes) — " handled like \'', () => {
  it('UPDATE double-quoted value with escaped double quotes stores them unescaped', async () => {
    const store = new Store(new MemoryAdapter({ users: [{ id: 1, name: 'old' }] }));
    // SQL: UPDATE ... SET name = "say \"hi\"" — should store: say "hi"
    await store.query('UPDATE users SET name = "say \\"hi\\"" WHERE id = 1');
    const data = await store.query('SELECT * FROM users');
    if (Array.isArray(data)) {
      expect(data[0].name).toBe('say "hi"');
    }
  });

  it('UPDATE double-quoted value containing an apostrophe is left intact', async () => {
    const store = new Store(new MemoryAdapter({ users: [{ id: 1, name: 'old' }] }));
    // SQL: UPDATE ... SET name = "it's" — apostrophe inside double quotes is a literal
    await store.query('UPDATE users SET name = "it\'s" WHERE id = 1');
    const data = await store.query('SELECT * FROM users');
    if (Array.isArray(data)) {
      expect(data[0].name).toBe("it's");
    }
  });

  it('UPDATE double-quoted value with a real newline stores the newline', async () => {
    const store = new Store(new MemoryAdapter({ users: [{ id: 1, name: 'old' }] }));
    await store.query('UPDATE users SET name = "line1\nline2" WHERE id = 1');
    const data = await store.query('SELECT * FROM users');
    if (Array.isArray(data)) {
      expect(data[0].name).toBe('line1\nline2');
    }
  });

  it('INSERT double-quoted value with escaped double quote stores it unescaped', async () => {
    const store = new Store(new MemoryAdapter({ items: [] as any[] }));
    // SQL: INSERT ... VALUES (1, "a\"b") — should store: a"b
    await store.query('INSERT INTO items (id, label) VALUES (1, "a\\"b")');
    const data = await store.query('SELECT * FROM items');
    if (Array.isArray(data)) {
      expect(data[0].label).toBe('a"b');
    }
  });

  it('UPDATE single-quoted value containing a double quote is left intact', async () => {
    const store = new Store(new MemoryAdapter({ users: [{ id: 1, name: 'old' }] }));
    // SQL: UPDATE ... SET name = 'say "hello"' — double quote inside single quotes is a literal
    await store.query('UPDATE users SET name = \'say "hello"\' WHERE id = 1');
    const data = await store.query('SELECT * FROM users');
    if (Array.isArray(data)) {
      expect(data[0].name).toBe('say "hello"');
    }
  });
});

describe('BUG B — compound WHERE conditions', () => {
  it('SELECT with AND compound WHERE returns correct rows', async () => {
    const store = new Store(new MemoryAdapter({
      users: [
        { id: 1, name: 'Alice', role: 'admin' },
        { id: 2, name: 'Bob', role: 'user' },
        { id: 3, name: 'Alice', role: 'user' },
      ]
    }));
    const data = await store.query("SELECT * FROM users WHERE name = 'Alice' AND role = 'admin'");
    expect(Array.isArray(data)).toBe(true);
    if (Array.isArray(data)) {
      expect(data).toHaveLength(1);
      expect(data[0].id).toBe(1);
    }
  });

  it('SELECT with OR compound WHERE returns correct rows', async () => {
    const store = new Store(new MemoryAdapter({
      items: [{ id: 1 }, { id: 2 }, { id: 3 }]
    }));
    const data = await store.query('SELECT * FROM items WHERE id = 1 OR id = 2');
    if (Array.isArray(data)) {
      expect(data).toHaveLength(2);
      expect(data.map((r: any) => r.id).sort()).toEqual([1, 2]);
    }
  });

  it('SELECT with IS NULL condition returns correct rows', async () => {
    const store = new Store(new MemoryAdapter({
      tasks: [
        { id: 1, status: 'active', lockedAt: null },
        { id: 2, status: 'active', lockedAt: '2024-01-01' },
      ]
    }));
    const data = await store.query("SELECT * FROM tasks WHERE status = 'active' AND lockedAt IS NULL");
    if (Array.isArray(data)) {
      expect(data).toHaveLength(1);
      expect(data[0].id).toBe(1);
    }
  });

  it('SELECT with IS NOT NULL condition returns correct rows', async () => {
    const store = new Store(new MemoryAdapter({
      tasks: [
        { id: 1, deletedAt: null },
        { id: 2, deletedAt: '2024-01-01' },
      ]
    }));
    const data = await store.query('SELECT * FROM tasks WHERE deletedAt IS NOT NULL');
    if (Array.isArray(data)) {
      expect(data).toHaveLength(1);
      expect(data[0].id).toBe(2);
    }
  });

  it('UPDATE with AND compound WHERE only touches matching rows', async () => {
    const store = new Store(new MemoryAdapter({
      users: [
        { id: 1, name: 'Alice', role: 'admin' },
        { id: 2, name: 'Bob', role: 'user' },
      ]
    }));
    await store.query("UPDATE users SET name = 'Updated' WHERE id = 1 AND role = 'admin'");
    const data = await store.query('SELECT * FROM users');
    if (Array.isArray(data)) {
      expect(data[0].name).toBe('Updated');
      expect(data[1].name).toBe('Bob');
    }
  });

  it('DELETE with AND compound WHERE removes only matching rows', async () => {
    const store = new Store(new MemoryAdapter({
      users: [
        { id: 1, name: 'Alice', role: 'admin' },
        { id: 2, name: 'Bob', role: 'user' },
        { id: 3, name: 'Alice', role: 'user' },
      ]
    }));
    await store.query("DELETE FROM users WHERE name = 'Alice' AND role = 'admin'");
    const data = await store.query('SELECT * FROM users');
    if (Array.isArray(data)) {
      expect(data).toHaveLength(2);
      expect(data.map((r: any) => r.id).sort()).toEqual([2, 3]);
    }
  });

  it('string value containing AND keyword is NOT corrupted', async () => {
    const store = new Store(new MemoryAdapter({
      songs: [
        { id: 1, name: 'rock and roll', active: true },
        { id: 2, name: 'jazz', active: true },
      ]
    }));
    const data = await store.query("SELECT * FROM songs WHERE name = 'rock and roll' AND active = true");
    if (Array.isArray(data)) {
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('rock and roll');
    }
  });
});
