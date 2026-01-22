import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Clone Repro', async () => {
  it('should not modify the source object when using clone', async () => {
    const query = morphQL`from object to object transform set extra="val" clone`;
    const transform = await compile(query);
    const source = { a: 1 };
    const sourceClone = JSON.parse(JSON.stringify(source));

    const result = transform(source);

    // Check if source was modified
    expect(source).toEqual(sourceClone);
    // Check if result is correct
    expect(result).toEqual({ extra: 'val', a: 1 });
  });

  it('should verify behavior of set then clone', async () => {
    // If we set 'b' then clone, and source already had 'a'
    const query = morphQL`from object to object transform set b=a clone`;
    const transform = await compile(query);
    const source = { a: 1 };

    const result = transform(source);

    // target.b = 1 (from set)
    // Object.assign(target, source) -> target.a = 1 (from source)
    expect(result).toEqual({ b: 1, a: 1 });
  });

  it('should verify behavior of clone then set', async () => {
    const query = morphQL`from object to object transform clone set b=a`;
    const transform = await compile(query);
    const source = { a: 1 };

    const result = transform(source);

    expect(result).toEqual({ a: 1, b: 1 });
  });
});
