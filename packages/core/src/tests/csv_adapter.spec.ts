import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Morph Engine - CSV Adapter', async () => {
  it('should parse CSV with comma delimiter and map columns to letters', async () => {
    const query = morphQL`
      from csv to object
      transform
        section multiple data (
          from object to object
          transform
            set first = A
            set second = B
        ) from rows
    `;
    const transform = await compile(query);
    const input = 'val1,val2\nval3,val4';
    const result = transform(input);

    expect(result.data).toEqual([
      { first: 'val1', second: 'val2' },
      { first: 'val3', second: 'val4' },
    ]);
  });

  it('should parse CSV with semicolon delimiter', async () => {
    const query = morphQL`
      from csv(";") to object
      transform
        section multiple data (
          from object to object
          transform
            set x = A
            set y = B
        ) from rows
    `;
    const transform = await compile(query);
    const input = '1;2\n3;4';
    const result = transform(input);

    expect(result.data).toEqual([
      { x: '1', y: '2' },
      { x: '3', y: '4' },
    ]);
  });

  it('should handle many columns (A-Z, AA...)', async () => {
    const query = morphQL`
      from csv to object
      transform
        section multiple data (
          from object to object
          transform
            set first = A
            set col26 = Z
            set col27 = AA
        ) from rows
    `;
    const transform = await compile(query);
    // Create header-less row with at least 27 columns
    const cols = Array.from({ length: 30 }, (_, i) => `v${i + 1}`);
    const input = cols.join(',');
    const result = transform(input);

    expect(result.data[0].first).toBe('v1');
    expect(result.data[0].col26).toBe('v26');
    expect(result.data[0].col27).toBe('v27');
  });

  it('should serialize to CSV', async () => {
    const query = morphQL`
      from object to csv
      transform
        set rows = _source
    `;
    const transform = await compile(query);
    const input = [
      { A: '1', B: '2' },
      { A: '3', B: '4' },
    ];
    const result = (transform(input) as string).trim().replace(/\r\n/g, '\n');

    expect(result).toBe('1,2\n3,4');
  });

  it('should serialize to CSV with semicolon delimiter', async () => {
    const query = morphQL`
      from object to csv(";")
      transform
        set rows = _source
    `;
    const transform = await compile(query);
    const input = [
      { A: '1', B: '2' },
      { A: '3', B: '4' },
    ];
    const result = (transform(input) as string).trim().replace(/\r\n/g, '\n');

    expect(result).toBe('1;2\n3;4');
  });

  it('should handle quoted strings in CSV', async () => {
    const query = morphQL`
      from csv to object
      transform
        section multiple data (
          from object to object
          transform
            set first = A
            set second = B
        ) from rows
    `;
    const transform = await compile(query);
    const input = '"quoted,field",normal\n"field with ""escaped"" quote",another';
    const result = transform(input);

    expect(result.data).toEqual([
      { first: 'quoted,field', second: 'normal' },
      { first: 'field with "escaped" quote', second: 'another' },
    ]);
  });

  it('should handle TSV (tab separated values)', async () => {
    const query = morphQL`
      from csv("\t") to object
      transform
        section multiple data (
          from object to object
          transform
            set code = A
            set name = B
        ) from rows
    `;
    const transform = await compile(query);
    const input = '101\tProduct A\n102\tProduct B';
    const result = transform(input);

    expect(result.data).toEqual([
      { code: '101', name: 'Product A' },
      { code: '102', name: 'Product B' },
    ]);
  });
});
