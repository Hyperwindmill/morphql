import { FunctionDef } from "./types";

/**
 * MorphQL Functions - Single source of truth
 *
 * When adding a new function:
 * 1. Add it here
 * 2. Implement in @morphql/core/src/functions.ts
 * 3. Run build to regenerate VSCode/Monaco configs
 */
export const FUNCTIONS: FunctionDef[] = [
  {
    name: "substring",
    doc: {
      signature: "substring(str, start, [length])",
      description: "Extracts a portion of a string. Supports negative indices.",
      parameters: [
        { name: "str", description: "The source string" },
        {
          name: "start",
          description: "Starting index (0-based, negative counts from end)",
        },
        {
          name: "length",
          description: "(Optional) Number of characters to extract",
        },
      ],
      returns: "string",
      example:
        'substring("Hello World", 0, 5)  // "Hello"\nsubstring("Hello World", -5)     // "World"',
    },
  },
  {
    name: "split",
    doc: {
      signature: "split(str, [separator], [limit])",
      description: "Splits a string into an array.",
      parameters: [
        { name: "str", description: "The string to split" },
        {
          name: "separator",
          description: '(Optional) Delimiter string. Default: ""',
        },
        { name: "limit", description: "(Optional) Maximum number of splits" },
      ],
      returns: "array",
      example: 'split("a,b,c", ",")  // ["a", "b", "c"]',
    },
  },
  {
    name: "replace",
    doc: {
      signature: "replace(str, search, replacement)",
      description: "Replaces occurrences in a string.",
      parameters: [
        { name: "str", description: "The source string" },
        { name: "search", description: "The substring to find" },
        { name: "replacement", description: "The replacement string" },
      ],
      returns: "string",
      example: 'replace("Hello World", "World", "MorphQL")  // "Hello MorphQL"',
    },
  },
  {
    name: "text",
    doc: {
      signature: "text(value)",
      description: "Converts a value to a string.",
      parameters: [{ name: "value", description: "The value to convert" }],
      returns: "string",
      example: 'text(123)  // "123"',
    },
  },
  {
    name: "number",
    doc: {
      signature: "number(value)",
      description: "Converts a value to a number.",
      parameters: [{ name: "value", description: "The value to convert" }],
      returns: "number",
      example: 'number("42")  // 42',
    },
  },
  {
    name: "uppercase",
    doc: {
      signature: "uppercase(str)",
      description: "Converts a string to uppercase.",
      parameters: [{ name: "str", description: "The string to convert" }],
      returns: "string",
      example: 'uppercase("hello")  // "HELLO"',
    },
  },
  {
    name: "lowercase",
    doc: {
      signature: "lowercase(str)",
      description: "Converts a string to lowercase.",
      parameters: [{ name: "str", description: "The string to convert" }],
      returns: "string",
      example: 'lowercase("HELLO")  // "hello"',
    },
  },
  {
    name: "extractnumber",
    doc: {
      signature: "extractnumber(str)",
      description: "Extracts the first numeric sequence from a string.",
      parameters: [{ name: "str", description: "The string to extract from" }],
      returns: "number",
      example: 'extractnumber("Price: 100USD")  // 100',
    },
  },
  {
    name: "xmlnode",
    doc: {
      signature: "xmlnode(value, [attrKey, attrVal, ...])",
      description: "Wraps a value for XML output with optional attributes.",
      parameters: [
        { name: "value", description: "The node content" },
        {
          name: "attrKey, attrVal",
          description: "(Optional) Pairs of attribute keys and values",
        },
      ],
      returns: "XML node",
      example: 'xmlnode(content, "id", 1, "type", "text")',
    },
  },
  {
    name: "to_base64",
    doc: {
      signature: "to_base64(value)",
      description: "Encodes a string value to Base64.",
      parameters: [{ name: "value", description: "The string to encode" }],
      returns: "string",
      example: 'to_base64("hello")  // "aGVsbG8="',
    },
  },
  {
    name: "from_base64",
    doc: {
      signature: "from_base64(value)",
      description: "Decodes a Base64 string value.",
      parameters: [
        { name: "value", description: "The Base64 string to decode" },
      ],
      returns: "string",
      example: 'from_base64("aGVsbG8=")  // "hello"',
    },
  },
  {
    name: "aslist",
    doc: {
      signature: "aslist(value)",
      description:
        "Ensures a value is an array. Useful for input formats like XML that might return a single object or an array for the same field.",
      parameters: [{ name: "value", description: "The value to normalize" }],
      returns: "array",
      example: "aslist(items)  // Always returns an array",
    },
  },
  {
    name: "spreadsheet",
    doc: {
      signature: "spreadsheet(data)",
      description:
        "Converts spreadsheet-style data (array of arrays) into an array of objects with named properties. First row is treated as headers.",
      parameters: [{ name: "data", description: "Array of arrays (rows)" }],
      returns: "array of objects",
      example:
        'spreadsheet(csvData)  // Converts [["name","age"],["John",30]] to [{name:"John",age:30}]',
    },
  },
  {
    name: "unpack",
    doc: {
      signature: "unpack(str, fieldSpec1, [fieldSpec2, ...])",
      description:
        'Extracts multiple fields from a fixed-length string into an object. Specs follow the pattern "name:start:length[:modifier]".',
      parameters: [
        { name: "str", description: "The fixed-length string to unpack" },
        {
          name: "fieldSpec",
          description:
            'Field definition: "name:start:length". Optional ":raw" modifier at the end disables auto-trimming.',
        },
      ],
      returns: "object",
      example: 'unpack(source, "id:0:5", "name:5:20", "padding:25:5:raw")',
    },
  },
  {
    name: "pack",
    doc: {
      signature: "pack(obj, fieldSpec1, [fieldSpec2, ...])",
      description:
        'Encodes an object into a fixed-length string using field specifications. Specs follow the pattern "name:start:length[:modifier]".',
      parameters: [
        { name: "obj", description: "The object containing data to pack" },
        {
          name: "fieldSpec",
          description:
            'Field definition: "name:start:length". Optional ":left" modifier at the end uses left-padding (right-alignment).',
        },
      ],
      returns: "string",
      example: 'pack(target, "id:0:5:left", "name:5:20")',
    },
  },
  {
    name: "list",
    doc: {
      signature: "list(value1, [value2, ...])",
      description:
        "Creates an array from the given arguments. Useful for constructing nested structures in a single assignment.",
      parameters: [
        { name: "values", description: "Values to include in the array" },
      ],
      returns: "array",
      example: 'list("A", "B", list("C1", "C2"))  // ["A", "B", ["C1", "C2"]]',
    },
  },
  {
    name: "array",
    doc: {
      signature: "array(value1, [value2, ...])",
      description:
        "Alias for `list()`. Creates an array from the given arguments.",
      parameters: [
        { name: "values", description: "Values to include in the array" },
      ],
      returns: "array",
      example: "array(1, 2, 3)  // [1, 2, 3]",
    },
  },
  {
    name: "sum",
    doc: {
      signature: "sum(array, valueExpression)",
      description:
        "Sums a numeric expression evaluated per item across an array. null, undefined and non-numeric values are treated as 0.",
      parameters: [
        { name: "array", description: "The array to sum over" },
        {
          name: "valueExpression",
          description:
            "Expression evaluated for each item to extract the numeric value. Bare field names resolve against each item.",
        },
      ],
      returns: "number",
      example:
        "set total = sum(orders, amount)\nset discounted = sum(items, price * quantity)",
    },
  },
  {
    name: "groupby",
    doc: {
      signature: "groupby(array, keyExpression)",
      description:
        "Groups an array of items by a key expression evaluated per item. Returns an array of `{ key, items }` objects in insertion order. Typically used as the `from` source of a `section multiple`.",
      parameters: [
        { name: "array", description: "The array to group" },
        {
          name: "keyExpression",
          description:
            "Expression evaluated for each item to compute the group key. Bare field names resolve against each item.",
        },
      ],
      returns: "array of { key, items }",
      example:
        'section multiple byCategory(\n  set category = key\n  set count = length(items)\n  section multiple products(\n    set name = name\n  ) from items\n) from groupby(products, category)',
    },
  },

  // ── Math functions ────────────────────────────────────────────────────────
  {
    name: "floor",
    doc: {
      signature: "floor(value)",
      description: "Rounds a number down to the nearest integer.",
      parameters: [{ name: "value", description: "The number to round down" }],
      returns: "number",
      example: "floor(4.9)  // 4",
    },
  },
  {
    name: "ceil",
    doc: {
      signature: "ceil(value)",
      description: "Rounds a number up to the nearest integer.",
      parameters: [{ name: "value", description: "The number to round up" }],
      returns: "number",
      example: "ceil(4.1)  // 5",
    },
  },
  {
    name: "round",
    doc: {
      signature: "round(value, [mode])",
      description:
        'Rounds a number to the nearest integer. Mode controls tie-breaking: "half-up" (default) rounds .5 away from zero; "half-even" uses banker\'s rounding (rounds .5 to the nearest even integer).',
      parameters: [
        { name: "value", description: "The number to round" },
        {
          name: "mode",
          description:
            '(Optional) Rounding mode: "half-up" (default) or "half-even"',
        },
      ],
      returns: "number",
      example:
        'round(4.5)              // 5  (half-up)\nround(4.5, "half-even") // 4  (banker\'s)\nround(3.5, "half-even") // 4  (banker\'s)',
    },
  },
  {
    name: "abs",
    doc: {
      signature: "abs(value)",
      description: "Returns the absolute value of a number.",
      parameters: [{ name: "value", description: "The number" }],
      returns: "number",
      example: "abs(-42)  // 42",
    },
  },
  {
    name: "fixed",
    doc: {
      signature: "fixed(value, [decimals], [mode])",
      description:
        'Formats a number to a fixed number of decimal places. Mode controls tie-breaking: "half-up" (default) rounds .5 away from zero; "half-even" uses banker\'s rounding. Returns a string. Default decimals: 2.',
      parameters: [
        { name: "value", description: "The number to format" },
        {
          name: "decimals",
          description: "(Optional) Number of decimal places. Default: 2",
        },
        {
          name: "mode",
          description:
            '(Optional) Rounding mode: "half-up" (default) or "half-even"',
        },
      ],
      returns: "string",
      example:
        'fixed(2.5, 2)              // "2.50"  (half-up)\nfixed(2.5, 2, "half-even") // "2.50"  (banker\'s, no tie at 2 decimals)\nfixed(2.5, 0, "half-even") // "2"     (banker\'s, rounds to even)',
    },
  },
  {
    name: "min",
    doc: {
      signature: "min(a, b, ...)",
      description: "Returns the smallest of two or more numbers.",
      parameters: [{ name: "a, b, ...", description: "Numbers to compare" }],
      returns: "number",
      example: "min(3, 1, 4)  // 1",
    },
  },
  {
    name: "max",
    doc: {
      signature: "max(a, b, ...)",
      description: "Returns the largest of two or more numbers.",
      parameters: [{ name: "a, b, ...", description: "Numbers to compare" }],
      returns: "number",
      example: "max(3, 1, 4)  // 4",
    },
  },

  // ── String functions ──────────────────────────────────────────────────────
  {
    name: "trim",
    doc: {
      signature: "trim(str)",
      description: "Removes leading and trailing whitespace from a string.",
      parameters: [{ name: "str", description: "The string to trim" }],
      returns: "string",
      example: 'trim("  hello  ")  // "hello"',
    },
  },
  {
    name: "padstart",
    doc: {
      signature: "padstart(str, length, [char])",
      description:
        "Pads the start of a string with a character until it reaches the target length.",
      parameters: [
        { name: "str", description: "The string to pad" },
        { name: "length", description: "Target total length" },
        { name: "char", description: '(Optional) Pad character. Default: " "' },
      ],
      returns: "string",
      example: 'padstart(id, 8, "0")  // "00000042"',
    },
  },
  {
    name: "padend",
    doc: {
      signature: "padend(str, length, [char])",
      description:
        "Pads the end of a string with a character until it reaches the target length.",
      parameters: [
        { name: "str", description: "The string to pad" },
        { name: "length", description: "Target total length" },
        { name: "char", description: '(Optional) Pad character. Default: " "' },
      ],
      returns: "string",
      example: 'padend(name, 20)  // "Alice               "',
    },
  },
  {
    name: "indexof",
    doc: {
      signature: "indexof(str, search)",
      description:
        "Returns the index of the first occurrence of a substring. Returns -1 if not found.",
      parameters: [
        { name: "str", description: "The string to search in" },
        { name: "search", description: "The substring to find" },
      ],
      returns: "number",
      example: 'indexof("hello world", "world")  // 6',
    },
  },
  {
    name: "startswith",
    doc: {
      signature: "startswith(str, prefix)",
      description: "Returns true if the string starts with the given prefix.",
      parameters: [
        { name: "str", description: "The string to check" },
        { name: "prefix", description: "The prefix to look for" },
      ],
      returns: "boolean",
      example: 'startswith("hello", "he")  // true',
    },
  },
  {
    name: "endswith",
    doc: {
      signature: "endswith(str, suffix)",
      description: "Returns true if the string ends with the given suffix.",
      parameters: [
        { name: "str", description: "The string to check" },
        { name: "suffix", description: "The suffix to look for" },
      ],
      returns: "boolean",
      example: 'endswith("hello", "lo")  // true',
    },
  },
];

// Helper to get all function names
export const getFunctionNames = () => FUNCTIONS.map((f) => f.name);

// Helper to get function documentation
export const getFunctionDoc = (name: string) =>
  FUNCTIONS.find((f) => f.name.toLowerCase() === name.toLowerCase())?.doc;
