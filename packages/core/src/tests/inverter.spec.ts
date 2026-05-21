import { describe, it, expect } from 'vitest';
import { invert } from '../index.js';

describe('MorphQL Inverter', () => {
  it('should invert simple 1-to-1 queries and header', () => {
    const query = `from json to xml
transform
  set id = orderId
  set name = firstName`;

    const expected = `from xml to json
transform
  set orderId = id
  set firstName = name`;

    expect(invert(query).trim()).toBe(expected.trim());
  });
});
