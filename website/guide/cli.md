# CLI Tool

The `@morphql/cli` tool allows you to perform structural data transformations directly from your terminal. It supports single-file transformations, batch processing of directories, and real-time file monitoring via a watch mode.

## Installation

Install it globally to use the `morphql` command anywhere:

```bash
npm install -g @morphql/cli
```

Or run it via `npx` without installation:

```bash
npx @morphql/cli --help
```

## Single-File Mode

The default mode transforms a single input. Pass a query and provide input via file, string, or stdin pipe.

```bash
morphql -i '{"hello": "world"}' -q "from json to xml"
```

### Options

| Option         | Alias | Description                                                |
| :------------- | :---- | :--------------------------------------------------------- |
| `--query`      | `-q`  | The MorphQL query string to execute.                       |
| `--from`       | `-f`  | Path to the source file.                                   |
| `--input`      | `-i`  | Raw source content as a string.                            |
| `--to`         | `-t`  | Path to the destination file.                              |
| `--cache-dir`  |       | Directory for compiled query cache (default: `.compiled`). |
| `--log-format` |       | Log output format: `text` (default) or `json`.             |

> **Note**: If `--to` is omitted, the result is printed to `stdout`. All logs/errors go to `stderr`.

### Examples

**File-to-File:**

```bash
morphql \
  --from ./input.json \
  --to ./output.xml \
  -q "from json to xml transform set fullName = firstName + ' ' + lastName"
```

**Piping:**

```bash
cat data.json | morphql -q "from json to json transform set id = uuid"
morphql --from data.json -q "from json to json" | jq .
```

---

## Batch Mode

The `batch` subcommand processes all files in a directory with a single command. This replaces the need for manual shell loops.

```bash
morphql batch \
  -q "from xml to json" \
  --in ./invoices/ \
  --out ./converted/
```

### Options

| Option                  | Description                                            |
| :---------------------- | :----------------------------------------------------- |
| `-q, --query <string>`  | **(Required)** MorphQL query string.                   |
| `--in <path>`           | **(Required)** Input directory.                        |
| `--out <path>`          | **(Required)** Output directory (created if missing).  |
| `--pattern <glob>`      | Include pattern for filenames (default: `*`).          |
| `--done-dir <path>`     | Move source files here after success.                  |
| `--error-dir <path>`    | Move source files here on failure.                     |
| `--cache-dir <path>`    | Compiled query cache directory (default: `.compiled`). |
| `--log-format <format>` | Log output format: `text` (default) or `json`.         |

### Behavior

1. Validates that `--in` exists and is a directory.
2. Creates `--out` (and `--done-dir`, `--error-dir`) if they don't exist.
3. Compiles the query **once** and caches it.
4. Lists files matching `--pattern` (dot-files are skipped by default).
5. Transforms each file and writes the result to `--out` with the correct extension.
6. Prints a summary with file count, errors, and elapsed time.
7. Exits with code `1` if any errors occurred, `0` otherwise.

### Examples

**Convert only XML files:**

```bash
morphql batch \
  -q "from xml to json" \
  --in ./data/ \
  --out ./output/ \
  --pattern "*.xml"
```

**Archive processed files, quarantine failures:**

```bash
morphql batch \
  -q "from csv to json transform set imported = true" \
  --in ./spool/inbox/ \
  --out ./spool/processed/ \
  --done-dir ./spool/archive/ \
  --error-dir ./spool/failed/ \
  --pattern "*.csv"
```

---

## Watch Mode

The `watch` subcommand monitors a directory and automatically transforms files as they appear. It is event-driven (uses `fs.watch`) and designed for long-running processes.

```bash
morphql watch \
  -q "from xml to json" \
  --in ./incoming/ \
  --out ./processed/ \
  --pattern "*.xml"
```

### Options

Same as [Batch Mode](#batch-mode), plus:

| Option              | Description                                               |
| :------------------ | :-------------------------------------------------------- |
| `--pid-file <path>` | Write the process PID to a file (for process management). |

### Behavior

1. On startup, performs an **initial sweep** of all existing files in `--in`.
2. Then watches for new files using an event-driven mechanism.
3. File writes are **debounced** (100ms) to handle multi-step writes safely.
4. Dot-files (e.g., `.temp.json`) are ignored by default.
5. Handles `SIGTERM` and `SIGINT` for graceful shutdown.
6. If `--pid-file` is specified, writes the PID on start and cleans up on exit.

### Examples

**Monitor and log in JSON:**

```bash
morphql watch \
  -q "from csv to json" \
  --in ./incoming \
  --out ./processed \
  --pattern "*.csv" \
  --log-format json
```

**With PID file (for use with `flock`):**

```bash
morphql watch \
  -q "from xml to json" \
  --in ./spool/in \
  --out ./spool/out \
  --pid-file /var/run/morphql.pid
```

---

## Structured Logging

Both `batch` and `watch` modes support structured logging via `--log-format`.

### Text (Default)

Human-readable output with timestamps:

```
[23:09:01] INFO: Transformed order.xml → order.json (12ms)
[23:09:01] ERROR: bad.xml — Lexing errors: unexpected character
[23:09:01] INFO: Summary: 3 files processed, 1 error in 380ms
```

### JSON

One JSON object per line (JSONL), ideal for log aggregation and monitoring:

```json
{"ts":"2026-02-11T23:09:01.123Z","level":"info","msg":"Transformed","input":"order.xml","output":"order.json","duration":12}
{"ts":"2026-02-11T23:09:01.124Z","level":"error","msg":"Lexing errors","input":"bad.xml"}
{"ts":"2026-02-11T23:09:01.130Z","level":"info","msg":"Summary","processed":3,"errors":1,"duration":380}
```

Redirect JSON logs to a file:

```bash
morphql batch -q "from json to json" --in ./data --out ./out --log-format json 2> batch.log
```

---

## Running as a Linux Service

The `watch` mode is designed to run as a system service. It handles `SIGTERM` for graceful shutdown and supports PID files for process management.

### Systemd Unit File

Create `/etc/systemd/system/morphql-watcher.service`:

```ini
[Unit]
Description=MorphQL Directory Watcher
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/html/project
ExecStart=/usr/bin/node node_modules/.bin/morphql watch \
  -q "from xml to json transform set status = 'imported'" \
  --in ./spool/in \
  --out ./spool/out \
  --pattern "*.xml" \
  --pid-file /run/morphql.pid \
  --log-format json
Restart=always
StandardError=journal
StandardOutput=null

[Install]
WantedBy=multi-user.target
```

Then enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable morphql-watcher
sudo systemctl start morphql-watcher
```

View logs via `journalctl`:

```bash
journalctl -u morphql-watcher -f
```

### Using with `flock`

For lightweight process locking without systemd (e.g., triggered by `cron`):

```bash
flock -n /tmp/morphql.lock morphql watch \
  -q "from xml to json" \
  --in ./spool/in \
  --out ./spool/out \
  --pid-file /tmp/morphql.pid
```

---

## Caching

The CLI automatically caches compiled queries in a `.compiled` directory (or a custom path via `--cache-dir`). This significantly speeds up subsequent executions of the same query by skipping the compilation step. Caching works across all modes (single-file, batch, and watch).
