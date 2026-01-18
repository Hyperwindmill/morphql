import { describe, it, expect } from 'vitest';
import { compile } from '../index.js';

describe('Optional Transform Directive', async () => {
  it('should clone object when transform is omitted (Object -> Object)', async () => {
    const query = 'from object to object';
    const transform = await compile(query);
    const source = { foo: 'bar', num: 123 };
    const result = transform(source);

    expect(result).toEqual(source);
    // Object.assign creates a shallow copy
    expect(result).not.toBe(source);
  });

  it('should clone format when transform is omitted (JSON -> Object)', async () => {
    const query = 'from json to object';
    const transform = await compile(query);
    const input = JSON.stringify({ a: 1, b: 2 });
    const result = transform(input);

    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should clone format when transform is omitted (Object -> JSON)', async () => {
    const query = 'from object to json';
    const transform = await compile(query);
    const result = transform({ foo: 'bar' });

    expect(JSON.parse(result as string)).toEqual({ foo: 'bar' });
  });

  it('should clone format when transform is omitted (JSON -> XML)', async () => {
    const query = 'from json to xml';
    const transform = await compile(query);
    const input = JSON.stringify({ root: { foo: 'bar' } });
    const result = transform(input) as string;

    expect(result).toContain('<root>');
    expect(result).toContain('<foo>bar</foo>');
  });
});
