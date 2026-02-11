<p align="center">
  <img src="https://raw.githubusercontent.com/Hyperwindmill/morphql/main/morphql.png" alt="MorphQL" width="200" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@morphql/cli"><img src="https://img.shields.io/npm/v/@morphql/cli?label=%40morphql%2Fcli" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" />
</p>

# @morphql/cli

The command-line interface for **MorphQL**. Transform structural data (JSON, XML, CSV, etc.) directly from your terminal using declarative queries.

## Key Features

- 🏎️ **Fast Execution**: Compiles queries to optimized native JavaScript functions.
- 📂 **Batch Processing**: Transform entire directories of files in one command.
- 👁️ **Watch Mode**: Real-time directory monitoring and automatic transformation.
- 📊 **Structured Logging**: Human-readable `text` or machine-parsable `json` output.
- 🧩 **Lightweight**: Minimal dependencies, leveraging Node.js native modules where possible.

## Installation

```bash
npm install -g @morphql/cli
```

## Basic Usage

### Single File (Default)

```bash
# Inline transformation
echo '{"name":"Alice"}' | morphql -q "from json to xml"

# File-to-file
morphql --from data.json --to output.xml -q "from json to xml"
```

### Batch Processing

```bash
morphql batch \
  -q "from xml to json transform set status = 'processed'" \
  --in ./inbox \
  --out ./outbox \
  --pattern "*.xml"
```

### Watch Mode

```bash
morphql watch \
  -q "from csv to json" \
  --in ./incoming \
  --out ./processed \
  --delete
```

## Options Summary

| Feature      | Example                | Description                                      |
| :----------- | :--------------------- | :----------------------------------------------- |
| **Patterm**  | `--pattern "*.json"`   | Filter which files to process.                   |
| **Archive**  | `--done-dir ./done`    | Move files here after success.                   |
| **Error**    | `--error-dir ./err`    | Move files here on failure.                      |
| **Cleanup**  | `--delete`             | Remove source files after successful processing. |
| **Logging**  | `--log-format json`    | Output JSONL for automated monitoring.           |
| **PID File** | `--pid-file morph.pid` | Write process PID for service management.        |

## Learn More

- 👉 **[Official Documentation](https://hyperwindmill.github.io/morphql/)**
- 🏠 **[Main Repository](https://github.com/Hyperwindmill/morphql)**

## License

MIT
