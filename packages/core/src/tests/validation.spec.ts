import { describe, it, expect } from 'vitest';
import { compile } from '../index';

describe('pack/unpack validation', () => {
  it('should throw Error for invalid field names in unpack()', async () => {
    const query = `
      from plaintext to object
      transform
        set data = unpack(source, "invalid-name:0:10")
    `;
    // Currently this might compile but produce invalid JS or dangerous keys
    // We want it to throw a clear error during compilation
    await expect(compile(query)).rejects.toThrow(/Invalid field name/);
  });

  it('should throw Error for invalid field names in pack()', async () => {
    const query = `
      from object to plaintext
      transform
        return pack(source, "field with spaces:0:10")
    `;
    // This definitely crashes because it tries to create "const val_field with spaces = ..."
    await expect(compile(query)).rejects.toThrow(/Invalid field name/);
  });

  it('should throw Error for malicious field names in unpack()', async () => {
    const query = `
      from plaintext to object
      transform
        set data = unpack(source, 'foo": "bar", "baz:0:10')
    `;
    await expect(compile(query)).rejects.toThrow(/Invalid field name/);
  });
});
