import { describe, it, expect } from 'vitest';
import { compile } from '../index';

describe('Advanced Extract Regression', () => {
  it('should support combining define and extract via list()', async () => {
    const query = `
      from object to object
      transform
        define INV_TYPE = "Invoice"
        define TRN_TYPE = "Transport Document"

        set documents = list(
          extract(source, "number:inv_number", "type:INV_TYPE"),
          extract(source, "number:trn_number", "type:TRN_TYPE")
        )
    `;
    const engine = await compile(query);
    const input = {
      inv_number: 'INV-2024-01',
      trn_number: 'TRN-9988',
      date: '2024-02-12',
    };

    // Test with frozen input
    const frozenInput = Object.freeze(input);
    const output = await engine(frozenInput);

    expect(output.documents).toEqual([
      { number: 'INV-2024-01', type: 'Invoice' },
      { number: 'TRN-9988', type: 'Transport Document' },
    ]);
  });
});
