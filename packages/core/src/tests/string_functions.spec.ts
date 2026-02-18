import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('String functions', async () => {
  describe('trim()', async () => {
    it('should remove leading and trailing whitespace', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = trim(value)
      `);
      expect(engine({ value: '  hello  ' }).result).toBe('hello');
      expect(engine({ value: '\t hello \n' }).result).toBe('hello');
      expect(engine({ value: 'no spaces' }).result).toBe('no spaces');
    });

    it('should work in expressions', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = trim(first) + " " + trim(last)
      `);
      expect(engine({ first: '  Alice ', last: ' Smith  ' }).result).toBe('Alice Smith');
    });
  });

  describe('padstart()', async () => {
    it('should pad with zeros by default space', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = padstart(value, 5)
      `);
      expect(engine({ value: 'ab' }).result).toBe('   ab');
    });

    it('should pad with a custom character', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = padstart(id, 8, "0")
      `);
      expect(engine({ id: '42' }).result).toBe('00000042');
      expect(engine({ id: '12345678' }).result).toBe('12345678'); // already at length
    });

    it('should not truncate strings longer than target length', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = padstart(value, 3, "0")
      `);
      expect(engine({ value: 'hello' }).result).toBe('hello');
    });
  });

  describe('padend()', async () => {
    it('should pad end with spaces by default', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = padend(value, 5)
      `);
      expect(engine({ value: 'ab' }).result).toBe('ab   ');
    });

    it('should pad end with a custom character', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = padend(name, 10, "-")
      `);
      expect(engine({ name: 'Alice' }).result).toBe('Alice-----');
    });
  });

  describe('indexof()', async () => {
    it('should return the index of a found substring', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = indexof(value, search)
      `);
      expect(engine({ value: 'hello world', search: 'world' }).result).toBe(6);
      expect(engine({ value: 'hello world', search: 'hello' }).result).toBe(0);
    });

    it('should return -1 when not found', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = indexof(value, "xyz")
      `);
      expect(engine({ value: 'hello world' }).result).toBe(-1);
    });

    it('should be usable in conditions', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set hasPrefix = indexof(value, "SKU-") == 0
      `);
      expect(engine({ value: 'SKU-12345' }).hasPrefix).toBe(true);
      expect(engine({ value: '12345' }).hasPrefix).toBe(false);
    });
  });

  describe('startswith()', async () => {
    it('should return true when string starts with prefix', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = startswith(value, prefix)
      `);
      expect(engine({ value: 'hello world', prefix: 'hello' }).result).toBe(true);
      expect(engine({ value: 'hello world', prefix: 'world' }).result).toBe(false);
    });

    it('should work with literal prefix', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set isSku = startswith(code, "SKU-")
      `);
      expect(engine({ code: 'SKU-12345' }).isSku).toBe(true);
      expect(engine({ code: 'PROD-12345' }).isSku).toBe(false);
    });

    it('should work in if conditions', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set type = if(startswith(code, "SKU-"), "product", "other")
      `);
      expect(engine({ code: 'SKU-001' }).type).toBe('product');
      expect(engine({ code: 'CAT-001' }).type).toBe('other');
    });
  });

  describe('endswith()', async () => {
    it('should return true when string ends with suffix', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set result = endswith(value, suffix)
      `);
      expect(engine({ value: 'hello world', suffix: 'world' }).result).toBe(true);
      expect(engine({ value: 'hello world', suffix: 'hello' }).result).toBe(false);
    });

    it('should work with literal suffix', async () => {
      const engine = await compile(morphQL`
        from object to object
        transform
          set isXml = endswith(filename, ".xml")
      `);
      expect(engine({ filename: 'invoice.xml' }).isXml).toBe(true);
      expect(engine({ filename: 'invoice.json' }).isXml).toBe(false);
    });
  });
});
