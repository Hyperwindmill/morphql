# Symfony Integration

The MorphQL Symfony bundle provides first-class support for MorphQL in Symfony applications, including YAML configuration, service autowiring, and a Twig-inspired query discovery system.

## Installation

Install the bundle via Composer:

```bash
composer require morphql/morphql-symfony
```

**The bundle is fully zero-config.** All settings have sensible defaults — no YAML file is needed. Just install, drop a `.morphql` file in `morphql-queries/`, and start using the `TransformationRegistry`.

## Configuration (optional)

To customize behavior, create `config/packages/morphql.yaml`:

```yaml
morphql:
  # Execution provider: "cli" (standard) or "server" (remote)
  # provider: cli

  # Query directory (default: %kernel.project_dir%/morphql-queries)
  # query_dir: '%kernel.project_dir%/morphql-queries'

  # Server provider settings (uncomment if using provider: server)
  # server_url: '%env(MORPHQL_SERVER_URL)%'
  # api_key: '%env(MORPHQL_API_KEY)%'
```

## The Query Directory

Like Twig templates in `templates/`, the Symfony bundle looks for MorphQL queries in the `morphql-queries/` directory.

```text
morphql-queries/
├── invoices/
│   └── to_xml.morphql        # ID: 'invoices/to_xml'
└── api_response.morphql      # ID: 'api_response'
```

Your queries automatically benefit from syntax highlighting and validation if you have the MorphQL IDE extension installed.

## Usage

### Using the Registry

The `TransformationRegistry` is the recommended way to run queries stored in files. It resolves path-based identifiers to absolute file paths automatically.

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

### Direct Service Usage

You can also inject the base `MorphQL` service for ad-hoc queries:

```php
use MorphQL\MorphQL;

class MyController
{
    public function __construct(
        private readonly MorphQL $morphql
    ) {}

    public function run(string $query, $data): string
    {
        return $this->morphql->run($query, $data);
    }
}
```

## Advanced Patterns

### Dot Notation (Optional)

The registry supports both forward slashes and dots as separators. Both `'invoices/to_xml'` and `'invoices.to_xml'` resolve to the same file.

### Environment-specific Config

Use Symfony parameters or environment variables for dynamic configuration:

```yaml
morphql:
  provider: "%env(MORPHQL_PROVIDER)%"
  server_url: "%env(MORPHQL_SERVER_URL)%"
```

## Prerequisites

- **PHP 8.1+**
- **Node.js 18+** (for the `cli` provider)
- **Symfony 5.4+**, **6.x**, **7.x**, or **8.x**
