import * as vscode from "vscode";

interface DocEntry {
  signature: string;
  description: string;
  parameters?: { name: string; description: string }[];
  returns?: string;
  example?: string;
}

const KEYWORD_DOCS: Record<string, DocEntry> = {
  from: {
    signature: "from <format>",
    description: "Specifies the input data format.",
    parameters: [
      { name: "format", description: "One of: `json`, `xml`, or `object`" },
    ],
    example: "from json to xml",
  },
  to: {
    signature: "to <format>",
    description: "Specifies the output data format.",
    parameters: [
      { name: "format", description: "One of: `json`, `xml`, or `object`" },
    ],
    example: "from json to xml",
  },
  transform: {
    signature: "transform",
    description: "Begins the transformation block containing actions.",
    example: "transform\n  set name = firstName",
  },
  set: {
    signature: "set <target> = <expression>",
    description: "Assigns a value to a field in the output.",
    parameters: [
      { name: "target", description: "The field name to set" },
      { name: "expression", description: "The value or expression to assign" },
    ],
    example: 'set fullName = firstName + " " + lastName',
  },
  section: {
    signature: "section [multiple] <name>( <actions> ) [from <path>]",
    description: "Creates a nested object or array in the output.",
    parameters: [
      { name: "multiple", description: "(Optional) Treat as array mapping" },
      { name: "name", description: "The section/field name" },
      { name: "actions", description: "Actions to perform within the section" },
      {
        name: "from",
        description: "(Optional) Source path for the section data",
      },
    ],
    example: "section multiple items(\n  set sku = itemSku\n) from products",
  },
  multiple: {
    signature: "section multiple <name>(...)",
    description: "Modifier for `section` to map over an array.",
    example: "section multiple items(\n  set id = itemId\n) from products",
  },
  clone: {
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
  delete: {
    signature: "delete <field>",
    description: "Removes a field from the output (useful after `clone`).",
    parameters: [{ name: "field", description: "The field name to delete" }],
    example: "clone()\ndelete password",
  },
  define: {
    signature: "define <alias> = <expression>",
    description:
      "Creates a local variable/alias for use in subsequent expressions.",
    parameters: [
      { name: "alias", description: "The variable name" },
      { name: "expression", description: "The value to assign" },
    ],
    example: "define taxRate = 0.22\nset totalWithTax = total * (1 + taxRate)",
  },
  if: {
    signature: "if (condition) ( actions ) [else ( actions )]",
    description: "Conditional execution of action blocks.",
    parameters: [
      { name: "condition", description: "Boolean expression" },
      { name: "actions", description: "Actions to execute if true/false" },
    ],
    example:
      'if (age >= 18) (\n  set status = "adult"\n) else (\n  set status = "minor"\n)',
  },
  else: {
    signature: "else ( actions )",
    description: "Defines the else branch of an `if` statement.",
    example: "if (condition) (\n  ...\n) else (\n  ...\n)",
  },
};

const FUNCTION_DOCS: Record<string, DocEntry> = {
  substring: {
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
  split: {
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
  replace: {
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
  text: {
    signature: "text(value)",
    description: "Converts a value to a string.",
    parameters: [{ name: "value", description: "The value to convert" }],
    returns: "string",
    example: 'text(123)  // "123"',
  },
  number: {
    signature: "number(value)",
    description: "Converts a value to a number.",
    parameters: [{ name: "value", description: "The value to convert" }],
    returns: "number",
    example: 'number("42")  // 42',
  },
  uppercase: {
    signature: "uppercase(str)",
    description: "Converts a string to uppercase.",
    parameters: [{ name: "str", description: "The string to convert" }],
    returns: "string",
    example: 'uppercase("hello")  // "HELLO"',
  },
  lowercase: {
    signature: "lowercase(str)",
    description: "Converts a string to lowercase.",
    parameters: [{ name: "str", description: "The string to convert" }],
    returns: "string",
    example: 'lowercase("HELLO")  // "hello"',
  },
  extractnumber: {
    signature: "extractnumber(str)",
    description: "Extracts the first numeric sequence from a string.",
    parameters: [{ name: "str", description: "The string to extract from" }],
    returns: "number",
    example: 'extractnumber("Price: 100USD")  // 100',
  },
  xmlnode: {
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
};

export class MQLHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Hover> {
    const range = document.getWordRangeAtPosition(position);
    if (!range) {
      return null;
    }

    const word = document.getText(range);

    // Check if it's a keyword
    const keywordDoc = KEYWORD_DOCS[word.toLowerCase()];
    if (keywordDoc) {
      return new vscode.Hover(this.formatDocumentation(keywordDoc), range);
    }

    // Check if it's a function
    const functionDoc = FUNCTION_DOCS[word.toLowerCase()];
    if (functionDoc) {
      return new vscode.Hover(this.formatDocumentation(functionDoc), range);
    }

    return null;
  }

  private formatDocumentation(doc: DocEntry): vscode.MarkdownString {
    const md = new vscode.MarkdownString();
    md.isTrusted = true;

    // Signature
    md.appendCodeblock(doc.signature, "mql");

    // Description
    md.appendMarkdown(doc.description);
    md.appendMarkdown("\n\n");

    // Parameters
    if (doc.parameters && doc.parameters.length > 0) {
      md.appendMarkdown("**Parameters:**\n\n");
      doc.parameters.forEach((param) => {
        md.appendMarkdown(`- \`${param.name}\`: ${param.description}\n`);
      });
      md.appendMarkdown("\n");
    }

    // Returns
    if (doc.returns) {
      md.appendMarkdown(`**Returns:** \`${doc.returns}\`\n\n`);
    }

    // Example
    if (doc.example) {
      md.appendMarkdown("**Example:**\n\n");
      md.appendCodeblock(doc.example, "mql");
    }

    return md;
  }
}
