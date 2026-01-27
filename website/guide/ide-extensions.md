# IDE Extensions

MorphQL provides first-class support for both VSCode and JetBrains IDEs, offering syntax highlighting, code execution, and documentation lookup to enhance your development workflow.

::: info Download
Extensions are available for download on [GitHub Releases](https://github.com/Hyperwindmill/morphql/releases). They are not yet published to official marketplaces (VSCode Marketplace, JetBrains Plugin Repository).
:::

## VSCode Extension

Full language support for Visual Studio Code.

### Features

- 🎨 **Syntax Highlighting**: Complete highlighting for `.morphql` files and `morphQL` tagged templates in JS/TS.
- ▶️ **Execute Queries**: Run transformations directly within the editor.
  - **With Input Data**: Click the "Play" button to open an input box.
  - **With Clipboard**: Right-click context menu option for quick testing.
  - **Selection**: Select a query in a TS file and execute it immediately.
- 🔍 **Diagnostics**: Real-time syntax error detection.
- 🚀 **Snippets**: Type `morphql-` to access common patterns like `transform`, `section`, and `if`.

### Installation

**Download the latest release:**

👉 **[Download from GitHub Releases](https://github.com/Hyperwindmill/morphql/releases)**

1. Download `morphql-vscode-{version}.vsix` from the latest release
2. Open VSCode
3. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
4. Run: **Extensions: Install from VSIX...**
5. Select the downloaded `.vsix` file

::: tip Development
To build from source, see the [Extension Distribution Guide](https://github.com/Hyperwindmill/morphql/blob/main/docs/extension-distribution.md).
:::

## JetBrains Extension

Native support for IntelliJ IDEA, WebStorm, PhpStorm, and other JetBrains IDEs.

### Features

- 🎨 **Syntax Highlighting**: Full color coding for keywords, functions, and operators.
- 💉 **Language Injection**: Automatically highlights `morphQL` template strings in TypeScript/JavaScript.
- 📄 **Documentation**: Hover over keywords and functions to see usage details.
- 🖼️ **File Icons**: Dedicated icons for `.morphql` files.

### Installation

**Download the latest release:**

👉 **[Download from GitHub Releases](https://github.com/Hyperwindmill/morphql/releases)**

1. Download `morphql-jetbrains-{version}.zip` from the latest release
2. Open your JetBrains IDE (IntelliJ IDEA, WebStorm, etc.)
3. Go to **Settings/Preferences** → **Plugins**
4. Click the ⚙️ gear icon → **Install Plugin from Disk...**
5. Select the downloaded `.zip` file
6. Restart your IDE

::: tip Development
To build from source, see the [Extension Distribution Guide](https://github.com/Hyperwindmill/morphql/blob/main/docs/extension-distribution.md).
:::
