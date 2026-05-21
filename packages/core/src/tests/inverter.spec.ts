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

  it('should handle constants, clone, delete, define, modify, conditionals, and concat heuristics', () => {
    const query = `from json to xml
transform
  clone(a, b)
  delete c
  modify x = y
  define myVar = 123
  set status = "active"
  set fullName = firstName + " " + lastName
  if (flag) (
    set active = isAct
  ) else (
    set statusStr = oldStatus
  )`;

    const expected = `from xml to json
transform
  clone(a, b)
  // TODO: 'c' was deleted in target. Re-supply or handle manually.
  // set c = ...
  // TODO: Check manual inversion for target modification
  // modify x = y
  // define myVar = 123 (Local variable - review manually)
  // set status = "active" (Constant - skipped in inverse)
  // TODO (Heuristic Inversion): 'fullName' is a concatenation.
  // Please refine this extraction logic:
  //   set firstName = split(fullName, " ")[0]
  //   set lastName = split(fullName, " ")[1]
  if (flag) (
    set isAct = active
  ) else (
    set oldStatus = statusStr
  )`;

    const inverted = invert(query);
    expect(inverted.trim()).toBe(expected.trim());
  });
});
