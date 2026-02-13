# MorphQL Symfony

Symfony integration for [MorphQL](https://github.com/Hyperwindmill/morphql) — transform data with declarative queries.

**YAML configuration · Autowiring · Twig-style file convention · PHP 8.1+**

## Installation

```bash
composer require morphql/morphql-symfony
```

With **Symfony Flex** (Currently waiting for submission to [symfony/recipes-contrib](https://github.com/symfony/recipes-contrib)), this will automatically:

- Registers `MorphQLBundle` in `bundles.php`
- Creates `config/packages/morphql.yaml` with sensible defaults
- Scaffolds the `morphql-queries/` directory at your project root

> Without Flex, you could have to register the bundle manually in `config/bundles.php` (depends on your Symfony version):
>
> ```php
> MorphQL\SymfonyBundle\MorphQLBundle::class => ['all' => true],
> ```

**The bundle is fully zero-config.** All settings have sensible defaults — no YAML file is needed to get started. Just install, drop a `.morphql` file in `morphql-queries/`, and you're ready to go.

## Configuration (optional)

To customize behavior, create or edit `config/packages/morphql.yaml`:

```yaml
morphql:
  # Execution provider: "cli" (bundled Node.js engine) or "server" (remote REST API)
  # provider: cli

  # Directory containing .morphql query files
  # query_dir: '%kernel.project_dir%/morphql-queries'

  # Server provider settings (uncomment if using provider: server)
  # server_url: '%env(MORPHQL_SERVER_URL)%'
  # api_key: '%env(MORPHQL_API_KEY)%'
```

All options have sensible defaults — zero-config works out of the box.

### Full Configuration Reference

| Option       | Default                                | Description                                           |
| :----------- | :------------------------------------- | :---------------------------------------------------- |
| `provider`   | `cli`                                  | `cli` (bundled Node.js) or `server` (remote REST API) |
| `cli_path`   | _(auto)_                               | Override CLI binary path                              |
| `node_path`  | `node`                                 | Path to Node.js binary                                |
| `cache_dir`  | `%kernel.cache_dir%/morphql`           | Compiled query cache                                  |
| `query_dir`  | `%kernel.project_dir%/morphql-queries` | `.morphql` file directory                             |
| `server_url` | `http://localhost:3000`                | MorphQL server URL                                    |
| `api_key`    | —                                      | API key for server auth                               |
| `timeout`    | `30`                                   | Execution timeout (seconds)                           |

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

- **Symfony Flex Recipe**: Automatic bundle registration, config scaffolding, and query directory creation.
- **Filesystem Discovery**: Use standard paths like `'sub/folder/query'` — no dot-notation required.
- **Pre-configured**: The `MorphQL` service is automatically configured from your YAML settings.
- **Isomorphic**: Switch between `cli` and `server` providers via config without changing your code.

## Symfony Flex Recipe

The recipe files are staged in the [`recipe/`](./recipe/) directory and need to be submitted to [`symfony/recipes-contrib`](https://github.com/symfony/recipes-contrib) for Flex to pick them up automatically.

To submit the recipe:

1. Fork [symfony/recipes-contrib](https://github.com/symfony/recipes-contrib)
2. Create `morphql/morphql-symfony/0.1/` in the fork
3. Copy the contents of `recipe/` into that directory
4. Open a Pull Request following the [recipe contribution guide](https://github.com/symfony/recipes/blob/main/RECIPES.md)

Until the recipe is accepted, users can manually:

- Create `config/packages/morphql.yaml` (copy from `recipe/config/packages/morphql.yaml`)
- Create the `morphql-queries/` directory at their project root

## Troubleshooting

### "node" not found

If you use a version manager like **NVM**, **asdf**, or **Volta**, the `node` binary might not be in the default `PATH` used by your web server or PHP process.

**Solution 1: Set the path in .env**

```dotenv
MORPHQL_NODE_PATH=/usr/local/bin/node # Use 'which node' to find yours
```

**Solution 2: Create a system symlink**

```bash
sudo ln -s $(which node) /usr/local/bin/node
```

## Prerequisites

- **PHP 8.1+**
- **Node.js 18+** (for the `cli` provider)
- **Symfony 5.4+**, **6.x**, **7.x**, or **8.x**

## License

MIT
