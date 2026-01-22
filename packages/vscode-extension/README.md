# MQL VSCode Extension

Syntax highlighting and language support for **Morph Query Language (MQL)** in Visual Studio Code.

## Features

### 🎨 Syntax Highlighting

- **Standalone `.mql` files**: Full syntax highlighting for MQL query files
- **Embedded in JavaScript/TypeScript**: Syntax highlighting for MQL inside template strings

### ▶️ Execute MQL Files

Run `.mql` files directly in VSCode with two convenient commands:

1. **Execute with Input Data** (Play button in editor toolbar or right-click menu)
   - Opens an input dialog to enter JSON or XML data
   - Compiles and executes the query
   - Shows formatted results in the Output panel

2. **Execute with Clipboard Data** (Right-click menu)
   - Uses data from your clipboard as input
   - Perfect for quick testing with copied data

**How to use:**

1. Open a `.mql` file
2. Click the ▶️ play button in the editor toolbar, or
3. Right-click and select "MQL: Execute with Input Data"
4. Enter your input data (JSON or XML)
5. View the results in the "MQL Output" panel

**Example:**

- Open `examples/test-execution.mql`
- Click the play button
- Copy and paste the content from `examples/sample-input.json`
- See the transformation result!

3. **Execute Selection** (For embedded queries in JS/TS)
   - Select MQL query text in a `.ts` or `.js` file
   - Right-click and choose "MQL: Execute Selection"
   - Enter input data and see results

**Example:**

- Open `examples/test-selection.ts`
- Select a query (the text between backticks)
- Right-click → "MQL: Execute Selection"
- Enter test data and see the result!

### 💬 Comments Support

MQL now supports both line and block comments:

```mql
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
- Works only in `.mql` files

### 📖 Hover Documentation

Hover over keywords and functions to see documentation:

- **Keywords**: `from`, `to`, `transform`, `set`, `section`, etc.
- **Functions**: `substring`, `split`, `replace`, `if`, etc.
- Includes parameter descriptions and examples

### 📝 Two Ways to Use MQL in JS/TS

#### 1. Tagged Templates (Recommended)

```typescript
import { compile, mql } from "@morphql/core";

const query = mql`
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

#### 2. Comment Hints

```typescript
import { compile } from "@morphql/core";

// @mql
const query = `
  from json to xml
  transform
    set fullName = firstName + " " + lastName
`;

const engine = await compile(query);
```

### 🚀 Code Snippets

Type these prefixes and press Tab:

- `mql-transform` - Basic transformation template
- `mql-section` - Section block
- `mql-section-multiple` - Array mapping with multiple
- `mql-if-expr` - If expression (ternary)
- `mql-if-stmt` - If/else statement block
- `mql-clone` - Clone fields
- `mql-define` - Define variable
- `mql-tagged` - MQL with tagged template (JS/TS)
- `mql-comment` - MQL with comment hint (JS/TS)
- `mql-compile` - Complete compile and execute pattern (JS/TS)

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

Search for "MQL" in the VSCode Extensions marketplace.

## Requirements

- VSCode 1.75.0 or higher
- For using MQL: `@morphql/core` package

## Example Files

Create a file with `.mql` extension:

```mql
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
- Syntax highlighting for `.mql` files
- Embedded MQL support in JS/TS (tagged templates and comment hints)
- Code snippets for common patterns
- **Execute `.mql` files** with input data or clipboard data
- Formatted output display with execution timing

## Contributing

See the main [query-morph repository](../../README.md) for contribution guidelines.

## License

MIT
