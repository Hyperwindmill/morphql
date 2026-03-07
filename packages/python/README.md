# morphql · Python client

Python client for [MorphQL](https://github.com/Hyperwindmill/morphql) — a declarative DSL for structural data transformation.

Delegates execution to the MorphQL **CLI** or a running **MorphQL server**. Zero external dependencies. Python >= 3.8.

## Installation

```bash
pip install morphql
```

## Quick start

```python
from morphql import MorphQL

# One-shot static call (CLI provider)
result = MorphQL.execute(
    "from json to json transform set name = source.firstName",
    data={"firstName": "Alice"},
)
print(result)  # {"name":"Alice"}

# From a .morphql file
result = MorphQL.execute_file("transform.morphql", data={"x": 1})

# Instance with preset defaults (server provider)
morph = MorphQL(provider="server", server_url="http://localhost:3000")
result = morph.run("from json to json transform set x = source.x", data={"x": 42})
result = morph.run_file("transform.morphql", data={"x": 42})
```

## Providers

| Provider   | How it works                                      |
|------------|---------------------------------------------------|
| `"cli"`    | Runs `morphql` CLI via `subprocess` (default)     |
| `"server"` | `POST {server_url}/v1/execute` via `urllib`       |

## Options

| Option       | Default                     | Env var               |
|--------------|-----------------------------|-----------------------|
| `provider`   | `"cli"`                     | `MORPHQL_PROVIDER`    |
| `runtime`    | `"node"`                    | `MORPHQL_RUNTIME`     |
| `cli_path`   | `"morphql"`                 | `MORPHQL_CLI_PATH`    |
| `node_path`  | `"node"`                    | `MORPHQL_NODE_PATH`   |
| `qjs_path`   | auto-resolved               | `MORPHQL_QJS_PATH`    |
| `cache_dir`  | `$TMPDIR/morphql`           | `MORPHQL_CACHE_DIR`   |
| `server_url` | `"http://localhost:3000"`   | `MORPHQL_SERVER_URL`  |
| `api_key`    | `None`                      | `MORPHQL_API_KEY`     |
| `timeout`    | `30` (seconds)              | `MORPHQL_TIMEOUT`     |

Priority: call kwarg > instance default > env var > hardcoded default.

## API

### Static

```python
MorphQL.execute(query, data=None, **options) -> str
MorphQL.execute_file(query_file, data=None, **options) -> str
```

### Instance

```python
morph = MorphQL(**defaults)
morph.run(query, data=None, **options) -> str
morph.run_file(query_file, data=None, **options) -> str
```

`data` accepts `str` (JSON), `dict`, `list`, or `None`.

## Exceptions

| Situation                  | Exception           |
|----------------------------|---------------------|
| `query` missing or empty   | `ValueError`        |
| Query file not found       | `FileNotFoundError` |
| CLI exits with error       | `RuntimeError`      |
| Server HTTP error          | `RuntimeError`      |
| Server unreachable         | `RuntimeError`      |

## Running tests

```bash
cd packages/python
PYTHONPATH=src python -m unittest discover tests/
# or with pytest:
pip install pytest
pytest
```

## License

MIT
