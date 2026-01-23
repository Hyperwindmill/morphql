# MorphQL JetBrains Extension

A dedicated JetBrains extension for **MorphQL**, the high-performance isomorphic Query-to-Code engine. This plugin provides syntax highlighting, language injection, and documentation support for `.morphql` files and embedded MorphQL in JavaScript/TypeScript.

## Features

- 🎨 **Syntax Highlighting**: Full color coding for keywords, functions, operators, and strings.
- 💉 **Language Injection**: Automatically highlights `morphQL` template strings in JavaScript and TypeScript files:
  ```typescript
  const query = morphQL`
     section users( ... )
  `;
  ```
- 📄 **Documentation**: Hover over any keyword or standard function (e.g., `substring`, `clone`) to see its documentation.
- 🖼️ **File Icons**: Professional icons for `.morphql` files, with automatic dark/light theme adaptation.
- 🧩 **Multi-IDE Support**: Compatible with IntelliJ IDEA Ultimate, PhpStorm, and WebStorm.

## Installation

Since this plugin is not yet on the JetBrains Marketplace, you can install it manually from the build artifact.

### 1. Build the Plugin

If you have the source code, run the build command from the `packages/jetbrains-extension` directory:

```bash
./gradlew build
```

The artifact will be generated at:
`build/distributions/morphql-jetbrains-0.1.3.zip`

### 2. Install from Disk

1. Open your IDE (IntelliJ, PhpStorm, or WebStorm).
2. Go to **Settings/Preferences** → **Plugins**.
3. Click the **Gear Icon** ⚙️ and select **Install Plugin from Disk...**.
4. Select the `.zip` file generated in the previous step.
5. Restart the IDE.

## Requirements

- **IDE Version**: Build `232.*` to `253.*` (matches IntelliJ 2023.2 to 2025.1 EAP).
- **Supported IDEs**:
  - IntelliJ IDEA Ultimate (with JavaScript plugin)
  - WebStorm
  - PhpStorm

## Development

This project is built with **Gradle** and **Kotlin**.

- **Structure**:
  - `src/main/kotlin`: Plugin source code.
  - `src/main/resources`: Icons and `plugin.xml`.
  - `build.gradle.kts`: Build configuration.

- **Run IDE**: To test the plugin in a sandbox instance:
  ```bash
  ./gradlew runIde
  ```
