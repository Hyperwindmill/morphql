import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('fromUnix() and toUnix()', async () => {
  it('fromUnix("0") returns epoch ISO string', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set ts = fromUnix(unix)
    `);
    const result = engine({ unix: '0' });
    expect(result.ts).toBe('1970-01-01T00:00:00.000Z');
  });

  it('fromUnix converts unix timestamp string to ISO 8601', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set ts = fromUnix(unix)
    `);
    const result = engine({ unix: '1711468800' });
    expect(result.ts).toBe('2024-03-26T16:00:00.000Z');
  });

  it('fromUnix is case-insensitive', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set ts = FROMUNIX(unix)
    `);
    const result = engine({ unix: '0' });
    expect(result.ts).toBe('1970-01-01T00:00:00.000Z');
  });

  it('toUnix("1970-01-01T00:00:00.000Z") returns "0"', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set unix = toUnix(iso)
    `);
    const result = engine({ iso: '1970-01-01T00:00:00.000Z' });
    expect(result.unix).toBe('0');
  });

  it('toUnix converts ISO 8601 string to unix timestamp string', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set unix = toUnix(iso)
    `);
    const result = engine({ iso: '2024-03-26T16:00:00.000Z' });
    expect(result.unix).toBe('1711468800');
  });

  it('fromUnix and toUnix form a round-trip', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set roundtrip = toUnix(fromUnix(unix))
    `);
    const result = engine({ unix: '1711468800' });
    expect(result.roundtrip).toBe('1711468800');
  });

  it('fromUnix returns null for null input', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set ts = fromUnix(missing)
    `);
    const result = engine({});
    expect(result.ts).toBeNull();
  });

  it('toUnix returns null for null input', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set unix = toUnix(missing)
    `);
    const result = engine({});
    expect(result.unix).toBeNull();
  });

  it('fromUnix works inside if() for null guarding', async () => {
    const engine = await compile(morphQL`
      from object to object
      transform
        set ts = if(unix, fromUnix(unix), null)
    `);
    expect(engine({ unix: '1711468800' }).ts).toBe('2024-03-26T16:00:00.000Z');
    expect(engine({ unix: null }).ts).toBeNull();
  });
});
