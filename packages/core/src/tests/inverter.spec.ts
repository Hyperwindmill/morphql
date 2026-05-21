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

  it('should invert nested sections recursively', () => {
    const query = `from json to xml
transform
  section multiple items(
    set sku = itemSku
  ) from orderItems`;

    const expected = `from xml to json
transform
  section multiple orderItems(
    set itemSku = sku
  ) from items`;

    expect(invert(query).trim()).toBe(expected.trim());
  });

  it('should invert deeply nested sections', () => {
    const query = `from json to object
transform
  section multiple orders(
    set id = orderId
    section customer(
      set name = clientName
    ) from billing
  ) from data.sales`;

    const expected = `from object to json
transform
  section multiple data.sales(
    set orderId = id
    section billing(
      set clientName = name
    ) from customer
  ) from orders`;

    expect(invert(query).trim()).toBe(expected.trim());
  });
});
