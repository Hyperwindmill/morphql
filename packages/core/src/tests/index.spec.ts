import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Morph Engine (Query-to-Code)', async () => {
  it('should compile and execute a simple transformation', async () => {
    const query = morphQL`from json to object transform set newfield=field1`;
    const transform = await compile(query);

    const source = { field1: 'hello' };
    const result = transform(source);

    expect(result).toEqual({ newfield: 'hello' });
  });

  it('should handle default section (object mapping)', async () => {
    const query = morphQL`
      from json to object 
      transform 
        section header(
          set id=id
          set name=name
        )
    `;
    const transform = await compile(query);

    const source = {
      header: { id: 123, name: 'Alice' },
    };

    const result = transform(source);

    expect(result).toEqual({
      header: { id: 123, name: 'Alice' },
    });
  });

  it('should handle section with from directive', async () => {
    const query = morphQL`
      from json to object 
      transform 
        section meta(
          set version=v
        ) from info
    `;
    const transform = await compile(query);

    const source = {
      info: { v: '1.0.0' },
    };

    const result = transform(source);

    expect(result).toEqual({
      meta: { version: '1.0.0' },
    });
  });

  it('should handle multiple section (arrays)', async () => {
    const query = morphQL`
      from json to object 
      transform 
        section multiple lines(
          set lineNo=id
        )
    `;
    const transform = await compile(query);

    const source = {
      lines: [{ id: 1 }, { id: 2 }],
    };

    const result = transform(source);

    expect(result).toEqual({
      lines: [{ lineNo: 1 }, { lineNo: 2 }],
    });
  });

  it('should handle multiple section with from', async () => {
    const query = morphQL`
      from json to object 
      transform 
        section multiple items(
          set v=val
        ) from rawData
    `;
    const transform = await compile(query);

    const source = {
      rawData: [{ val: 'A' }, { val: 'B' }],
    };

    const result = transform(source);

    expect(result).toEqual({
      items: [{ v: 'A' }, { v: 'B' }],
    });
  });

  it('should handle nested sections (arrays)', async () => {
    const query = morphQL`
      from json to object 
      transform 
        set fullName=name 
        section multiple lines(
          set lineNo=id
        )
    `;
    const transform = await compile(query);

    const source = {
      name: 'Test Project',
      lines: [{ id: 1 }, { id: 2 }],
    };

    const result = transform(source);

    expect(result).toEqual({
      fullName: 'Test Project',
      lines: [{ lineNo: 1 }, { lineNo: 2 }],
    });
  });

  it('should handle full clone directive', async () => {
    const query = morphQL`
      from json to object 
      transform 
        clone
    `;
    const transform = await compile(query);

    const source = { a: 1, b: 'two', c: { nested: true } };
    const result = transform(source);

    expect(result).toEqual(source);
  });

  it('should handle selective clone directive', async () => {
    const query = morphQL`
      from json to object 
      transform 
        clone(a, c)
    `;
    const transform = await compile(query);

    const source = { a: 1, b: 'two', c: { nested: true } };
    const result = transform(source);

    expect(result).toEqual({ a: 1, c: { nested: true } });
  });

  it('should handle clone inside a section', async () => {
    const query = morphQL`
      from json to object 
      transform 
        section sub(
          clone(x)
          set mappedY=y
        )
    `;
    const transform = await compile(query);

    const source = {
      sub: { x: 10, z: 20, y: 30 },
    };
    const result = transform(source);

    expect(result).toEqual({
      sub: { x: 10, mappedY: 30 },
    });
  });

  it('should handle deeply nested sections (mixed objects and arrays)', async () => {
    const query = morphQL`
      from json to object 
      transform 
        section order(
          set orderId=orderId
          section multiple items(
            set sku=itemSku
            section details(
              set color=hex
            ) from info
          ) from products
        )
    `;
    const transform = await compile(query);

    const source = {
      order: {
        orderId: 'ORD-1',
        products: [
          { itemSku: 'ABC', info: { hex: '#FF0000' } },
          { itemSku: 'XYZ', info: { hex: '#0000FF' } },
        ],
      },
    };

    const result = transform(source);

    expect(result).toEqual({
      order: {
        orderId: 'ORD-1',
        items: [
          { sku: 'ABC', details: { color: '#FF0000' } },
          { sku: 'XYZ', details: { color: '#0000FF' } },
        ],
      },
    });
  });
});
