import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Morph Engine - Unpack and Pack Functions', async () => {
  describe('unpack()', () => {
    it('should extract fields from a fixed-length string and trim by default', async () => {
      const query = morphQL`
        from object to object
        transform
          set result = unpack(source, "name:0:10", "age:10:3", "city:13:10")
      `;
      const transform = await compile(query);
      const input = 'John Doe  025New York  ';
      const result = transform(input);

      expect(result.result).toEqual({
        name: 'John Doe',
        age: '025',
        city: 'New York',
      });
    });

    it('should extract fields without trimming when :raw is specified', async () => {
      const query = morphQL`
        from object to object
        transform
          set result = unpack(source, "name:0:10:raw", "padding:10:5:raw")
      `;
      const transform = await compile(query);
      const input = 'John Doe       ';
      const result = transform(input);

      expect(result.result).toEqual({
        name: 'John Doe  ',
        padding: '     ',
      });
    });

    it('should handle multi-record type extraction with conditional logic', async () => {
      const query = morphQL`
        from plaintext to object
        transform
          section multiple records (
            if (substring(source, 0, 2) == "01") (
              set data = unpack(source, "header:2:10")
              set kind = "H"
            ) else (
              set data = unpack(source, "detail:2:10")
              set kind = "D"
            )
          ) from rows
      `;
      const transform = await compile(query);
      const input = '01Header1   \n02Detail1   ';
      const result = transform(input);

      expect(result.records).toEqual([
        { kind: 'H', data: { header: 'Header1' } },
        { kind: 'D', data: { detail: 'Detail1' } },
      ]);
    });

    it('should throw error on malformed spec', async () => {
      const query = morphQL`
        from object to object
        transform
          set result = unpack(source, "invalid-spec")
      `;
      await expect(compile(query)).rejects.toThrow(/Invalid field spec for unpack()/);
    });
  });

  describe('pack()', () => {
    it('should build a fixed-length string with right-padding by default', async () => {
      const query = morphQL`
        from object to object
        transform
          set result = pack(source, "name:0:10", "dept:10:10")
      `;
      const transform = await compile(query);
      const input = { name: 'Alice', dept: 'IT' };
      const result = transform(input);

      expect(result.result).toBe('Alice     IT        ');
    });

    it('should build a fixed-length string with left-padding when :left is specified', async () => {
      const query = morphQL`
        from object to object
        transform
          set result = pack(source, "name:0:10", "id:10:5:left")
      `;
      const transform = await compile(query);
      const input = { name: 'Bob', id: '123' };
      const result = transform(input);

      // name: "Bob       " (10)
      // id:   "  123" (5)
      // total: 15 chars
      expect(result.result).toBe('Bob         123');
    });

    it('should truncate values that are too long', async () => {
      const query = morphQL`
        from object to object
        transform
          set result = pack(source, "long:0:5")
      `;
      const transform = await compile(query);
      const input = { long: '123456789' };
      const result = transform(input);

      expect(result.result).toBe('12345');
    });

    it('should handle complex multi-record formatting', async () => {
      const query = morphQL`
        from object to plaintext
        transform
          section multiple rows (
             if (type == "H") (
                return pack(source, "codeH:0:2", "val:2:5")
             ) else (
                return pack(source, "codeD:0:2", "val:2:5")
             )
          ) from parent
      `;
      const transform = await compile(query);
      const input = [
        { type: 'H', codeH: '01', val: 'HDR' },
        { type: 'D', codeD: '02', val: 'DET' },
      ];
      const result = transform(input);
      expect(result).toBe('01HDR  \n02DET  ');
    });
  });
});
