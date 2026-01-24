import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Special Objects (_source, _target)', async () => {
  it('should allow access to root source via _source inside a section', async () => {
    const query = morphQL`
      from json to object
      transform
        set globalId = id
        section multiple items(
          set itemId = id
          set parentId = _source.id
        ) from list
    `;
    const transform = await compile(query);

    const source = {
      id: 'root-1',
      list: [{ id: 'item-1' }]
    };

    const result = transform(source);

    expect(result).toEqual({
      globalId: 'root-1',
      items: [{ itemId: 'item-1', parentId: 'root-1' }]
    });
  });

  it('should allow access to root target via _target', async () => {
    const query = morphQL`
      from json to object
      transform
        set globalId = id
        section multiple items(
          set parentIdFromTarget = _target.globalId
        ) from list
    `;
    const transform = await compile(query);

    const source = {
      id: 'root-1',
      list: [{ id: 'item-1' }]
    };

    const result = transform(source);

    expect(result).toEqual({
      globalId: 'root-1',
      items: [{ parentIdFromTarget: 'root-1' }]
    });
  });

  it('should allow access to main root source via _source inside a subquery section', async () => {
    // This tests that _source in a subquery refers to the GLOBAL query root,
    // NOT the subquery root.

    const query = morphQL`
      from json to object
      transform
        section sub(
          from object to object
          transform
            set parentId = _source.id
        ) from nested
    `;
    const transform = await compile(query);

    const source = {
      id: 'root-1',
      nested: { val: 'inner' }
    };

    const result = transform(source);

    expect(result).toEqual({
      sub: { parentId: 'root-1' }
    });
  });
});
