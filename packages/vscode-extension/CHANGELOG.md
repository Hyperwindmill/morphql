# Change Log

All notable changes to the MQL VSCode extension will be documented in this file.

## [0.1.0] - 2026-01-21

### Added

- Initial release of MQL VSCode extension
- **Syntax Highlighting**
  - Full syntax highlighting for `.mql` files
  - Embedded MQL support in JavaScript/TypeScript (tagged templates and comment hints)
  - Support for keywords, functions, operators, strings, numbers, and comments
- **Comment Support**
  - Line comments (`//`)
  - Block comments (`/* */`)
- **Real-time Diagnostics**
  - Syntax error detection with 500ms debounce
  - Error highlighting in editor
  - Detailed error messages on hover
- **Hover Documentation**
  - Complete documentation for all keywords
  - Complete documentation for all built-in functions
  - Parameter descriptions and usage examples
- **Code Execution**
  - Execute `.mql` files with input data dialog
  - Execute `.mql` files with clipboard data
  - Execute selected MQL queries in JS/TS files
  - Formatted output display (JSON/XML)
  - Execution timing metrics
- **Code Snippets**
  - Snippets for common MQL patterns
  - Snippets for embedded MQL in JS/TS
- **Language Configuration**
  - Auto-closing pairs for brackets and quotes
  - Comment toggling support
  - Bracket matching

### Features

- Supports MQL keywords: `from`, `to`, `transform`, `set`, `section`, `multiple`, `clone`, `delete`, `define`, `if`, `else`
- Supports built-in functions: `substring`, `split`, `replace`, `text`, `number`, `uppercase`, `lowercase`, `extractnumber`, `xmlnode`, `if`
- Supports operators: arithmetic (`+`, `-`, `*`, `/`), comparison (`==`, `===`, `!=`, `!==`, `<`, `>`, `<=`, `>=`), logical (`&&`, `||`, `!`)
- Centralized language definitions using `@query-morph/language-definitions` package

### Documentation

- Comprehensive README with usage examples
- Testing guide (TESTING.md)
- Publishing guide (PUBLISHING.md)
- Example files for testing

## [Unreleased]

### Planned Features

- Language Server Protocol (LSP) implementation
- IntelliSense and auto-completion
- Go to definition
- Find references
- Code formatting
- Refactoring support
- Debugging capabilities
