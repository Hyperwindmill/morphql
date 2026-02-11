<p align="center">
  <img src="https://raw.githubusercontent.com/Hyperwindmill/morphql/main/morphql.png" alt="MorphQL" width="200" />
</p>

# MorphQL VSCode Extension

Syntax highlighting and language support for **Morph Query Language (MorphQL)** in Visual Studio Code. Write, test, and execute data transformations directly in your editor.

## Key Features

### 🎨 Syntax Highlighting

- **Standalone `.morphql` files**: Full syntax highlighting for MorphQL query files.
- **Embedded in JS/TS**: Highlighting for `morphQL` template strings in `.js` and `.ts` files.

### ▶️ Execute Queries on Disk

Run MorphQL transformations directly within VSCode (requires `@morphql/cli` or a local context):

- **Execute with Input**: Opens a dialog to enter JSON/XML data and shows the result in the output panel.
- **Execute from Clipboard**: Uses your clipboard content as the transformation source — perfect for rapid prototyping.

### 🔍 Real-time Tools

- **Diagnostics**: Instant highlighting of syntax errors as you type.
- **Hover Docs**: Mouse over any keyword or function to see its signature and examples.
- **Snippets**: Productivity shortcuts for common patterns (e.g., `morphql-section`, `morphql-if`).

## Installation

### From Marketplace (Recommended)

Search for **"MorphQL"** in the VSCode Extension view (`Ctrl+Shift+X`).

### Manual Installation

Download the `.vsix` package from the [Releases page](https://github.com/Hyperwindmill/morphql/releases) and use the "Install from VSIX..." command.

## Usage Example

```typescript
import { compile, morphQL } from "@morphql/core";

const query = morphQL`
  from json to xml
  transform
    set fullName = firstName + " " + lastName
`;
```

## Learn More

- 👉 **[Official Documentation](https://hyperwindmill.github.io/morphql/)**
- 🏠 **[Main Repository](https://github.com/Hyperwindmill/morphql)**

## License

MIT
