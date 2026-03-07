import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Morph Engine - YAML Adapter', async () => {
  it('should parse YAML object and map fields', async () => {
    const query = morphQL`
      from yaml to object
      transform
        set name = name
        set age = age
    `;
    const transform = await compile(query);
    const input = 'name: Alice\nage: 30';
    const result = transform(input);

    expect(result).toEqual({ name: 'Alice', age: 30 });
  });

  it('should parse YAML list into multiple sections', async () => {
    const query = morphQL`
      from yaml to object
      transform
        section multiple data (
          from object to object
          transform
            set id = id
            set label = label
        ) from _source
    `;
    const transform = await compile(query);
    const input = '- id: 1\n  label: foo\n- id: 2\n  label: bar';
    const result = transform(input);

    expect(result.data).toEqual([
      { id: 1, label: 'foo' },
      { id: 2, label: 'bar' },
    ]);
  });

  it('should serialize object to YAML', async () => {
    const query = morphQL`
      from object to yaml
      transform
        set name = name
        set city = city
    `;
    const transform = await compile(query);
    const input = { name: 'Bob', city: 'Rome' };
    const result = transform(input) as string;

    expect(result).toContain('name: Bob');
    expect(result).toContain('city: Rome');
  });

  it('should round-trip YAML through parse and serialize', async () => {
    const query = morphQL`
      from yaml to yaml
      transform
        set key = key
        set value = value
    `;
    const transform = await compile(query);
    const input = 'key: hello\nvalue: world';
    const result = transform(input) as string;

    expect(result).toContain('key: hello');
    expect(result).toContain('value: world');
  });
});
