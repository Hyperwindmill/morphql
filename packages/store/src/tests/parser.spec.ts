import { describe, expect, it } from 'vitest';
import { parseSQL } from '../parser.js';

describe('SQL Parser', () => {
  it('should parse basic SELECT', () => {
    const ast = parseSQL('SELECT id, name FROM users');
    expect(ast.from).toBe('users');
    expect(ast.select).toEqual([
      { alias: 'id', expr: 'id' },
      { alias: 'name', expr: 'name' }
    ]);
  });

  it('should handle aliases and wildcards', () => {
    const ast = parseSQL('SELECT *, name = firstName + " " + lastName FROM users');
    expect(ast.hasWildcard).toBe(true);
    expect(ast.select).toEqual([
      { alias: 'name', expr: 'firstName + " " + lastName' }
    ]);
  });

  it('should parse WHERE, ORDER BY, LIMIT', () => {
    const ast = parseSQL('SELECT id FROM users WHERE age > 18 ORDER BY score DESC LIMIT 10');
    expect(ast.where).toBe('age > 18');
    expect(ast.orderBy).toBe('score');
    expect(ast.orderDesc).toBe(true);
    expect(ast.limit).toBe('10');
  });
  it('should support multiline queries with tabs and newlines', () => {
    const ast = parseSQL(`
      SELECT 
        id, 
        name 
      FROM 
        users 
      WHERE 
        age > 18 
      ORDER BY 
        score DESC 
      LIMIT 10
    `);
    expect(ast.from).toBe('users');
    expect(ast.select).toEqual([
      { alias: 'id', expr: 'id' },
      { alias: 'name', expr: 'name' }
    ]);
    expect(ast.where).toBe('age > 18');
    expect(ast.orderBy).toBe('score');
  });
});

describe('INSERT Parser', () => {
  it('should parse INSERT with JSON syntax', () => {
    const ast = parseSQL('INSERT INTO users { "name": "Alice", "age": 30 }');
    expect(ast.type).toBe('insert');
    if (ast.type === 'insert') {
      expect(ast.into).toBe('users');
      expect(ast.jsonValue).toBe('{ "name": "Alice", "age": 30 }');
    }
  });

  it('should parse INSERT with SQL syntax', () => {
    const ast = parseSQL("INSERT INTO users (name, age) VALUES ('Alice', 30)");
    expect(ast.type).toBe('insert');
    if (ast.type === 'insert') {
      expect(ast.into).toBe('users');
      expect(ast.columns).toEqual(['name', 'age']);
      expect(ast.values).toEqual(["'Alice'", '30']);
    }
  });
});

describe('UPDATE Parser', () => {
  it('should parse UPDATE with WHERE', () => {
    const ast = parseSQL("UPDATE users SET name = 'Bob' WHERE id = 1");
    expect(ast.type).toBe('update');
    if (ast.type === 'update') {
      expect(ast.table).toBe('users');
      expect(ast.set).toEqual([{ field: 'name', expr: "'Bob'" }]);
      expect(ast.where).toBe('id = 1');
    }
  });

  it('should parse UPDATE without WHERE', () => {
    const ast = parseSQL("UPDATE users SET active = true");
    expect(ast.type).toBe('update');
    if (ast.type === 'update') {
      expect(ast.table).toBe('users');
      expect(ast.set).toEqual([{ field: 'active', expr: 'true' }]);
      expect(ast.where).toBeUndefined();
    }
  });
});

describe('DELETE Parser', () => {
  it('should parse DELETE with WHERE', () => {
    const ast = parseSQL('DELETE FROM users WHERE id = 5');
    expect(ast.type).toBe('delete');
    if (ast.type === 'delete') {
      expect(ast.from).toBe('users');
      expect(ast.where).toBe('id = 5');
    }
  });

  it('should parse DELETE without WHERE', () => {
    const ast = parseSQL('DELETE FROM users');
    expect(ast.type).toBe('delete');
    if (ast.type === 'delete') {
      expect(ast.from).toBe('users');
      expect(ast.where).toBeUndefined();
    }
  });
});
