import { describe, it, expect } from 'vitest';
import { compile } from '../index';

describe('List and Array Functions', () => {
  it('should support list() function for creating arrays', async () => {
    const query = `
      from json to object
      transform
        set result = list(1, 2, 3)
    `;
    const engine = await compile(query);
    const output = await engine({ a: 1 });
    expect(output.result).toEqual([1, 2, 3]);
  });

  it('should support array() as an alias for list()', async () => {
    const query = `
      from json to object
      transform
        set result = array("a", "b")
    `;
    const engine = await compile(query);
    const output = await engine({ a: 1 });
    expect(output.result).toEqual(['a', 'b']);
  });

  it('should support nested list() calls', async () => {
    const query = `
      from json to object
      transform
        set FWB = list(
          list("16"),
          list("125-99999992", "MXP", "LHR")
        )
    `;
    const engine = await compile(query);
    const output = await engine({ a: 1 });
    expect(output.FWB).toEqual([['16'], ['125-99999992', 'MXP', 'LHR']]);
  });

  it('should support mixed expressions in list()', async () => {
    const query = `
      from json to object
      transform
        define val = 10
        set result = list(val, val * 2, "const")
    `;
    const engine = await compile(query);
    const output = await engine({ a: 1 });
    expect(output.result).toEqual([10, 20, 'const']);
  });
});
