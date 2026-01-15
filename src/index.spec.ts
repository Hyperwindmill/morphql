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

  it('should handle nested sections (arrays)', () => {
    const query = `
      from static as json to return as xml 
      transform 
        set name=fullName 
        section lines(
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
});
