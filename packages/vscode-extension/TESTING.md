# Testing the MorphQL VSCode Extension

## Quick Start

### 1. Open Extension in Development Mode

```bash
cd packages/vscode-extension
code .
```

Then press **F5** to launch the Extension Development Host.

### 2. Test Standalone MorphQL Files

In the Extension Development Host window:

1. Open `examples/example.morphql`
2. Verify syntax highlighting:
   - Keywords (`from`, `to`, `transform`, `set`, etc.) should be highlighted
   - Functions (`substring`, `split`, etc.) should be highlighted
   - Operators (`===`, `!==`, `+`, `-`, etc.) should be highlighted
   - Strings and numbers should be highlighted

### 3. Test Embedded MorphQL in TypeScript

1. Open `examples/embedded-example.ts`
2. Verify syntax highlighting inside tagged templates: `morphQL\`...\``

### 4. Test Code Snippets

In a new `.morphql` file, type:

- `morphql-transform` + Tab
- `morphql-section` + Tab
- `morphql-if-stmt` + Tab

In a new `.ts` file, type:

- `morphql-tagged` + Tab
- `morphql-compile` + Tab

## Expected Results

### Syntax Highlighting

**Keywords** (should be colored as keywords):

- `from`, `to`, `transform`, `set`, `section`, `multiple`, `clone`, `delete`, `define`, `if`, `else`

**Functions** (should be colored as functions):

- `substring`, `split`, `replace`, `text`, `number`, `uppercase`, `lowercase`, `xmlnode`, `extractnumber`, `if`

**Operators** (should be colored as operators):

- `===`, `!==`, `==`, `!=`, `<`, `>`, `<=`, `>=`
- `&&`, `||`, `!`
- `+`, `-`, `*`, `/`, `=`

**Literals**:

- Strings: `"hello"`, `'world'`
- Numbers: `123`, `45.67`, `-10`, `1e5`

**Identifiers**:

- Field paths: `user.name`, `customer.address.city`
- Array indices: `items[0]`, `data[index]`

### Embedded Language Support

In TypeScript files, MorphQL syntax should be highlighted inside:

```typescript
// This should have MorphQL syntax highlighting:
const query = morphQL`
  from json to xml
  transform
    set name = firstName
`;
```

## Troubleshooting

### No Syntax Highlighting in Embedded MorphQL

1. Make sure you've compiled the extension: `npm run compile`
2. Restart the Extension Development Host (Ctrl+R or Cmd+R)
3. Check that the file extension is `.ts` or `.js`

### Snippets Not Working

1. Make sure you're in the correct file type (`.morphql` for MorphQL snippets, `.ts`/`.js` for embedded snippets)
2. Type the prefix exactly and press Tab
3. Check VSCode settings: `"editor.snippetSuggestions": "top"`

### Extension Not Loading

1. Check the Debug Console for errors
2. Verify `package.json` is valid JSON
3. Ensure all grammar files are valid JSON

## Manual Testing Checklist

- [ ] Syntax highlighting in `.morphql` files
- [ ] Syntax highlighting in `morphQL\`...\`` tagged templates

- [ ] Code snippets in `.morphql` files
- [ ] Code snippets in `.ts`/`.js` files
- [ ] Bracket matching and auto-closing
- [ ] Array index syntax highlighting (`[0]`, `[index]`)
- [ ] Strict equality operators (`===`, `!==`) highlighting

## Next Steps

After manual testing, you can:

1. **Package the extension**:

   ```bash
   npm install -g @vscode/vsce
   vsce package
   ```

2. **Install locally**:

   ```bash
   code --install-extension morphql-vscode-0.1.0.vsix
   ```

3. **Publish to marketplace** (when ready):
   ```bash
   vsce publish
   ```
