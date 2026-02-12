# PHP Library

Use MorphQL directly from PHP applications. The package ships with a bundled MorphQL engine — the only external requirement is **Node.js** (v18+).

## Installation

```bash
composer require morphql/morphql
```

[![Packagist Version](https://img.shields.io/packagist/v/morphql/morphql)](https://packagist.org/packages/morphql/morphql)

## Quick Start

```php
<?php
require 'vendor/autoload.php';

use MorphQL\MorphQL;

$result = MorphQL::execute(
    'from json to json transform set greeting = "Hello, " + name',
    '{"name": "World"}'
);
// → '{"greeting":"Hello, World"}'
```

## Usage

### Static API

The `execute()` method supports both modern named parameters (PHP 8+) and a single-array calling convention for older PHP versions:

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

Create an instance with preset defaults when you need to run multiple transformations with the same configuration:

```php
$morph = new MorphQL(array(
    'provider'   => 'server',
    'server_url' => 'http://localhost:3000',
    'api_key'    => 'my-secret',
));

$result = $morph->run('from json to xml', $data);
$other  = $morph->run('from csv to json', $csvData);
```

## Providers

The library supports two execution providers:

| Provider        | Backend                    | Transport                  |
| :-------------- | :------------------------- | :------------------------- |
| `cli` (default) | Bundled engine via Node.js | `proc_open()`              |
| `server`        | MorphQL REST server        | cURL / `file_get_contents` |

The `cli` provider uses a bundled copy of the MorphQL engine that ships with the package — no separate installation needed. The `server` provider connects to a remote [MorphQL server instance](./server.md).

## Configuration

Options are resolved in priority order: **call params → constructor → env vars → defaults**.

| Option       | Env Var              | Default          | Description              |
| :----------- | :------------------- | :--------------- | :----------------------- |
| `provider`   | `MORPHQL_PROVIDER`   | `cli`            | `cli` or `server`        |
| `cli_path`   | `MORPHQL_CLI_PATH`   | _(auto)_         | Override CLI binary path |
| `node_path`  | `MORPHQL_NODE_PATH`  | `node`           | Path to Node.js binary   |
| `cache_dir`  | `MORPHQL_CACHE_DIR`  | System temp dir  | CLI query cache dir      |
| `server_url` | `MORPHQL_SERVER_URL` | `localhost:3000` | Server base URL          |
| `api_key`    | `MORPHQL_API_KEY`    | —                | API key for server auth  |
| `timeout`    | `MORPHQL_TIMEOUT`    | `30`             | Timeout in seconds       |

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

## Compatibility

- **PHP 5.6+** — No type hints, `array()` syntax, compatible with legacy codebases
- **Node.js 18+** — Required for the bundled CLI provider
- **Zero Composer dependencies** — Only `phpunit` for development

## Source

- [Packagist](https://packagist.org/packages/morphql/morphql)
- [GitHub (mirror)](https://github.com/Hyperwindmill/morphql-php)
- [Source (monorepo)](https://github.com/Hyperwindmill/morphql/tree/main/packages/php)
