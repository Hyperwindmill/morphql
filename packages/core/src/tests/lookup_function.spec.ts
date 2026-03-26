import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('lookup()', async () => {
  it('returns matching value for a known key', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set label = lookup(status, "1:open", "2:validated", "3:posted")
    `);
    expect(engine({ status: '1' }).label).toBe('open');
    expect(engine({ status: '2' }).label).toBe('validated');
    expect(engine({ status: '3' }).label).toBe('posted');
  });

  it('returns null for unknown key', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set label = lookup(status, "1:open", "2:closed")
    `);
    expect(engine({ status: '99' }).label).toBeNull();
  });

  it('is case-insensitive (LOOKUP)', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set label = LOOKUP(code, "A:alpha", "B:beta")
    `);
    expect(engine({ code: 'A' }).label).toBe('alpha');
  });

  it('works with numeric field values (coerced to string key)', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set label = lookup(code, "1:one", "2:two")
    `);
    // Numeric 1 coerces to "1" in JS object key lookup
    expect(engine({ code: 1 }).label).toBe('one');
  });

  it('supports values that contain colons (only first colon is the separator)', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set label = lookup(key, "A:http://example.com", "B:ok")
    `);
    expect(engine({ key: 'A' }).label).toBe('http://example.com');
  });

  it('can be used inside if() for fallback', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        define mapped = lookup(status, "1:open", "2:closed")
        set label = if(mapped, mapped, "unknown")
    `);
    expect(engine({ status: '1' }).label).toBe('open');
    expect(engine({ status: '99' }).label).toBe('unknown');
  });

  it('throws at compile time for invalid spec (missing colon)', async () => {
    await expect(
      compile(morphQL`
        from object to object
        transform
          set label = lookup(status, "badspec")
      `)
    ).rejects.toThrow('Invalid lookup() spec');
  });

  it('throws at compile time with fewer than 2 arguments', async () => {
    await expect(
      compile(morphQL`
        from object to object
        transform
          set label = lookup(status)
      `)
    ).rejects.toThrow('lookup() requires at least 2 arguments');
  });
});
