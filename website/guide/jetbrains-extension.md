# JetBrains Extension

Native language support for IntelliJ IDEA, WebStorm, PhpStorm, and all other JetBrains IDEs.

::: info Download
The plugin is available for download on [GitHub Releases](https://github.com/Hyperwindmill/morphql/releases). It is not yet published to the JetBrains Plugin Repository.
:::

## Features

- **Live Panel**: Real-time output preview as you type, with syntax-highlighted results, generated JS, and structure analysis — powered by the same engine as the VSCode extension.
- **Syntax Highlighting**: Full color coding for keywords, functions, and operators in `.morphql` files.
- **Language Injection**: Automatically highlights `morphQL` tagged template strings in TypeScript/JavaScript.
- **Hover Documentation**: Hover over keywords and functions to see usage details.
- **File Icons**: Dedicated icons for `.morphql` files in the project tree.

## Installation

👉 **[Download from GitHub Releases](https://github.com/Hyperwindmill/morphql/releases)**

1. Download `morphql-jetbrains-{version}.zip` from the latest release
2. Open your JetBrains IDE (IntelliJ IDEA, WebStorm, etc.)
3. Go to **Settings/Preferences** → **Plugins**
4. Click the ⚙️ gear icon → **Install Plugin from Disk...**
5. Select the downloaded `.zip` file
6. Restart your IDE

---

## Live Panel

The Live Panel opens a dedicated tool window that updates in real time as you edit your query, showing the transformation output, the generated JavaScript, and the data structure analysis — the same panel used by the VSCode extension.

### Opening the Panel

The **MorphQL Live** tool window appears in the right sidebar after installing the plugin. You can also open it via:

- **View** → **Tool Windows** → **MorphQL Live**

The panel automatically tracks whichever `.morphql` file is currently active in the editor. Switching to a different `.morphql` tab updates the panel immediately; switching to a non-MorphQL file leaves the last result visible.

### Source Data File

The panel reads source data from a **companion file** — a file with the same base name as your query but a different extension (e.g. `invoice.json` for `invoice.morphql`).

**Auto-detection**: when you switch to a `.morphql` file, the panel looks for a matching file in the same directory. If multiple files match, the first one alphabetically is used.

**Changing the source file**: use the **change** button in the panel toolbar to open the IDE file chooser and select any file. Your choice is saved in `.morphql-extension/panel-settings.json` in the project root and restored on next open.

**Opening the source file**: click the **open** button next to the source file name to open it in a standard editor tab. Edits saved there are reflected in the panel immediately.

::: tip Cross-IDE compatibility
The settings file format is identical to the one used by the VSCode extension. If you use both IDEs on the same project, the source file choice is automatically shared.
:::

::: tip Working without a source file
If no source file is found, the panel runs the query against an empty object `{}`. You can still observe the generated JavaScript and the output structure.
:::

### Tabs

| Tab | Contents |
|---|---|
| **Result** | The transformation output, syntax-highlighted as JSON, XML, or plain text depending on content |
| **Generated JS** | The JavaScript function compiled from your query, with syntax highlighting |
| **Structure** | An expandable tree showing the inferred input and output data structures |

### Status Indicators

The toolbar shows the current query file name and a status badge:

- **OK** (green) — the last compilation and execution succeeded
- **Error** (red) — a compilation or execution error occurred; the Result tab shows the error message
- **Idle** — no `.morphql` file is active

---

## Syntax Highlighting

`.morphql` files are fully highlighted: keywords (`from`, `to`, `transform`, `set`, `section`, ...), built-in functions, operators, string literals, and comments are all color-coded according to your IDE theme.

## Language Injection

MorphQL syntax is automatically highlighted inside `morphQL` tagged template literals in TypeScript and JavaScript files:

```typescript
import { morphQL } from "@morphql/core";

const query = morphQL`
  from json to json
  transform
    set fullName = firstName + " " + lastName
`;
```

The `morphQL` tag is a no-op at runtime — it exists purely to enable highlighting and documentation inside the template.

## Hover Documentation

Hover over any MorphQL keyword or function in a `.morphql` file or inside an injected template literal to see a description and usage example in the IDE documentation popup.
