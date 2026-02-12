# MorphQL PHP

A minimalist PHP wrapper for [MorphQL](https://github.com/Hyperwindmill/morphql) — transform data with declarative queries.

**PHP 5.6+ compatible · Zero runtime dependencies · Composer-ready**

## Installation

```bash
composer require morphql/morphql
```

### Prerequisites

The package ships with a **bundled MorphQL engine** — the only requirement is **Node.js** (v18+).

Alternatively, you can use the **server provider** to connect to a remote MorphQL server instance, in which case Node.js is not required.

## Quick Start

```php
<?php
require 'vendor/autoload.php';

use MorphQL\MorphQL;

// One-shot transformation via CLI
$result = MorphQL::execute(
    'from json to json transform set greeting = "Hello, " + name',
    '{"name": "World"}'
);
// → '{"greeting":"Hello, World"}'
```

## Usage

### Static API

```php
// PHP 8+ with named parameters
$result = MorphQL::execute(
    query: 'from json to json transform set x = a + b',
    data: '{"a": 1, "b": 2}'
);

// PHP 5.6-7.x — single options array
$result = MorphQL::execute(array(
    'query' => 'from json to json transform set x = a + b',
    'data'  => '{"a": 1, "b": 2}',
));
```

### Reusable Instance

```php
// Preset defaults in the constructor
$morph = new MorphQL(array(
    'provider'   => 'server',
    'server_url' => 'http://localhost:3000',
    'api_key'    => 'my-secret',
));

$result = $morph->run('from json to xml', $data);
$other  = $morph->run('from json to json transform set id = uuid', $data2);
```

## Providers

| Provider | Backend               | Transport                  |
| :------- | :-------------------- | :------------------------- |
| `cli`    | Bundled engine (Node) | `proc_open()` / shell      |
| `server` | MorphQL REST server   | cURL / `file_get_contents` |

The CLI provider auto-detects the bundled engine shipped with this package. Falls back to a system-installed `morphql` if the bundle is missing.

## Configuration

Options are resolved in priority order: **call params → constructor → env vars → defaults**.

| Option       | Env Var              | Default                      | Description              |
| :----------- | :------------------- | :--------------------------- | :----------------------- |
| `provider`   | `MORPHQL_PROVIDER`   | `cli`                        | `cli` or `server`        |
| `cli_path`   | `MORPHQL_CLI_PATH`   | _(auto)_                     | Override CLI binary path |
| `node_path`  | `MORPHQL_NODE_PATH`  | `node`                       | Path to Node.js binary   |
| `cache_dir`  | `MORPHQL_CACHE_DIR`  | `sys_get_temp_dir()/morphql` | CLI query cache dir      |
| `server_url` | `MORPHQL_SERVER_URL` | `http://localhost:3000`      | Server base URL          |
| `api_key`    | `MORPHQL_API_KEY`    | _(none)_                     | API key for server auth  |
| `timeout`    | `MORPHQL_TIMEOUT`    | `30`                         | Timeout in seconds       |

### Environment Variables

```bash
export MORPHQL_PROVIDER=server
export MORPHQL_SERVER_URL=http://my-morphql:3000
export MORPHQL_API_KEY=secret123
```

## Error Handling

```php
try {
    $result = MorphQL::execute('invalid query', '{}');
} catch (\RuntimeException $e) {
    echo 'Transform failed: ' . $e->getMessage();
} catch (\InvalidArgumentException $e) {
    echo 'Bad input: ' . $e->getMessage();
}
```

## License

MIT © 2026 Hyperwindmill
