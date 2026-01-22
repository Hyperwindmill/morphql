import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Escaped Identifiers', async () => {
  it('should support reserved keywords as identifiers using backticks', async () => {
    const query = morphQL`
      from object to object
      transform
        set \`multiple\` = 1
        set \`section\` = "test"
        set \`if\` = true
    `;
    const engine = await compile(query);
    const source = {};
    const result = engine(source);
    expect(result.multiple).toBe(1);
    expect(result.section).toBe('test');
    expect(result.if).toBe(true);
  });

  it('should support special characters in identifiers using backticks', async () => {
    const query = morphQL`
      from object to object
      transform
        set \`my-field\` = 10
        set \`field with spaces\` = 20
        set \`@at\` = 30
    `;
    const engine = await compile(query);
    const source = {};
    const result = engine(source);
    expect(result['my-field']).toBe(10);
    expect(result['field with spaces']).toBe(20);
    expect(result['@at']).toBe(30);
  });

  it('should support quoted identifiers in define', async () => {
    const query = morphQL`
      from object to object
      transform
        define \`var-one\` = 100
        set result = \`var-one\` + 50
    `;
    const engine = await compile(query);
    const source = {};
    const result = engine(source);
    expect(result.result).toBe(150);
  });

  it('should support quoted identifiers in source access', async () => {
    const query = morphQL`
      from object to object
      transform
        set result = \`source-field\` * 2
    `;
    const engine = await compile(query);
    const source = { 'source-field': 21 };
    const result = engine(source);
    expect(result.result).toBe(42);
  });

  it('should support quoted identifiers in delete', async () => {
    const query = morphQL`
      from object to object
      transform
        clone
        delete \`restricted-field\`
    `;
    const engine = await compile(query);
    const source = { a: 1, 'restricted-field': 2 };
    const result = engine(source);
    expect(result.a).toBe(1);
    expect(result['restricted-field']).toBeUndefined();
  });

  it('should support quoted identifiers in sections', async () => {
    const query = morphQL`
      from object to object
      transform
        section multiple \`my-section\`(
           set val = id
        ) from \`my-list\`
    `;
    const engine = await compile(query);
    const source = { 'my-list': [{ id: 1 }, { id: 2 }, { id: 3 }] };
    const result = engine(source);
    expect(result['my-section']).toEqual([{ val: 1 }, { val: 2 }, { val: 3 }]);
  });

  it('should support escaped backticks within quoted identifiers', async () => {
    // MQL source: set `field\`name` = 1
    // We double-escape because this is a JS string
    const query = 'from object to object transform set `field\\`name` = 1';
    const engine = await compile(query);
    const source = {};
    const result = engine(source);
    expect(result['field`name']).toBe(1);
  });
});
