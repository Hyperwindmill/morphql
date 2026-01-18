import { describe, it, expect } from 'vitest';
import { compile } from '../index.js';

describe('Functions in expressions', async () => {
  it('should support substring with 3 arguments', async () => {
    const query = `
      from object to object
      transform
        set short = substring(sku, 0, 3)
    `;
    const engine = await compile(query);
    const source = { sku: 'ABC12345' };
    const result = engine(source);
    expect(result.short).toBe('ABC');
  });

  it('should support substring with 2 arguments', async () => {
    const query = `
      from object to object
      transform
        set rest = substring(sku, 3)
    `;
    const engine = await compile(query);
    const source = { sku: 'ABC12345' };
    const result = engine(source);
    expect(result.rest).toBe('12345');
  });

  it('should support nested expressions in substring arguments', async () => {
    const query = `
      from object to object
      transform
        set result = substring(sku, 0, a + b)
    `;
    const engine = await compile(query);
    const source = { sku: 'ABC12345', a: 1, b: 2 };
    const result = engine(source);
    expect(result.result).toBe('ABC');
  });

  it('should support expressions as the string argument', async () => {
    const query = `
      from object to object
      transform
        set result = substring(prefix + sku, 0, 5)
    `;
    const engine = await compile(query);
    const source = { prefix: 'SKU-', sku: '12345' };
    const result = engine(source);
    expect(result.result).toBe('SKU-1');
  });

  it('should throw error for unknown function', async () => {
    const query = `
      from object to object
      transform
        set result = unknownFunc(sku)
    `;
    await expect(compile(query)).rejects.toThrow('Unknown function: unknownFunc');
  });
  it('should cast as string when using text function', async () => {
    const query = `
      from object to object
      transform
        set result = 11+text(sku)
    `;
    const engine = await compile(query);
    const source = { sku: 12345 };
    const result = engine(source);
    expect(result.result).toBe('1112345');
  });
  it('should not cast as string when not using text function', async () => {
    const query = `
      from object to object
      transform
        set result = 11+sku
    `;
    const engine = await compile(query);
    const source = { sku: 12345 };
    const result = engine(source);
    expect(result.result).toBe(12356);
  });
  it('should cast number when using number function', async () => {
    const query = `
      from object to object
      transform
        set result = 11+number(sku)
    `;
    const engine = await compile(query);
    const source = { sku: '12345' };
    const result = engine(source);
    expect(result.result).toBe(12356);
  });
  it('should extract number when using extractNumber function', async () => {
    const query = `
      from object to object
      transform
        set result = 11+extractNumber(sku)
        set resultInt = 11+extractNumber(skuInt)
    `;
    const engine = await compile(query);
    const source = { sku: '12345.15rt', skuInt: '12345' };
    const result = engine(source);
    expect(result.result).toBe(12356.15);
    expect(result.resultInt).toBe(12356);
  });
  it('should uppercase when using uppercase function', async () => {
    const query = `
      from object to object
      transform
        set result = uppercase(sku)
    `;
    const engine = await compile(query);
    const source = { sku: 'hello' };
    const result = engine(source);
    expect(result.result).toBe('HELLO');
  });
  it('should lowercase when using lowercase function', async () => {
    const query = `
      from object to object
      transform
        set result = lowercase(sku)
    `;
    const engine = await compile(query);
    const source = { sku: 'HELLO' };
    const result = engine(source);
    expect(result.result).toBe('hello');
  });
  it('should create xml node with attributeswhen using xmlnode function', async () => {
    const query = `
      from object to xml("test")
      transform
        set result = xmlnode(sku,'test',sku)
    `;
    const engine = await compile(query);
    const source = { sku: 'hello' };
    const result = engine(source);
    expect(result).toContain(`<result test="hello">hello</result>`);
  });
  it('should replace when using replace function', async () => {
    const query = `
      from object to object
      transform
        set result = replace(sku,'hello','world')
    `;
    const engine = await compile(query);
    const source = { sku: 'hello' };
    const result = engine(source);
    expect(result.result).toBe('world');
  });
  it('should split string using split function', async () => {
    const query = `
      from object to object
      transform
        define parts = split(sku, "-")
        set part0 = parts[0]
        set part1 = parts[1]
        
        define splitName = split(fullName, " ")
        set firstName = splitName[0]
        set lastName = splitName[1]

        define chars = split(code)
        set char0 = chars[0]

        define limited = split(sku, "-", 1)
        set lim0 = limited[0]
    `;
    const engine = await compile(query);
    const source = {
      sku: 'ABC-123',
      fullName: 'John Doe',
      code: 'XY',
    };
    const result = engine(source);
    expect(result.part0).toBe('ABC');
    expect(result.part1).toBe('123');
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
    expect(result.char0).toBe('X');
    expect(result.lim0).toBe('ABC');
  });
});
