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
];

// Helper to get all function names
export const getFunctionNames = () => FUNCTIONS.map((f) => f.name);

// Helper to get function documentation
export const getFunctionDoc = (name: string) =>
  FUNCTIONS.find((f) => f.name.toLowerCase() === name.toLowerCase())?.doc;
