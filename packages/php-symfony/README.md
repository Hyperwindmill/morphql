# MorphQL Symfony

Symfony integration for [MorphQL](https://github.com/Hyperwindmill/morphql) — transform data with declarative queries.

**YAML configuration · Autowiring · Twig-style file convention · PHP 8.1+**

## Installation

```bash
composer require morphql/morphql-symfony
```

## Configuration

Create `config/packages/morphql.yaml` to configure the bundle:

```yaml
morphql:
  # Execution provider: "cli" (bundled Node.js engine) or "server" (remote REST API)
  provider: cli

  # Optional: override paths
  node_path: "node"
  cli_path: ~

  # Cache directory for compiled queries
  cache_dir: "%kernel.cache_dir%/morphql"

  # Directory containing .morphql files (default: %kernel.project_dir%/morphql-queries)
  query_dir: "%kernel.project_dir%/morphql-queries"
```

## Usage

### 1. The `morphql-queries/` directory

Like Twig templates in `templates/`, you can store your MorphQL queries in `morphql-queries/`. Use the `.morphql` extension for syntax highlighting in supported IDEs.

```text
morphql-queries/
├── invoices/
│   └── to_xml.morphql        # Identifier: 'invoices/to_xml'
└── api_response.morphql      # Identifier: 'api_response'
```

### 2. Using the Transformation Registry

Inject the `TransformationRegistry` to run queries stored in files:

```php
use MorphQL\SymfonyBundle\TransformationRegistry;

class InvoiceService
{
    public function __construct(
        private readonly TransformationRegistry $registry
    ) {}

    public function process(array $data): string
    {
        // Resolves to morphql-queries/invoices/to_xml.morphql
        return $this->registry->transform('invoices/to_xml', $data);
    }
}
```

### 3. Direct MorphQL usage

For ad-hoc queries, you can inject the base `MorphQL` service:

```php
use MorphQL\MorphQL;

class MyController
{
    public function __construct(
        private readonly MorphQL $morphql
    ) {}

    public function index(string $json): string
    {
        return $this->morphql->run('from json to json transform set x = 1', $json);
    }
}
```

## Features

- **Filesystem Discovery**: Dot-notation is not required; use standard paths like `'sub/folder/query'`.
- **Pre-configured**: The `MorphQL` service is automatically configured from your YAML settings.
- **Isomorphic**: Switch between `cli` and `server` providers via config without changing your code.

## License

MIT
