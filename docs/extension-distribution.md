# Extension Distribution

This document explains how to build and distribute MorphQL IDE extensions.

## Automated Builds

Extensions are automatically built via GitHub Actions when you push a version tag:

```bash
git tag v0.1.7
git push origin v0.1.7
```

This triggers the `build-extensions` workflow which:

1. Builds the VSCode extension (`.vsix`)
2. Builds the JetBrains extension (`.zip`)
3. Creates a **draft GitHub release** with both files attached

## Manual Installation

### VSCode Extension

1. Download the `.vsix` file from the GitHub release
2. Open VSCode
3. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
4. Run: "Extensions: Install from VSIX..."
5. Select the downloaded `.vsix` file

### JetBrains Extension

1. Download the `.zip` file from the GitHub release
2. Open your JetBrains IDE (IntelliJ, WebStorm, etc.)
3. Go to Settings → Plugins
4. Click the ⚙️ gear icon → "Install Plugin from Disk..."
5. Select the downloaded `.zip` file
6. Restart the IDE

## Building Locally

### VSCode Extension

```bash
cd packages/vscode-extension
npm install -g @vscode/vsce
npm run build
vsce package --no-dependencies
```

This creates `morphql-vscode-{version}.vsix`

### JetBrains Extension

```bash
cd packages/jetbrains-extension
./gradlew buildPlugin
```

This creates a `.zip` file in `build/distributions/`

## Publishing to Marketplaces (Future)

Currently, extensions are distributed via GitHub releases only. When ready to publish to official marketplaces:

### VSCode Marketplace

```bash
vsce publish --packagePath morphql-vscode-0.1.7.vsix
```

### JetBrains Plugin Repository

Upload the `.zip` file to https://plugins.jetbrains.com/ and wait for review.
