# Publishing MorphQL VSCode Extension

## Prerequisites

### 1. Install `vsce` (VSCode Extension Manager)

```bash
npm install -g @vscode/vsce
```

### 2. Create a Microsoft/Azure Account

1. Go to https://dev.azure.com
2. Sign in with Microsoft account (or create one)
3. Create an organization (e.g., "morphql")

### 3. Create a Personal Access Token (PAT)

1. Go to https://dev.azure.com/[your-org]/_usersSettings/tokens
2. Click "New Token"
3. Settings:
   - **Name**: "VSCode Marketplace"
   - **Organization**: All accessible organizations
   - **Expiration**: 90 days (or custom)
   - **Scopes**: Custom defined → **Marketplace** → **Manage** ✅
4. Click "Create"
5. **SAVE THE TOKEN** - You won't see it again!

### 4. Create a Publisher

1. Go to https://marketplace.visualstudio.com/manage
2. Click "Create publisher"
3. Fill in:
   - **ID**: `morphql` (or your preferred ID)
   - **Name**: MorphQL
   - **Email**: your@email.com
4. Click "Create"

---

## Prepare the Extension

### 1. Add Icon

Copy your `morphql.png` to the extension folder:

```bash
cp /path/to/morphql.png packages/vscode-extension/icon.png
```

Update `package.json`:

```json
{
  "icon": "icon.png",
  "publisher": "morphql",
  "repository": {
    "type": "git",
    "url": "https://github.com/Hyperwindmill/morphql.git"
  }
}
```

### 2. Update Metadata

Edit `packages/vscode-extension/package.json`:

```json
{
  "name": "morphql-vscode",
  "displayName": "MorphQL (Morph Query Language)",
  "description": "Syntax highlighting, diagnostics, and execution for Morph Query Language",
  "version": "0.1.0",
  "publisher": "morphql",
  "icon": "icon.png",
  "engines": {
    "vscode": "^1.75.0"
  },
  "categories": ["Programming Languages", "Formatters", "Other"],
  "keywords": [
    "morphql",
    "morph",
    "query",
    "transformation",
    "json",
    "xml",
    "data transformation"
  ],
  "galleryBanner": {
    "color": "#1e293b",
    "theme": "dark"
  }
}
```

### 3. Add LICENSE

```bash
cp LICENSE packages/vscode-extension/LICENSE
```

### 4. Update README

Make sure `packages/vscode-extension/README.md` is comprehensive and includes:

- Screenshots (if available)
- Feature list
- Usage examples
- Installation instructions

### 5. Add CHANGELOG

Create `packages/vscode-extension/CHANGELOG.md`:

```markdown
# Change Log

## [0.1.0] - 2026-01-21

### Added

- Initial release
- Syntax highlighting for MorphQL files
- Embedded MorphQL support in JS/TS
- Real-time diagnostics
- Hover documentation
- Execute MorphQL files with input data
- Execute embedded queries
- Comment support (line and block)
```

---

## Build and Package

### 1. Compile TypeScript

```bash
cd packages/vscode-extension
npm run compile
```

### 2. Package the Extension

```bash
vsce package
```

This creates `morphql-vscode-0.1.0.vsix`

### 3. Test Locally

Install the `.vsix` file locally:

```bash
code --install-extension morphql-vscode-0.1.0.vsix
```

Test thoroughly!

---

## Publish to Marketplace

### Option 1: Using `vsce` CLI

```bash
cd packages/vscode-extension

# Login (use your PAT when prompted)
vsce login morphql

# Publish
vsce publish
```

### Option 2: Manual Upload

1. Go to https://marketplace.visualstudio.com/manage/publishers/morphql
2. Click "New extension" → "Visual Studio Code"
3. Upload the `.vsix` file
4. Fill in any additional metadata
5. Click "Upload"

---

## Update `.vscodeignore`

Make sure unnecessary files are excluded:

```
.vscode/**
.vscode-test/**
src/**
.gitignore
.yarnrc
vsc-extension-quickstart.md
**/tsconfig.json
**/.eslintrc.json
**/*.map
**/*.ts
!out/**/*.js
node_modules/**
examples/**
.vscode/launch.json
.vscode/tasks.json
```

---

## Version Management

### Patch Release (0.1.0 → 0.1.1)

```bash
vsce publish patch
```

### Minor Release (0.1.0 → 0.2.0)

```bash
vsce publish minor
```

### Major Release (0.1.0 → 1.0.0)

```bash
vsce publish major
```

---

## Post-Publication

### 1. Add Badge to README

```markdown
[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/morphql.morphql-vscode)](https://marketplace.visualstudio.com/items?itemName=morphql.morphql-vscode)
```

### 2. Monitor

- Check https://marketplace.visualstudio.com/items?itemName=morphql.morphql-vscode
- Monitor install count
- Respond to reviews

### 3. Update Main README

Add to main `README.md`:

```markdown
## VSCode Extension

Install the MorphQL extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=morphql.morphql-vscode)

Or search for "MorphQL" in VSCode Extensions.
```

---

## Troubleshooting

### Error: "Publisher not found"

Make sure you've created a publisher at https://marketplace.visualstudio.com/manage

### Error: "Invalid PAT"

Regenerate your Personal Access Token with **Marketplace → Manage** scope.

### Error: "Missing icon"

Add `icon.png` to the extension root and reference it in `package.json`.

### Extension not showing up

- Check publisher ID matches
- Wait 5-10 minutes for indexing
- Clear browser cache

---

## Checklist Before Publishing

- [ ] Icon added (`icon.png`)
- [ ] Publisher set in `package.json`
- [ ] Version number correct
- [ ] README comprehensive
- [ ] CHANGELOG created
- [ ] LICENSE file included
- [ ] `.vscodeignore` configured
- [ ] Extension compiled (`npm run compile`)
- [ ] Tested locally (`.vsix` install)
- [ ] Repository URL correct
- [ ] Keywords added
- [ ] Categories appropriate

---

## Quick Publish Script

Create `packages/vscode-extension/publish.sh`:

```bash
#!/bin/bash
set -e

echo "🔨 Compiling TypeScript..."
npm run compile

echo "📦 Packaging extension..."
vsce package

echo "🚀 Publishing to marketplace..."
vsce publish

echo "✅ Published successfully!"
```

Make it executable:

```bash
chmod +x publish.sh
```

Run:

```bash
./publish.sh
```

---

## Resources

- [VSCode Extension Publishing Guide](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Marketplace Management Portal](https://marketplace.visualstudio.com/manage)
- [Azure DevOps](https://dev.azure.com)

---

**Last Updated:** 2026-01-21
