import { describe, it, expect } from 'vitest';
import { compile } from './index.js';

describe('Morph Engine - Type Conversions', () => {
  it('should convert JS object to JSON string', () => {
    const query = 'from static as object to return as json transform set a=foo';
    const transform = compile(query);
    const result = transform({ a: 'bar' });

    expect(typeof result).toBe('string');
    expect(JSON.parse(result as string)).toEqual({ foo: 'bar' });
  });

  it('should convert JSON string to object and back to JSON', () => {
    const query = 'from static as json to return as json transform set val=value';
    const transform = compile(query);
    const input = JSON.stringify({ val: 123 });
    const result = transform(input);

    expect(JSON.parse(result as string)).toEqual({ value: 123 });
  });

  it('should convert object to XML with default root tag', () => {
    const query = 'from static as object to return as xml transform set name=userName';
    const transform = compile(query);
    const result = transform({ name: 'Alice' }) as string;

    expect(result).toContain('<root>');
    expect(result).toContain('<userName>Alice</userName>');
  });

  it('should convert object to XML with custom root tag', () => {
    const query = 'from static as object to return as xml("UserResponse") transform set id=userId';
    const transform = compile(query);
    const result = transform({ id: 1 }) as string;

    expect(result).toContain('<UserResponse>');
    expect(result).toContain('<userId>1</userId>');
  });

  it('should handle complex object to XML conversion', () => {
    const query = `
      from static as object to return as xml("Order") 
      transform 
        set id=orderId
        section multiple items(
          set sku=sku
        )
    `;
    const transform = compile(query);
    const source = {
      id: 'ORD-123',
      items: [{ sku: 'A' }, { sku: 'B' }],
    };
    const result = transform(source) as string;

    expect(result).toContain('<Order>');
    expect(result).toContain('<orderId>ORD-123</orderId>');
    expect(result).toContain('<items>');
    expect(result).toContain('<sku>A</sku>');
    expect(result).toContain('<sku>B</sku>');
  });
});
