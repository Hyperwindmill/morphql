import { describe, it, expect } from 'vitest';
import { parse, morphQL } from '../index.js';
import type {
  ParsedSetAction,
  ParsedModifyAction,
  ParsedDeleteAction,
  ParsedDefineAction,
  ParsedCloneAction,
  ParsedSectionAction,
  ParsedIfAction,
  ParsedReturnAction,
} from '../index.js';

// ─── helpers ──────────────────────────────────────────────────────────────────

function set(target: string, expression: string): ParsedSetAction {
  return { type: 'set', target, expression };
}
function modify(target: string, expression: string): ParsedModifyAction {
  return { type: 'modify', target, expression };
}
function del(field: string): ParsedDeleteAction {
  return { type: 'delete', field };
}
function define(variable: string, expression: string): ParsedDefineAction {
  return { type: 'define', variable, expression };
}
function ret(expression: string): ParsedReturnAction {
  return { type: 'return', expression };
}

// ─── from / to ────────────────────────────────────────────────────────────────

describe('parse() — from / to', () => {
  it('parses bare from/to with no transform block', () => {
    const ast = parse('from json to xml');
    expect(ast.from).toBe('json');
    expect(ast.to).toBe('xml');
    expect(ast.unsafe).toBeUndefined();
    expect(ast.actions).toEqual([]);
  });

  it('parses from/to with empty transform block', () => {
    const ast = parse('from csv to object transform');
    expect(ast.from).toBe('csv');
    expect(ast.to).toBe('object');
    expect(ast.actions).toEqual([]);
  });

  it('result is JSON-serializable', () => {
    const ast = parse('from json to xml');
    expect(() => JSON.stringify(ast)).not.toThrow();
    const roundTripped = JSON.parse(JSON.stringify(ast));
    expect(roundTripped).toEqual(ast);
  });
});

// ─── unsafe ───────────────────────────────────────────────────────────────────

describe('parse() — unsafe', () => {
  it('sets unsafe when "transform unsafe" is used', () => {
    const ast = parse(morphQL`
      from json to xml
      transform unsafe
        set name = firstName
    `);
    expect(ast.unsafe).toBe(true);
    expect(ast.from).toBe('json');
    expect(ast.to).toBe('xml');
  });

  it('does not set unsafe without the keyword', () => {
    const ast = parse('from json to xml transform set x = y');
    expect(ast.unsafe).toBeUndefined();
  });
});

// ─── set ──────────────────────────────────────────────────────────────────────

describe('parse() — set', () => {
  it('parses a simple set', () => {
    const ast = parse('from object to object transform set name = firstName');
    expect(ast.actions).toEqual([set('name', 'firstName')]);
  });

  it('parses set with string concatenation', () => {
    const ast = parse(morphQL`
      from object to object
      transform
        set fullName = firstName + " " + lastName
    `);
    expect(ast.actions[0]).toEqual(set('fullName', 'firstName + " " + lastName'));
  });

  it('parses set with numeric literal', () => {
    const ast = parse('from object to object transform set count = 42');
    expect(ast.actions[0]).toEqual(set('count', '42'));
  });

  it('parses set with boolean literal', () => {
    const ast = parse('from object to object transform set active = true');
    expect(ast.actions[0]).toEqual(set('active', 'true'));
  });

  it('parses set with function call', () => {
    const ast = parse('from object to object transform set price = number(rawPrice)');
    expect(ast.actions[0]).toEqual(set('price', 'number(rawPrice)'));
  });

  it('parses set with dotted path', () => {
    const ast = parse('from object to object transform set name = user.profile.name');
    expect(ast.actions[0]).toEqual(set('name', 'user.profile.name'));
  });

  it('parses multiple set actions', () => {
    const ast = parse(morphQL`
      from object to object
      transform
        set a = x
        set b = y
        set c = z
    `);
    expect(ast.actions).toEqual([set('a', 'x'), set('b', 'y'), set('c', 'z')]);
  });
});

// ─── modify / delete / define / return ───────────────────────────────────────

describe('parse() — modify / delete / define / return', () => {
  it('parses modify', () => {
    const ast = parse('from object to object transform modify price = price + 10');
    expect(ast.actions[0]).toEqual(modify('price', 'price + 10'));
  });

  it('parses delete', () => {
    const ast = parse('from object to object transform delete secret');
    expect(ast.actions[0]).toEqual(del('secret'));
  });

  it('parses define', () => {
    const ast = parse('from object to object transform define tax = price * 0.2');
    expect(ast.actions[0]).toEqual(define('tax', 'price * 0.2'));
  });

  it('parses return', () => {
    const ast = parse('from object to object transform return target');
    expect(ast.actions[0]).toEqual(ret('target'));
  });
});

// ─── clone ────────────────────────────────────────────────────────────────────

describe('parse() — clone', () => {
  it('parses full clone (no fields)', () => {
    const ast = parse('from object to object transform clone');
    const action = ast.actions[0] as ParsedCloneAction;
    expect(action.type).toBe('clone');
    expect(action.fields).toBeUndefined();
  });

  it('parses clone with a single field', () => {
    const ast = parse('from object to object transform clone(name)');
    const action = ast.actions[0] as ParsedCloneAction;
    expect(action).toEqual({ type: 'clone', fields: ['name'] });
  });

  it('parses clone(fields) with multiple fields', () => {
    const ast = parse('from object to object transform clone(firstName, lastName, email)');
    const action = ast.actions[0] as ParsedCloneAction;
    expect(action).toEqual({ type: 'clone', fields: ['firstName', 'lastName', 'email'] });
  });
});

// ─── if / else ────────────────────────────────────────────────────────────────

describe('parse() — if / else', () => {
  it('parses if without else', () => {
    const ast = parse(morphQL`
      from object to object
      transform
        if (isPremium) (
          set discount = 20
        )
    `);
    const action = ast.actions[0] as ParsedIfAction;
    expect(action.type).toBe('if');
    expect(action.condition).toBe('isPremium');
    expect(action.thenActions).toEqual([set('discount', '20')]);
    expect(action.elseActions).toBeUndefined();
  });

  it('parses if-else', () => {
    const ast = parse(morphQL`
      from object to object
      transform
        if (age >= 18) (
          set type = "adult"
        ) else (
          set type = "minor"
        )
    `);
    const action = ast.actions[0] as ParsedIfAction;
    expect(action.type).toBe('if');
    expect(action.condition).toBe('age >= 18');
    expect(action.thenActions).toEqual([set('type', '"adult"')]);
    expect(action.elseActions).toEqual([set('type', '"minor"')]);
  });

  it('parses if-else with compound condition', () => {
    const ast = parse(morphQL`
      from object to object
      transform
        if (val > 10 && val < 20) (
          set range = "medium"
        ) else (
          set range = "other"
        )
    `);
    const action = ast.actions[0] as ParsedIfAction;
    expect(action.condition).toBe('val > 10 && val < 20');
  });

  it('parses nested if blocks', () => {
    const ast = parse(morphQL`
      from object to object
      transform
        if (active) (
          set status = "active"
          if (role == "admin") (
            set access = "full"
          ) else (
            set access = "limited"
          )
        ) else (
          set status = "inactive"
        )
    `);
    const outer = ast.actions[0] as ParsedIfAction;
    expect(outer.condition).toBe('active');
    expect(outer.thenActions).toHaveLength(2);
    const inner = outer.thenActions[1] as ParsedIfAction;
    expect(inner.type).toBe('if');
    expect(inner.condition).toBe('role == "admin"');
  });
});

// ─── section ──────────────────────────────────────────────────────────────────

describe('parse() — section', () => {
  it('parses a simple section with no from / where', () => {
    const ast = parse(morphQL`
      from json to object
      transform
        section header(
          set id = id
          set name = name
        )
    `);
    const action = ast.actions[0] as ParsedSectionAction;
    expect(action.type).toBe('section');
    expect(action.name).toBe('header');
    expect(action.multiple).toBeUndefined();
    expect(action.from).toBeUndefined();
    expect(action.where).toBeUndefined();
    expect(action.actions).toEqual([set('id', 'id'), set('name', 'name')]);
  });

  it('parses section with from expression', () => {
    const ast = parse(morphQL`
      from json to object
      transform
        section meta(
          set version = v
        ) from info
    `);
    const action = ast.actions[0] as ParsedSectionAction;
    expect(action.from).toBe('info');
  });

  it('parses section multiple (array) without from', () => {
    const ast = parse(morphQL`
      from json to object
      transform
        section multiple lines(
          set lineNo = id
        )
    `);
    const action = ast.actions[0] as ParsedSectionAction;
    expect(action.name).toBe('lines');
    expect(action.multiple).toBe(true);
    expect(action.actions).toEqual([set('lineNo', 'id')]);
  });

  it('parses section multiple with from expression', () => {
    const ast = parse(morphQL`
      from json to object
      transform
        section multiple items(
          set v = val
        ) from rawData
    `);
    const action = ast.actions[0] as ParsedSectionAction;
    expect(action.multiple).toBe(true);
    expect(action.from).toBe('rawData');
    expect(action.name).toBe('items');
  });

  it('parses section with where clause', () => {
    const ast = parse(morphQL`
      from json to object
      transform
        section multiple activeItems(
          set id = id
        ) from items where active == true
    `);
    const action = ast.actions[0] as ParsedSectionAction;
    expect(action.where).toBe('active == true');
    expect(action.from).toBe('items');
  });

  it('parses nested sections', () => {
    const ast = parse(morphQL`
      from json to object
      transform
        section order(
          set orderId = orderId
          section multiple items(
            set sku = itemSku
          ) from products
        )
    `);
    const outer = ast.actions[0] as ParsedSectionAction;
    expect(outer.name).toBe('order');
    expect(outer.actions).toHaveLength(2);
    const inner = outer.actions[1] as ParsedSectionAction;
    expect(inner.type).toBe('section');
    expect(inner.multiple).toBe(true);
    expect(inner.name).toBe('items');
    expect(inner.from).toBe('products');
  });
});

// ─── subquery section ─────────────────────────────────────────────────────────

describe('parse() — subquery section', () => {
  it('parses a subquery section with from/to in body', () => {
    const ast = parse(morphQL`
      from json to object
      transform
        section metadata(
          from xml to object
          transform
            set name = root.productName
        ) from xmlString
    `);
    const action = ast.actions[0] as ParsedSectionAction;
    expect(action.isSubquery).toBe(true);
    expect(action.sourceFormat).toBe('xml');
    expect(action.targetFormat).toBe('object');
    expect(action.from).toBe('xmlString');
    expect(action.actions).toEqual([set('name', 'root.productName')]);
  });

  it('parses multiple (array) subquery section', () => {
    const ast = parse(morphQL`
      from json to object
      transform
        section multiple items(
          from xml to object
          transform
            set name = product.name
        ) from xmlItems
    `);
    const action = ast.actions[0] as ParsedSectionAction;
    expect(action.multiple).toBe(true);
    expect(action.isSubquery).toBe(true);
    expect(action.sourceFormat).toBe('xml');
    expect(action.targetFormat).toBe('object');
    expect(action.from).toBe('xmlItems');
  });
});

// ─── expression reconstruction ────────────────────────────────────────────────

describe('parse() — expression reconstruction', () => {
  it('preserves logical OR', () => {
    const ast = parse('from object to object transform set x = a || b');
    expect((ast.actions[0] as ParsedSetAction).expression).toBe('a || b');
  });

  it('preserves logical AND', () => {
    const ast = parse('from object to object transform set x = a && b');
    expect((ast.actions[0] as ParsedSetAction).expression).toBe('a && b');
  });

  it('preserves comparison operators', () => {
    const cases: [string, string][] = [
      ['a == b', 'a == b'],
      ['a != b', 'a != b'],
      ['a >= b', 'a >= b'],
      ['a <= b', 'a <= b'],
    ];
    for (const [expr, expected] of cases) {
      const ast = parse(`from object to object transform set x = ${expr}`);
      expect((ast.actions[0] as ParsedSetAction).expression).toBe(expected);
    }
  });

  it('preserves unary negation', () => {
    const ast = parse('from object to object transform set x = -price');
    expect((ast.actions[0] as ParsedSetAction).expression).toBe('-price');
  });

  it('preserves NOT operator', () => {
    const ast = parse('from object to object transform set x = !active');
    expect((ast.actions[0] as ParsedSetAction).expression).toBe('!active');
  });

  it('preserves parenthesised expressions', () => {
    const ast = parse('from object to object transform set x = (a + b) * c');
    expect((ast.actions[0] as ParsedSetAction).expression).toBe('(a + b) * c');
  });

  it('preserves function calls with multiple args', () => {
    const ast = parse('from object to object transform set x = substring(name, 0, 5)');
    expect((ast.actions[0] as ParsedSetAction).expression).toBe('substring(name, 0, 5)');
  });

  it('preserves quoted (backtick) identifiers', () => {
    const ast = parse('from object to object transform set x = `my-field`');
    expect((ast.actions[0] as ParsedSetAction).expression).toBe('`my-field`');
  });
});

// ─── error handling ───────────────────────────────────────────────────────────

describe('parse() — error handling', () => {
  it('throws a readable error on syntax error', () => {
    expect(() => parse('from json to')).toThrow();
  });

  it('throws an Error instance on syntax error', () => {
    expect(() => parse('from json to')).toThrowError(Error);
  });

  it('error message contains useful text', () => {
    try {
      parse('from json to');
    } catch (e: any) {
      expect(typeof e.message).toBe('string');
      expect(e.message.length).toBeGreaterThan(0);
    }
  });
});
