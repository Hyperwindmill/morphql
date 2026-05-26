import { describe, expect, it } from 'vitest';
import { decodeStringEscapes } from '../escape.js';

describe('decodeStringEscapes', () => {
  it('decodes \\\\ -> single backslash', () => {
    expect(decodeStringEscapes('\\\\')).toBe('\\');
  });

  it("decodes \\' -> apostrophe", () => {
    expect(decodeStringEscapes("\\\'")).toBe("'");
  });

  it('decodes \\" -> double quote', () => {
    expect(decodeStringEscapes('\\"')).toBe('"');
  });

  it('decodes \\n -> real newline', () => {
    expect(decodeStringEscapes('\\n')).toBe('\n');
  });

  it('decodes \\t -> real tab', () => {
    expect(decodeStringEscapes('\\t')).toBe('\t');
  });

  it('leaves plain strings unchanged', () => {
    expect(decodeStringEscapes('hello world')).toBe('hello world');
  });

  it('decodes \\\\ before \\n as backslash+n, not newline', () => {
    // \\n in JS source = two chars: backslash, n
    // decodeStringEscapes sees \\n -> \\ consumed first -> \ then n = \n (chars: backslash + n)
    expect(decodeStringEscapes('\\\\n')).toBe('\\n');
  });

  it('strips the backslash from out-of-scope escapes (no raw control bytes)', () => {
    // \b, \0, \q, etc. are NOT decoded to control chars — they yield the bare char.
    // This keeps the decode set symmetric with the MorphQL re-escape step.
    expect(decodeStringEscapes('\\b')).toBe('b');
    expect(decodeStringEscapes('\\0')).toBe('0');
    expect(decodeStringEscapes('\\q')).toBe('q');
  });
});
