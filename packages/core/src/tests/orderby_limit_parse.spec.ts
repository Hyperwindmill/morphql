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
});
