import { describe, it, expect } from 'vitest';
import { compile, morphQL } from '../index.js';

describe('Array Analysis Support', () => {
  it('should represent array indexing as nested segments in source analysis', async () => {
    const query = morphQL`
      from object to object
      transform
        set field = items[0]
    `;
    const engine = await compile(query, { analyze: true });

    // items should be an array, with its items being 'any' (since we accessed a generic index)
    expect(engine.analysis.source.properties?.items.type).toBe('array');
    expect(engine.analysis.source.properties?.items.items.type).toBe('any');
  });

  it('should handle nested array indexing (Edifact style)', async () => {
    const query = morphQL`
      from edifact to object
      transform
        set val = BGM[0][1]
    `;
    const engine = await compile(query, { analyze: true });

    // BGM should be an array of arrays
    const bgm = engine.analysis.source.properties?.BGM;
    expect(bgm.type).toBe('array');
    expect(bgm.items.type).toBe('array');
    expect(bgm.items.items.type).toBe('any');
  });

  it('should handle mixed object and array indexing', async () => {
    const query = morphQL`
      from json to object
      transform
        set val = data.list[0].nestedField
    `;
    const engine = await compile(query, { analyze: true });

    const data = engine.analysis.source.properties?.data;
    expect(data.type).toBe('object');
    expect(data.properties?.list.type).toBe('array');
    expect(data.properties?.list.items.properties?.nestedField).toBeDefined();
  });

  it('should handle Edifact complex mapping correctly', async () => {
    const query = morphQL`
      from edifact to object
      transform
        set invoiceNumber = BGM[0][1]
        section multiple items(
          set quantity = number(QTY[0][1])
        ) from transpose(_source, "LIN", "QTY", "MOA")
    `;
    const engine = await compile(query, { analyze: true });

    // Check BGM structure
    expect(engine.analysis.source.properties?.BGM.items.items.type).toBe('any');

    // Check QTY structure (recorded inside section from root access)
    expect(engine.analysis.source.properties?.QTY.items.items.type).toBe('any');
  });
});
