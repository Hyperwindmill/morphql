import { describe, it, expect } from 'vitest';
import { getAdapter } from '../runtime/adapters';

describe('EDIFACT Adapter', () => {
  const adapter = getAdapter('edifact');

  it('should parse basic EDIFACT message', () => {
    const input = "UNB+IATB:1+6PPH:ZZ+140509:1358+1'UNH+1+PAXLST:D:97B:UN'BGM+745+987654321+9'";
    const parsed = adapter.parse(input);

    expect(parsed.UNB).toBeDefined();
    expect(parsed.UNB[0][0]).toEqual(['IATB', '1']);
    expect(parsed.UNB[0][1]).toEqual(['6PPH', 'ZZ']);
    expect(parsed.UNH[0][1]).toEqual(['PAXLST', 'D', '97B', 'UN']);
    expect(parsed.BGM[0][1]).toBe('987654321');
  });

  it('should parse EDIFACT with UNA segment', () => {
    const input = "UNA:+.? 'UNB+IATB:1+6PPH:ZZ+140509:1358+1'";
    const parsed = adapter.parse(input);

    expect(parsed.UNB).toBeDefined();
    expect(parsed.UNB[0][0]).toEqual(['IATB', '1']);
  });

  it('should handle release character (escaping)', () => {
    // Escape the element separator '+' with '?'
    const input = "MSG+Value with ?+ plus'";
    const parsed = adapter.parse(input);

    expect(parsed.MSG[0][0]).toBe('Value with + plus');
  });

  it('should serialize to EDIFACT', () => {
    const data = {
      UNB: [
        [
          ['IATB', '1'],
          ['6PPH', 'ZZ'],
        ],
      ],
      BGM: [['745', '987654321']],
    };
    const serialized = adapter.serialize(data);
    expect(serialized).toBe("UNB+IATB:1+6PPH:ZZ'BGM+745+987654321'");
  });

  it('should serialize with UNA segment if requested', () => {
    const data = {
      UNB: [[['IATB', '1']]],
    };
    const serialized = adapter.serialize(data, { includeUNA: true });
    expect(serialized).toContain("UNA:+.? '");
    expect(serialized).toContain("UNB+IATB:1'");
  });

  it('should escape separators during serialization', () => {
    const data = {
      MSG: [['Value with + plus']],
    };
    const serialized = adapter.serialize(data);
    expect(serialized).toBe("MSG+Value with ?+ plus'");
  });

  it('should handle newlines between segments', () => {
    const input = `UNB+IATB:1+6PPH:ZZ+140509:1358+1'
UNH+1+PAXLST:D:97B:UN'
BGM+745+987654321+9'`;
    const parsed = adapter.parse(input);

    expect(parsed.UNB).toBeDefined();
    expect(parsed.UNH).toBeDefined();
    expect(parsed.BGM).toBeDefined();
    expect(parsed.BGM[0][1]).toBe('987654321');
  });
});
