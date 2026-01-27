import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Null-Safe Functions', async () => {
  it('should return null when extractnumber finds no match', async () => {
    const query = morphQL`
      from object to object
      transform
        set result = extractnumber(text)
    `;
    const engine = await compile(query);
    const result = engine({ text: 'hello world' });
    expect(result.result).toBeNull();
  });

  it('should extract number when present', async () => {
    const query = morphQL`
      from object to object
      transform
        set result = extractnumber(text)
    `;
    const engine = await compile(query);
    const result = engine({ text: 'Price: 123.45 USD' });
    expect(result.result).toBe(123.45);
  });

  it('should handle undefined input gracefully', async () => {
    const query = morphQL`
      from object to object
      transform
        set result = extractnumber(missing)
    `;
    const engine = await compile(query);
    const result = engine({});
    expect(result.result).toBeNull();
  });
});
