import { KeywordDef } from "./types";

/**
 * MQL Keywords - Single source of truth
 *
 * When adding a new keyword:
 * 1. Add it here
 * 2. Update the lexer in @morphql/core
 * 3. Run build to regenerate VSCode/Monaco configs
 */
export const KEYWORDS: KeywordDef[] = [
  {
    name: "from",
    category: "control",
    doc: {
      signature: "from <format>",
      description: "Specifies the input data format.",
      parameters: [
        {
          name: "format",
          description:
            "If used as first keyword: The starting format, one of `json`, `xml`, or `object`. When used after a section, defines its source",
        },
      ],
      example: "from json to xml",
    },
  },
  {
    name: "to",
    category: "control",
    doc: {
      signature: "to <format>",
      description: "Specifies the output data format.",
      parameters: [
        { name: "format", description: "One of: `json`, `xml`, or `object`" },
      ],
      example: "from json to xml",
    },
  },
  {
    name: "transform",
    category: "control",
    doc: {
      signature: "transform",
      description: "Begins the transformation block containing actions.",
      example: "transform\n  set name = firstName",
    },
  },
  {
    name: "set",
    category: "action",
    doc: {
      signature: "set <target> = <expression>",
      description: "Assigns a value to a field in the output.",
      parameters: [
        { name: "target", description: "The field name to set" },
        {
          name: "expression",
          description: "The value or expression to assign",
        },
      ],
      example: 'set fullName = firstName + " " + lastName',
    },
  },
  {
    name: "section",
    category: "action",
    doc: {
      signature:
        "section [multiple] <name>( [subquery] <actions> ) [from <path>]",
      description:
        "Creates a nested object or array in the output. Can optionally include a subquery for format conversion.",
      parameters: [
        { name: "multiple", description: "(Optional) Treat as array mapping" },
        { name: "name", description: "The section/field name" },
        {
          name: "subquery",
          description:
            "(Optional) Nested query: from <format> to <format> [transform]",
        },
        {
          name: "actions",
          description: "Actions to perform within the section",
        },
        {
          name: "from",
          description: "(Optional) Source path for the section data",
        },
      ],
      example:
        "section metadata(\n  from xml to object\n  transform\n    set name = root.productName\n) from xmlString",
    },
  },
  {
    name: "multiple",
    category: "action",
    doc: {
      signature: "section multiple <name>(...)",
      description: "Modifier for `section` to map over an array.",
      example: "section multiple items(\n  set id = itemId\n) from products",
    },
  },
  {
    name: "clone",
    category: "action",
    doc: {
      signature: "clone([field1, field2, ...])",
      description: "Copies fields from the source to the output.",
      parameters: [
        {
          name: "fields",
          description:
            "(Optional) Specific fields to clone. If omitted, clones all fields.",
        },
      ],
      example: "clone(id, name, email)",
    },
  },
  {
    name: "delete",
    category: "action",
    doc: {
      signature: "delete <field>",
      description: "Removes a field from the output (useful after `clone`).",
      parameters: [{ name: "field", description: "The field name to delete" }],
      example: "clone()\ndelete password",
    },
  },
  {
    name: "define",
    category: "action",
    doc: {
      signature: "define <alias> = <expression>",
      description:
        "Creates a local variable/alias for use in subsequent expressions.",
      parameters: [
        { name: "alias", description: "The variable name" },
        { name: "expression", description: "The value to assign" },
      ],
      example:
        "define taxRate = 0.22\nset totalWithTax = total * (1 + taxRate)",
    },
  },
  {
    name: "if",
    category: "control",
    doc: {
      signature: "if (condition) ( actions ) [else ( actions )]",
      description: "Conditional execution of action blocks.",
      parameters: [
        { name: "condition", description: "Boolean expression" },
        { name: "actions", description: "Actions to execute if true/false" },
      ],
      example:
        'if (age >= 18) (\n  set status = "adult"\n) else (\n  set status = "minor"\n)',
    },
  },
  {
    name: "else",
    category: "control",
    doc: {
      signature: "else ( actions )",
      description: "Defines the else branch of an `if` statement.",
      example: "if (condition) (\n  ...\n) else (\n  ...\n)",
    },
  },
];

// Helper to get keywords by category
export const getKeywordsByCategory = (category: "control" | "action") =>
  KEYWORDS.filter((k) => k.category === category);

// Helper to get all keyword names
export const getKeywordNames = () => KEYWORDS.map((k) => k.name);

// Helper to get keyword documentation
export const getKeywordDoc = (name: string) =>
  KEYWORDS.find((k) => k.name.toLowerCase() === name.toLowerCase())?.doc;
