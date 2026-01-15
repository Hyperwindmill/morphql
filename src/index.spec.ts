import { describe, it, expect } from 'vitest';
import { compile } from './index.js';

describe('Morph Engine (Query-to-Code)', () => {
  it('should compile and execute a simple transformation', () => {
    const query = 'from static as json to return as xml transform set field1=newfield';
    const transform = compile(query);

    const source = { field1: 'hello' };
    const result = transform(source);

    expect(result).toEqual({ newfield: 'hello' });
  });

  it('should handle default section (object mapping)', () => {
    const query = `
      from static as json to return as xml 
      transform 
        section header(
          set id=id
          set name=name
        )
    `;
    const transform = compile(query);

    const source = {
      header: { id: 123, name: 'Alice' },
    };

    const result = transform(source);

    expect(result).toEqual({
      header: { id: 123, name: 'Alice' },
    });
  });

  it('should handle section with follow directive', () => {
    const query = `
      from static as json to return as xml 
      transform 
        section meta(
          set v=version
        ) follow info
    `;
    const transform = compile(query);

    const source = {
      info: { v: '1.0.0' },
    };

    const result = transform(source);

    expect(result).toEqual({
      meta: { version: '1.0.0' },
    });
  });

  it('should handle multiple section (arrays)', () => {
    const query = `
      from static as json to return as xml 
      transform 
        section multiple lines(
          set id=lineNo
        )
    `;
    const transform = compile(query);

    const source = {
      lines: [{ id: 1 }, { id: 2 }],
    };

    const result = transform(source);

    expect(result).toEqual({
      lines: [{ lineNo: 1 }, { lineNo: 2 }],
    });
  });

  it('should handle multiple section with follow', () => {
    const query = `
      from static as json to return as xml 
      transform 
        section multiple items(
          set val=v
        ) follow rawData
    `;
    const transform = compile(query);

    const source = {
      rawData: [{ val: 'A' }, { val: 'B' }],
    };

    const result = transform(source);

    expect(result).toEqual({
      items: [{ v: 'A' }, { v: 'B' }],
    });
  });

  it('should handle nested sections (arrays)', () => {
    const query = `
      from static as json to return as xml 
      transform 
        set name=fullName 
        section multiple lines(
          set id=lineNo
        )
    `;
    const transform = compile(query);

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

  it('should handle deeply nested sections (mixed objects and arrays)', () => {
    const query = `
      from static as json to return as xml 
      transform 
        section order(
          set orderId=orderId
          section multiple items(
            set itemSku=sku
            section details(
              set hex=color
            ) follow info
          ) follow products
        )
    `;
    const transform = compile(query);

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
