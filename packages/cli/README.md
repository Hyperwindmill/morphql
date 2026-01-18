# @query-morph/cli

CLI tool for **query-morph** - structural data transformation powered by the Morph Query Language (MQL).

## Installation

```bash
npm install -g @query-morph/cli
```

## Usage

```bash
query-morph --from <input-file> --to <output-file> -q <query>
```

### Options

- `-f, --from <path>`: Path to the source file (JSON, XML).
- `-t, --to <path>`: Path to the destination file.
- `-q, --query <string>`: The MQL query to execute.
- `--cache-dir <path>`: Directory for compiled cache (default: `.compiled`).

### Example

```bash
query-morph --from ./data.json --to ./output.xml -q "from json to xml transform set fullName = firstName + \" \" + lastName"
```

## Features

- **Blazing Fast**: Compiles queries to native JavaScript for high performance.
- **Smart Caching**: Standardized file-system caching to avoid re-compilation of queries.
- **Format Agnostic**: Seamlessly convert between JSON and XML.

## License

MIT
