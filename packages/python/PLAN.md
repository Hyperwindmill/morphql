# MorphQL Python Library — Plan

Libreria Python ispirata al wrapper PHP (`packages/php/src/MorphQL.php`).
Unico file, zero dipendenze esterne obbligatorie, Python >= 3.8.

---

## Struttura del package

```
packages/python/
├── PLAN.md
├── pyproject.toml          # build system (setuptools)
├── README.md
├── LICENSE
├── src/
│   └── morphql/
│       ├── __init__.py     # espone MorphQL, execute, execute_file
│       └── morphql.py      # implementazione principale
└── tests/
    ├── test_cli.py
    └── test_server.py
```

---

## API pubblica

### Statica (one-shot)

```python
# Query inline
MorphQL.execute(query, data=None, **options) -> str

# Query da file .morphql
MorphQL.execute_file(query_file, data=None, **options) -> str
```

### Istanza (con defaults preset)

```python
morph = MorphQL(provider="server", server_url="http://localhost:3000")
morph.run(query, data=None, **options) -> str
morph.run_file(query_file, data=None, **options) -> str
```

---

## Opzioni

| Chiave        | Default                | Env var               | Note                              |
|---------------|------------------------|-----------------------|-----------------------------------|
| `provider`    | `"cli"`                | `MORPHQL_PROVIDER`    | `"cli"` o `"server"`             |
| `runtime`     | `"node"`               | `MORPHQL_RUNTIME`     | `"node"` o `"qjs"`              |
| `cli_path`    | `"morphql"`            | `MORPHQL_CLI_PATH`    | Path al binario CLI               |
| `node_path`   | `"node"`               | `MORPHQL_NODE_PATH`   | Path a Node.js                    |
| `qjs_path`    | `None`                 | `MORPHQL_QJS_PATH`    | Risolto lazily al binario bundled |
| `cache_dir`   | `None`                 | `MORPHQL_CACHE_DIR`   | Default: `tempfile.gettempdir()/morphql` |
| `server_url`  | `"http://localhost:3000"` | `MORPHQL_SERVER_URL` |                                  |
| `api_key`     | `None`                 | `MORPHQL_API_KEY`     | Header `X-API-KEY`               |
| `timeout`     | `30`                   | `MORPHQL_TIMEOUT`     | Secondi                           |

Priorità risoluzione: `kwarg chiamata` > `default istanza` > `env var` > `hardcoded default`

---

## Provider CLI

- Usa `subprocess.run` (Python 3.5+) con `stdout=PIPE`, `stderr=PIPE`
- Flag CLI identici al PHP: `-q <query>` o `-Q <file>`, `-i <data>`, `--cache-dir <dir>`
- `NODE_NO_WARNINGS=1` iniettato nell'env per sopprimere output di Node.js
- `data` normalizzato a stringa JSON (se dict/list → `json.dumps`)
- Exit code != 0 → solleva `RuntimeError` con messaggio stderr

### Risoluzione comando CLI (priority):
1. `cli_path` != `"morphql"` → usato direttamente
2. `<package_dir>/bin/morphql.js` esiste → `node <path>`
3. Fallback: `cli_path` di sistema

### Runtime QuickJS:
- Risolve binario `qjs` per OS (linux-x86_64, darwin, windows-x86_64.exe)
- Cerca in: `bin/`, `cache_dir/`, poi tenta download da GitHub releases quickjs-ng
- Bundle JS: `../../cli/dist/qjs/qjs.js` (monorepo) o `bin/qjs.js` (distribuito)

---

## Provider Server

- Endpoint: `POST {server_url}/v1/execute`
- Body JSON: `{"query": "...", "data": ...}`
- Header: `Content-Type: application/json`, opzionale `X-API-KEY`
- Usa `urllib.request` (stdlib) — nessuna dipendenza esterna
- `data` stringa JSON → decodificata prima dell'invio (come PHP)
- Response JSON `{"success": true, "result": ...}` → ritorna `result`
- Errori HTTP o `success: false` → `RuntimeError`

---

## Eccezioni

| Situazione                  | Eccezione              |
|-----------------------------|------------------------|
| `query` mancante            | `ValueError`           |
| File `.morphql` non trovato | `FileNotFoundError`    |
| CLI exit code != 0          | `RuntimeError`         |
| Server HTTP error           | `RuntimeError`         |
| Server unreachable          | `RuntimeError`         |

---

## Packaging (PyPI)

```toml
# pyproject.toml
[build-system]
requires = ["setuptools>=61"]
build-backend = "setuptools.backends.legacy:build"

[project]
name = "morphql"
version = "0.1.0"
requires-python = ">=3.8"
dependencies = []   # zero dipendenze obbligatorie
```

---

## Test

- `test_cli.py` — mocka `subprocess.run`, verifica flag e output
- `test_server.py` — mocka `urllib.request.urlopen`, verifica payload e risposta
- Usa solo `unittest` (stdlib), nessun pytest richiesto (ma compatibile)

---

## Differenze rispetto al PHP

| Aspetto           | PHP                        | Python                        |
|-------------------|----------------------------|-------------------------------|
| Versione minima   | PHP 5.6                    | Python 3.8                    |
| HTTP client       | cURL + file_get_contents   | `urllib.request` (stdlib)     |
| Subprocess        | `proc_open`                | `subprocess.run`              |
| Naming convention | `camelCase` / `snake_case` | `snake_case` ovunque          |
| Packaging         | Composer                   | PyPI (`pyproject.toml`)       |
| Namespace         | `MorphQL\MorphQL`          | `morphql.MorphQL`             |
