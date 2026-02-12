<?php

namespace MorphQL\SymfonyBundle;

use MorphQL\MorphQL;

class TransformationRegistry
{
    public function __construct(
        private readonly MorphQL $morphql,
        private readonly string $queryDir,
    ) {}

    /**
     * Execute a transformation by file path identifier.
     *
     * The identifier is a path relative to query_dir, without the .morphql extension.
     * Example: 'invoices/to_xml' → morphql-queries/invoices/to_xml.morphql
     *
     * @param string $name
     * @param string|array|null $data
     * @return string
     * @throws \InvalidArgumentException If the .morphql file does not exist
     */
    public function transform(string $name, string|array|null $data = null): string
    {
        $filePath = $this->resolve($name);
        return $this->morphql->runFile($filePath, $data);
    }

    /**
     * Resolve a transformation name to its absolute file path.
     *
     * @param string $name
     * @return string
     * @throws \InvalidArgumentException If the file does not exist
     */
    public function resolve(string $name): string
    {
        // Append .morphql if not present
        $relativePath = str_ends_with($name, '.morphql') ? $name : $name . '.morphql';
        $filePath = $this->queryDir . '/' . $relativePath;

        if (!file_exists($filePath)) {
            throw new \InvalidArgumentException(sprintf(
                'MorphQL query file not found: "%s" (looked in %s)',
                $name,
                $filePath,
            ));
        }

        return $filePath;
    }

    /**
     * Check if a transformation file exists.
     *
     * @param string $name
     * @return bool
     */
    public function has(string $name): bool
    {
        $relativePath = str_ends_with($name, '.morphql') ? $name : $name . '.morphql';
        return file_exists($this->queryDir . '/' . $relativePath);
    }

    /**
     * List all available transformation names discovered from the filesystem.
     *
     * @return string[] Sorted list of path-based identifiers (without .morphql extension)
     */
    public function list(): array
    {
        $names = [];

        if (!is_dir($this->queryDir)) {
            return $names;
        }

        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($this->queryDir, \FilesystemIterator::SKIP_DOTS),
        );

        foreach ($iterator as $file) {
            /** @var \SplFileInfo $file */
            if ($file->getExtension() === 'morphql') {
                $relative = substr($file->getPathname(), strlen($this->queryDir) + 1);
                $names[] = substr($relative, 0, -strlen('.morphql'));
            }
        }

        sort($names);
        return $names;
    }

    /**
     * Get the configured query directory path.
     *
     * @return string
     */
    public function getQueryDir(): string
    {
        return $this->queryDir;
    }
}
