import { describe, expect, it } from 'vitest';
import { parseSQL } from '../parser.js';
import { transpile } from '../transpiler.js';

describe('Transpiler', () => {
  it('should transpile parsed SQL to MorphQL', () => {
    const ast = parseSQL('SELECT *, fullName = firstName + " " + lastName FROM users WHERE age > 18 ORDER BY score DESC LIMIT 10');
    const morphql = transpile(ast);
    
    expect(morphql).toContain('from object to object');
    expect(morphql).toContain('section multiple data(');
    expect(morphql).toContain('clone()');
    expect(morphql).toContain('set fullName = firstName + " " + lastName');
    expect(morphql).toContain('from source where age > 18 orderby score desc limit 10');
  });
});
