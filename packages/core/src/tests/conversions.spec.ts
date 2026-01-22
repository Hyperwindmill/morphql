import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Morph Engine - Type Conversions', async () => {
  it('should convert JS object to JSON string', async () => {
    const query = morphQL`from object to json transform set foo=a`;
    const transform = await compile(query);
    const result = transform({ a: 'bar' });

    expect(typeof result).toBe('string');
    expect(JSON.parse(result as string)).toEqual({ foo: 'bar' });
  });

  it('should convert JSON string to object and back to JSON', async () => {
    const query = morphQL`from json to json transform set value=val`;
    const transform = await compile(query);
    const input = JSON.stringify({ val: 123 });
    const result = transform(input);

    expect(JSON.parse(result as string)).toEqual({ value: 123 });
  });

  it('should convert object to XML with default root tag', async () => {
    const query = morphQL`from object to xml transform set userName=name`;
    const transform = await compile(query);
    const result = transform({ name: 'Alice' }) as string;

    expect(result).toContain('<root>');
    expect(result).toContain('<userName>Alice</userName>');
  });

  it('should convert object to XML with custom root tag', async () => {
    const query = morphQL`from object to xml("UserResponse") transform set userId=id`;
    const transform = await compile(query);
    const result = transform({ id: 1 }) as string;

    expect(result).toContain('<UserResponse>');
    expect(result).toContain('<userId>1</userId>');
  });

  it('should handle complex object to XML conversion', async () => {
    const query = morphQL`
      from object to xml("Order") 
      transform 
        set orderId=id
        section multiple items(
          set sku=sku
        )
    `;
    const transform = await compile(query);
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

  it('should convert XML string to JSON', async () => {
    const query = morphQL`from xml to json transform clone`;
    const transform = await compile(query);
    const input = `
      <root>
        <id>123</id>
        <name>Test</name>
      </root>
    `;
    const result = transform(input) as string;
    const parsed = JSON.parse(result);

    // fast-xml-parser provides the root object
    expect(parsed.root.id).toBe(123);
    expect(parsed.root.name).toBe('Test');
  });
});
