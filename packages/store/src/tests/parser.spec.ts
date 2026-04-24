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
});
