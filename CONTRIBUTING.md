# Contributing to MorphQL

Thank you for your interest in contributing to MorphQL. Contributions of all kinds are welcome — bug reports, feature requests, documentation improvements, and code changes.

Please note that this project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold it.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Submitting Changes](#submitting-changes)
- [AI-Assisted Contributions](#ai-assisted-contributions)

---

## Getting Started

**Prerequisites:** Node.js 18+, npm 9+

```bash
git clone https://github.com/Hyperwindmill/morphql.git
cd morphql
npm install
npm run build       # build @morphql/core
npm test            # run core test suite
```

To build all packages:

```bash
npm run build:all
```

---

## Project Structure

MorphQL is a monorepo. The most relevant packages for core contributions are:

| Package | Description |
|---|---|
| `packages/core` | Main engine: lexer, parser, compiler, adapters |
| `packages/language-definitions` | **Single source of truth** for language keywords, functions, and operators |
| `packages/cli` | Command-line interface |
| `packages/server` | NestJS REST API |
| `packages/vscode-extension` | VSCode extension |
| `packages/playground` | Interactive web editor |

### Adding or modifying language features

Language keywords, built-in functions, and operators are defined exclusively in `packages/language-definitions/src/`. Downstream consumers (VSCode extension, JetBrains plugin, Monaco editor) derive their grammars and hover documentation from this package automatically.

**Do not** edit TextMate grammars or hover docs manually — always start from `language-definitions`.

After changes:

```bash
cd packages/language-definitions && npm run build
cd packages/core && npm run build
```

---

## Development Workflow

1. **Fork** the repository and create a branch from `main`.
2. **Write tests** for any new behavior. The test suite lives in `packages/core/src/tests/`.
3. **Run the full test suite** before opening a pull request: `npm run test:all`.
4. **Keep changes focused.** A pull request should address one concern. Avoid mixing unrelated refactors with feature changes.
5. **Follow the existing code style.** Formatting is enforced via Prettier (`npm run lint` or IDE automation).

---

## Submitting Changes

- Open a pull request against the `main` branch.
- Provide a clear description of *what* changed and *why*.
- Reference any related issue with `Closes #<issue-number>` where applicable.
- Be prepared for review feedback; iterations are normal and expected.

For significant changes or new language features, consider opening an issue first to discuss the approach before investing time in implementation.

---

## AI-Assisted Contributions

AI-assisted development is explicitly welcome in this project. If you used an AI coding assistant (Claude, Copilot, Cursor, or similar) to help write or review your contribution, you do not need to disclose this — treat it as any other tooling choice.

That said, **AI agents must be properly briefed about the project before they contribute**. MorphQL has a non-trivial architecture and several conventions that are easy to get wrong without adequate context. Common failure modes:

- Editing auto-generated files (grammars, hover docs) instead of their source in `language-definitions`
- Adding language constructs to `core` without updating `language-definitions`, breaking downstream consumers
- Generating code inconsistent with the existing lexer/parser pipeline

If you are using an agentic workflow, ensure the agent has read and understood at minimum:

- This file
- `packages/language-definitions/src/` (keywords, functions, operators)
- `packages/core/src/core/` (lexer, parser, compiler)
- The existing test files in `packages/core/src/tests/` as the ground truth for expected language behavior

AI-generated pull requests are held to the same quality bar as any other: tests must pass, changes must be focused, and the implementation must be consistent with the project's architecture.

---

## Questions

Open a [GitHub Discussion](https://github.com/Hyperwindmill/morphql/discussions) for general questions, or a [GitHub Issue](https://github.com/Hyperwindmill/morphql/issues) for specific bugs and feature requests.
