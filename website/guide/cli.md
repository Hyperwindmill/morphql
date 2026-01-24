# CLI Tool

The `@morphql/cli` tool allows you to perform structural data transformations directly from your terminal. It is ideal for scripting, batch processing, and testing queries.

## Installation

Install it globally to use the `morphql` command anywhere:

```bash
npm install -g @morphql/cli
```

Or run it via `npx` without installation:

```bash
npx @morphql/cli --help
```

## Basic Usage

The CLI requires a query and an input source.

```bash
morphql -i '{"hello": "world"}' -q "from json to xml"
```

## Command Options

| Option | Alias | Description |
| :--- | :--- | :--- |
| `--query` | `-q` | The MorphQL query string to execute. |
| `--from` | `-f` | Path to the source file (JSON or XML). |
| `--input` | `-i` | Raw source content as a string. |
| `--to` | `-t` | Path to the destination file. |
| `--cache-dir` | | Directory for storing compiled queries (default: `.compiled`). |

> **Note**: If `--to` is omitted, the result is printed to `stdout`. All logs/errors are printed to `stderr`.

## Recipes & Examples

### File-to-File Transformation

Read a JSON file, transform it, and save as XML.

```bash
morphql \
  --from ./input.json \
  --to ./output.xml \
  -q "from json to xml transform set fullName = firstName + ' ' + lastName"
```

### Piping Data

MorphQL plays well with standard Unix pipes. You can pipe data in and out.

**Pipe in from `cat`:**

```bash
cat data.json | morphql -q "from json to json transform set id = uuid"
```

**Pipe out to `jq`:**

```bash
morphql --from data.json -q "from json to json" | jq .
```

### Batch Processing

You can use standard shell loops to process multiple files.

```bash
for file in *.json; do
  morphql -f "$file" -t "${file%.json}.xml" -q "from json to xml"
done
```

## Caching

The CLI automatically caches compiled queries in a `.compiled` directory (or custom path via `--cache-dir`). This significantly speeds up subsequent executions of the same query, as the compilation step is skipped.
