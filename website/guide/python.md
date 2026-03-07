# Python Library

Use MorphQL directly from Python applications. The package delegates execution to the **MorphQL CLI** or a running **MorphQL server** — supporting both **Node.js** and **QuickJS** runtimes for Node-less environments.

## Installation

```bash
pip install morphql
```

[![PyPI Version](https://img.shields.io/pypi/v/morphql)](https://pypi.org/project/morphql/)

## Quick Start

```python
from morphql import MorphQL

result = MorphQL.execute(
    'from json to json transform set greeting = "Hello, " + name',
    '{"name": "World"}'
)
# → '{"greeting":"Hello, World"}'
```

## Usage

### Static API

```python
from morphql import MorphQL

# Inline query
result = MorphQL.execute(
    query='from json to json transform set x = a + b',
    data={'a': 1, 'b': 2},
)

# From a .morphql file
result = MorphQL.execute_file('transform.morphql', data={'a': 1, 'b': 2})
```

`data` accepts a `dict`, `list`, JSON `str`, or `None`.

### Reusable Instance

Create an instance with preset defaults when running multiple transformations with the same configuration:

```python
morph = MorphQL(
    provider='server',
    server_url='http://localhost:3000',
    api_key='my-secret',
)

result = morph.run('from json to xml', data)
other  = morph.run_file('transform.morphql', csv_data)
```

## Providers

| Provider        | Backend             | Transport          | Runtime          |
| :-------------- | :------------------ | :----------------- | :--------------- |
| `cli` (default) | Bundled engine      | `subprocess`       | `node` or `qjs`  |
| `server`        | MorphQL REST server | `urllib` (stdlib)  | —                |

The `cli` provider invokes the MorphQL engine locally. By default it requires **Node.js**, but you can switch to the embedded **QuickJS** runtime for a completely self-contained, zero-dependency setup.

### Node-less execution with QuickJS

```python
morph = MorphQL(runtime='qjs')
result = morph.run('from json to json transform set x = x', data)
```

The QuickJS binary is resolved automatically for your platform (`linux-x86_64`, `darwin`, `windows-x86_64`). If not found locally, it is downloaded from the [quickjs-ng](https://github.com/quickjs-ng/quickjs) releases and cached in the system temp directory.

## Configuration

Options are resolved in priority order: **call params → instance defaults → env vars → hardcoded defaults**.

| Option       | Env Var              | Default                   | Description              |
| :----------- | :------------------- | :------------------------ | :----------------------- |
| `provider`   | `MORPHQL_PROVIDER`   | `cli`                     | `cli` or `server`        |
| `runtime`    | `MORPHQL_RUNTIME`    | `node`                    | `node` or `qjs`          |
| `cli_path`   | `MORPHQL_CLI_PATH`   | _(auto)_                  | Override CLI binary path |
| `node_path`  | `MORPHQL_NODE_PATH`  | `node`                    | Path to Node.js binary   |
| `qjs_path`   | `MORPHQL_QJS_PATH`   | _(auto)_                  | Path to QuickJS binary   |
| `cache_dir`  | `MORPHQL_CACHE_DIR`  | System temp dir           | CLI query cache dir      |
| `server_url` | `MORPHQL_SERVER_URL` | `http://localhost:3000`   | Server base URL          |
| `api_key`    | `MORPHQL_API_KEY`    | —                         | API key for server auth  |
| `timeout`    | `MORPHQL_TIMEOUT`    | `30`                      | Timeout in seconds       |

## Error Handling

```python
from morphql import MorphQL

try:
    result = MorphQL.execute('invalid query', '{}')
except ValueError as e:
    print('Bad input:', e)        # missing query
except FileNotFoundError as e:
    print('File not found:', e)   # execute_file() path missing
except RuntimeError as e:
    print('Execution failed:', e) # CLI error or server error
```

## Compatibility

- **Python 3.8+** — No external dependencies (uses only stdlib: `subprocess`, `urllib`, `json`)
- **Node.js 18+** OR **QuickJS** — Required for the `cli` provider
- **Zero pip dependencies** — Only `pytest` for development

## Source

- [PyPI](https://pypi.org/project/morphql/)
- [Source (monorepo)](https://github.com/Hyperwindmill/morphql/tree/main/packages/python)
