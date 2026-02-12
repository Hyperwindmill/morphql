# MorphQL PHP

A minimalist PHP wrapper for [MorphQL](https://github.com/Hyperwindmill/morphql) — transform data with declarative queries.

**PHP 5.6+ compatible · Zero runtime dependencies · Composer-ready**

## Installation

```bash
composer require morphql/morphql
```

### Prerequisites

You need **one** of these backends:

- **CLI** (default): Install `@morphql/cli` globally via `npm install -g @morphql/cli`
- **Server**: A running MorphQL server instance ([docs](https://hyperwindmill.github.io/morphql/guide/server))

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

| Provider | Backend             | Transport                  |
| :------- | :------------------ | :------------------------- |
| `cli`    | `@morphql/cli`      | `exec()` / shell           |
| `server` | MorphQL REST server | cURL / `file_get_contents` |

The server provider uses cURL when available and falls back to `file_get_contents` with stream contexts automatically.

## Configuration

Options are resolved in priority order: **call params → constructor → env vars → defaults**.

| Option       | Env Var              | Default                 | Description             |
| :----------- | :------------------- | :---------------------- | :---------------------- |
| `provider`   | `MORPHQL_PROVIDER`   | `cli`                   | `cli` or `server`       |
| `cli_path`   | `MORPHQL_CLI_PATH`   | `morphql`               | Path to CLI binary      |
| `server_url` | `MORPHQL_SERVER_URL` | `http://localhost:3000` | Server base URL         |
| `api_key`    | `MORPHQL_API_KEY`    | _(none)_                | API key for server auth |
| `timeout`    | `MORPHQL_TIMEOUT`    | `30`                    | Timeout in seconds      |

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
