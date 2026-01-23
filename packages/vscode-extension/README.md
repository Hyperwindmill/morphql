# MorphQL VSCode Extension

Syntax highlighting and language support for **Morph Query Language (MorphQL)** in Visual Studio Code.

## Features

### 🎨 Syntax Highlighting

- **Standalone `.morphql` files**: Full syntax highlighting for MorphQL query files
- **Embedded in JavaScript/TypeScript**: Syntax highlighting for MorphQL inside template strings

### ▶️ Execute MorphQL Files

Run `.morphql` files directly in VSCode with two convenient commands:

1. **Execute with Input Data** (Play button in editor toolbar or right-click menu)
   - Opens an input dialog to enter JSON or XML data
   - Compiles and executes the query
   - Shows formatted results in the Output panel

2. **Execute with Clipboard Data** (Right-click menu)
   - Uses data from your clipboard as input
   - Perfect for quick testing with copied data

**How to use:**

1. Open a `.morphql` file
2. Click the ▶️ play button in the editor toolbar, or
3. Right-click and select "MorphQL: Execute with Input Data"
4. Enter your input data (JSON or XML)
5. View the results in the "MorphQL Output" panel

**Example:**

- Open `examples/test-execution.morphql`
- Click the play button
- Copy and paste the content from `examples/sample-input.json`
- See the transformation result!

3. **Execute Selection** (For embedded queries in JS/TS)
   - Select MorphQL query text in a `.ts` or `.js` file
   - Right-click and choose "MorphQL: Execute Selection"
   - Enter input data and see results

**Example:**

- Open `examples/test-selection.ts`
- Select a query (the text between backticks)
- Right-click → "MorphQL: Execute Selection"
- Enter test data and see the result!

### 💬 Comments Support

MorphQL now supports both line and block comments:

```morphql
// Line comment
from json to xml
transform
  /* Block comment
     spanning multiple lines */
  set name = firstName  // inline comment
```

### 🔍 Real-time Diagnostics

Errors are highlighted as you type with a 500ms debounce:

- Syntax errors show up immediately
- Error messages appear on hover
- Works only in `.morphql` files

### 📖 Hover Documentation

Hover over keywords and functions to see documentation:

- **Keywords**: `from`, `to`, `transform`, `set`, `section`, etc.
- **Functions**: `substring`, `split`, `replace`, `if`, etc.
- Includes parameter descriptions and examples

### 📝 Using MorphQL in JS/TS

Use the `morphQL` tagged template for the best development experience with full syntax highlighting:

```typescript
import { compile, morphQL } from "@morphql/core";

const query = morphQL`
  from json to xml
  transform
    set fullName = firstName + " " + lastName
    section multiple items(
      set sku = itemSku
      set price = itemPrice * 1.2
    ) from products
`;

const engine = await compile(query);
const result = engine(sourceData);
```

### 🚀 Code Snippets

Type these prefixes and press Tab:

- `morphql-transform` - Basic transformation template
- `morphql-section` - Section block
- `morphql-section-multiple` - Array mapping with multiple
- `morphql-if-expr` - If expression (ternary)
- `morphql-if-stmt` - If/else statement block
- `morphql-clone` - Clone fields
- `morphql-define` - Define variable
- `morphql-tagged` - MorphQL with tagged template (JS/TS)
- `morphql-compile` - Complete compile and execute pattern (JS/TS)

## Syntax Support

### Keywords

- `from`, `to`, `transform`
- `set`, `section`, `multiple`
- `clone`, `delete`, `define`
- `if`, `else`

### Built-in Functions

- `substring(str, start, length)`
- `split(str, separator, limit)`
- `replace(str, search, replace)`
- `text(value)`, `number(value)`
- `uppercase(str)`, `lowercase(str)`
- `extractnumber(str)`
- `xmlnode(value, ...attributes)`
- `if(condition, trueValue, falseValue)`

### Operators

- **Arithmetic**: `+`, `-`, `*`, `/`
- **Comparison**: `==`, `===`, `!=`, `!==`, `<`, `>`, `<=`, `>=`
- **Logical**: `&&`, `||`, `!`

### Special Syntax

- **Array indices**: `items[0]`, `data[index]`
- **Field paths**: `user.profile.name`

## Installation

### From VSIX (Local Development)

1. Clone the repository
2. Navigate to `packages/vscode-extension`
3. Run `npm install`
4. Run `npm run compile`
5. Press F5 to launch Extension Development Host

### From Marketplace (Coming Soon)

Search for "MorphQL" in the VSCode Extensions marketplace.

## Requirements

- VSCode 1.75.0 or higher
- For using MorphQL: `@morphql/core` package

## Example Files

Create a file with `.morphql` extension:

```morphql
from json to xml
transform
  set fullName = firstName + " " + lastName
  set age = number(ageString)

  section address(
    set street = addressLine1
    set city = cityName
  )

  section multiple items(
    set sku = itemSku
    set price = itemPrice * 1.2
  ) from products
```

## Known Issues

- Language server features (diagnostics, auto-completion) coming in future versions

## Release Notes

### 0.1.0

- Initial release
- Syntax highlighting for `.morphql` files
- Embedded MorphQL support in JS/TS (tagged templates)
- Code snippets for common patterns
- **Execute `.morphql` files** with input data or clipboard data
- Formatted output display with execution timing

## Contributing

See the main [morphql repository](../../README.md) for contribution guidelines.

## License

MIT
