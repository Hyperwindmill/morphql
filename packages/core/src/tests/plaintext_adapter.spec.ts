import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Morph Engine - Plaintext Adapter', async () => {
  it('should parse plaintext into rows with default separator', async () => {
    const query = morphQL`
      from plaintext to object
      transform
        set data = rows
    `;
    const transform = await compile(query);
    const input = 'line1\nline2\r\nline3';
    const result = transform(input);

    expect(result.data).toEqual(['line1', 'line2', 'line3']);
  });

  it('should parse plaintext with custom separator as positional param', async () => {
    const query = morphQL`
      from plaintext(";") to object
      transform
        set data = rows
    `;
    const transform = await compile(query);
    const input = 'line1;line2;line3';
    const result = transform(input);

    expect(result.data).toEqual(['line1', 'line2', 'line3']);
  });

  it('should parse plaintext with custom separator as named param', async () => {
    const query = morphQL`
      from plaintext(separator="|") to object
      transform
        set data = rows
    `;
    const transform = await compile(query);
    const input = 'line1|line2|line3';
    const result = transform(input);

    expect(result.data).toEqual(['line1', 'line2', 'line3']);
  });

  it('should serialize rows into plaintext with default separator', async () => {
    const query = morphQL`
      from object to plaintext
      transform
        set rows = source
    `;
    const transform = await compile(query);
    const input = ['val1', 'val2', 'val3'];
    const result = transform(input);

    expect(result).toBe('val1\nval2\nval3');
  });

  it('should serialize rows into plaintext with custom separator', async () => {
    const query = morphQL`
      from object to plaintext(";")
      transform
        set rows = source
    `;
    const transform = await compile(query);
    const input = ['val1', 'val2', 'val3'];
    const result = transform(input);

    expect(result).toBe('val1;val2;val3');
  });
});
