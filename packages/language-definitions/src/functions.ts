import { FunctionDef } from "./types";

/**
 * MQL Functions - Single source of truth
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
      example: 'replace("Hello World", "World", "MQL")  // "Hello MQL"',
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
        "Ensures a value is an array. Useful for XML nodes that might be a single object or an array.",
      parameters: [{ name: "value", description: "The value to normalize" }],
      returns: "array",
      example: "aslist(items)  // Always returns an array",
    },
  },
];

// Helper to get all function names
export const getFunctionNames = () => FUNCTIONS.map((f) => f.name);

// Helper to get function documentation
export const getFunctionDoc = (name: string) =>
  FUNCTIONS.find((f) => f.name.toLowerCase() === name.toLowerCase())?.doc;
