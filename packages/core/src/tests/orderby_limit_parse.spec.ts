import { describe, expect, it } from 'vitest';
import { parse } from '../index.js';

describe('OrderBy and Limit parsing', () => {
  it('should parse orderby and limit successfully without crashing', () => {
    const query = `
      from object to object
      transform
        section multiple items(
          set id = id
        ) from items where active == true orderby score desc limit 10
    `;
    const ast = parse(query);
    expect(ast).toBeDefined();
  });

  it('should map orderby and limit properties to AST', () => {
    const query = `
      from object to object
      transform
        section multiple items(
          set id = id
        ) from items orderby score desc limit 10
    `;
    const ast = parse(query);
    const section = ast.actions[0] as any;
    expect(section.orderBy).toBe('score');
    expect(section.orderDesc).toBe(true);
    expect(section.limit).toBe('10');
  });
});
