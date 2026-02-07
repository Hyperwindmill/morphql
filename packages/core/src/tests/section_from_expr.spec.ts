import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Morph Engine - Section From Expression', async () => {
  it('should support function calls in section from clause', async () => {
    const query = morphQL`
      from csv to object
      transform
        section multiple products(
          set id = ID
          set name = Name
        ) from spreadsheet(source)
    `;
    const transform = await compile(query);
    const input = 'ID,Name\nP001,Mouse\nP002,Keyboard';
    const result = transform(input);

    expect(result.products).toEqual([
      { id: 'P001', name: 'Mouse' },
      { id: 'P002', name: 'Keyboard' },
    ]);
  });

  it('should support expressions with operators in section from clause', async () => {
    const query = morphQL`
      from object to object
      transform
        section multiple items(
          set val = source
        ) from concat(list1, list2)
    `;
    const transform = await compile(query);
    const input = {
      list1: [1, 2],
      list2: [3, 4],
    };
    const result = transform(input);

    expect(result.items).toEqual([{ val: 1 }, { val: 2 }, { val: 3 }, { val: 4 }]);
  });
});
