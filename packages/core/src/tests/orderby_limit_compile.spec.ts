import { describe, expect, it } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('OrderBy and Limit compilation', () => {
  it('should filter, sort, and limit items correctly', async () => {
    const query = morphQL`
      from object to object
      transform
        section multiple items(
          set id = id
          set score = score
        ) from items where active == true orderby score desc limit 2
    `;
    
    const engine = await compile(query);
    const data = {
      items: [
        { id: 1, score: 10, active: true },
        { id: 2, score: 5, active: false },
        { id: 3, score: 20, active: true },
        { id: 4, score: 15, active: true }
      ]
    };
    
    const result = engine(data) as any;
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe(3); // score 20
    expect(result.items[1].id).toBe(4); // score 15
  });

  it('should sort ascending by default without limit', async () => {
    const query = morphQL`
      from object to object
      transform
        section multiple items(
          set id = id
        ) from items orderby score
    `;
    
    const engine = await compile(query);
    const data = {
      items: [
        { id: 1, score: 10 },
        { id: 2, score: 5 },
        { id: 3, score: 20 }
      ]
    };
    
    const result = engine(data) as any;
    expect(result.items).toHaveLength(3);
    expect(result.items[0].id).toBe(2); // score 5
    expect(result.items[1].id).toBe(1); // score 10
    expect(result.items[2].id).toBe(3); // score 20
  });

  it('should limit without sorting or filtering', async () => {
    const query = morphQL`
      from object to object
      transform
        section multiple items(
          set id = id
        ) from items limit 2
    `;
    
    const engine = await compile(query);
    const data = {
      items: [
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ]
    };
    
    const result = engine(data) as any;
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe(1);
    expect(result.items[1].id).toBe(2);
  });
});
