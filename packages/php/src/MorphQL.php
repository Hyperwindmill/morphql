<?php
/**
 * MorphQL PHP Wrapper
 *
 * A minimalist PHP client for MorphQL — transform data with declarative queries.
 * Delegates execution to the MorphQL CLI or server via pluggable providers.
 *
 * @link    https://github.com/Hyperwindmill/morphql
 * @license MIT
 * @version 0.1.0
 *
 * Requires PHP >= 5.6. No external dependencies.
 */

namespace MorphQL;

class MorphQL
{
    const PROVIDER_CLI    = 'cli';
    const PROVIDER_SERVER = 'server';

    const RUNTIME_NODE = 'node';
    const RUNTIME_QJS  = 'qjs';

    /**
     * Default option values.
     *
     * @var array
     */
    private static $optionDefaults = array(
        'provider'   => self::PROVIDER_CLI,
        'runtime'    => self::RUNTIME_NODE,
        'cli_path'   => 'morphql',
        'node_path'  => 'node',
        'qjs_path'   => null, // resolved lazily to bundled binary if available
        'cache_dir'  => null, // resolved lazily to sys_get_temp_dir() . '/morphql'
        'server_url' => 'http://localhost:3000',
        'api_key'    => null,
        'timeout'    => 30,
    );

    /**
     * Instance-level preset options (set via constructor).
     *
     * @var array
     */
    private $defaults;

    // ------------------------------------------------------------------
    //  Construction
    // ------------------------------------------------------------------

    /**
     * Create a reusable MorphQL instance with preset options.
     *
     * PHP 8+ example with named parameters:
     *   $morph = new MorphQL(provider: 'server', server_url: 'http://my-host:3000');
     *
     * PHP 5.6-7.x:
     *   $morph = new MorphQL(array('provider' => 'server', 'server_url' => 'http://my-host:3000'));
     *
     * @param array $options Preset options merged with env/defaults.
     */
    public function __construct($options = array())
    {
        $this->defaults = $options;
    }

    // ------------------------------------------------------------------
    //  Public API
    // ------------------------------------------------------------------

    /**
     * Static one-shot execution.
     *
     * Supports two calling conventions:
     *
     * 1) Positional / named params (PHP 8+):
     *      MorphQL::execute('from json to json ...', '{"a":1}');
     *      MorphQL::execute(query: '...', data: '{"a":1}', provider: 'server');
     *
     * 2) Options-array (PHP 5.6-7.x convenience):
     *      MorphQL::execute(array('query' => '...', 'data' => '{"a":1}'));
     *
     * @param string|array $queryOrOptions  Query string, or options array if sole argument.
     * @param string|array|null $data       Source data (string or associative array).
     * @param array $options                Additional options (provider, cli_path, etc.).
     *
     * @return string Transformation result.
     *
     * @throws \InvalidArgumentException On missing query.
     * @throws \RuntimeException         On execution failure.
     */
    public static function execute($queryOrOptions, $data = null, $options = array())
    {
        // Detect single-array calling convention
        if (is_array($queryOrOptions) && $data === null) {
            $merged  = $queryOrOptions;
            $query   = self::requireKey($merged, 'query');
            $data    = isset($merged['data']) ? $merged['data'] : null;
            $options = $merged;
        } else {
            $query = $queryOrOptions;
        }

        $config = self::resolveConfig($options);

        return self::dispatch($query, $data, $config);
    }

    /**
     * Static one-shot execution from a .morphql file.
     *
     * @param string            $queryFile  Path to the .morphql file.
     * @param string|array|null $data       Source data.
     * @param array             $options    Additional options.
     *
     * @return string Transformation result.
     */
    public static function executeFile($queryFile, $data = null, $options = array())
    {
        self::validateQueryFile($queryFile);
        $config = self::resolveConfig($options);

        return self::dispatch(null, $data, $config, $queryFile);
    }

    /**
     * Instance-based execution using preset defaults.
     *
     * @param string            $query   MorphQL query string.
     * @param string|array|null $data    Source data.
     * @param array             $options Per-call overrides.
     *
     * @return string Transformation result.
     */
    public function run($query, $data = null, $options = array())
    {
        $config = self::resolveConfig($options, $this->defaults);

        return self::dispatch($query, $data, $config);
    }

    /**
     * Instance-based execution from a .morphql file.
     *
     * @param string            $queryFile  Absolute path to a .morphql file.
     * @param string|array|null $data       Source data.
     * @param array             $options    Per-call overrides.
     *
     * @return string Transformation result.
     *
     * @throws \InvalidArgumentException If the file does not exist.
     * @throws \RuntimeException         On execution failure.
     */
    public function runFile($queryFile, $data = null, $options = array())
    {
        self::validateQueryFile($queryFile);
        $config = self::resolveConfig($options, $this->defaults);

        return self::dispatch(null, $data, $config, $queryFile);
    }

    // ------------------------------------------------------------------
    //  Dispatch
    // ------------------------------------------------------------------

    /**
     * Route execution to the configured provider.
     *
     * @param string|null       $query
     * @param string|array|null $data
     * @param array             $config     Fully resolved configuration.
     * @param string|null       $queryFile  Optional path to a .morphql file.
     *
     * @return string
     */
    private static function dispatch($query, $data, $config, $queryFile = null)
    {
        if ($config['provider'] === self::PROVIDER_SERVER) {
            return self::executeViaServer($query, $data, $config, $queryFile);
        }

        return self::executeViaCli($query, $data, $config, $queryFile);
    }

    // ------------------------------------------------------------------
    //  CLI Provider
    // ------------------------------------------------------------------

    /**
     * Execute a transformation via the MorphQL CLI binary.
     *
     * Uses `exec()` with `-i` (inline input) and `-q` (query) flags.
     * The CLI writes the result to stdout.
     *
     * @param string|null       $query
     * @param string|array|null $data
     * @param array             $config
     * @param string|null       $queryFile
     *
     * @return string
     *
     * @throws \RuntimeException If the CLI exits with a non-zero code.
     */
    private static function executeViaCli($query, $data, $config, $queryFile = null)
    {
        $dataStr = self::normalizeData($data);
        $cliCmd  = self::resolveCliCommand($config);

        if ($queryFile !== null) {
            $cmd = sprintf(
                '%s -Q %s -i %s --cache-dir %s',
                $cliCmd,
                escapeshellarg($queryFile),
                escapeshellarg($dataStr),
                escapeshellarg(self::resolveCacheDir($config))
            );
        } else {
            $cmd = sprintf(
                '%s -q %s -i %s --cache-dir %s',
                $cliCmd,
                escapeshellarg($query),
                escapeshellarg($dataStr),
                escapeshellarg(self::resolveCacheDir($config))
            );
        }

        // For QuickJS, we don't need to specify flags if we use the standalone bundle correctly,
        // but our src/qjs.ts supports the same flags -q, -Q, -i, -f, -t

        $descriptors = array(
            0 => array('pipe', 'r'), // stdin
            1 => array('pipe', 'w'), // stdout
            2 => array('pipe', 'w'), // stderr (captured separately)
        );

        // Suppress Node.js warnings that pollute output
        $env = array_merge(
            self::getEnvArray(),
            array('NODE_NO_WARNINGS' => '1')
        );

        $process = proc_open($cmd, $descriptors, $pipes, null, $env);

        if (!is_resource($process)) {
            throw new \RuntimeException('MorphQL: failed to start CLI process');
        }

        fclose($pipes[0]); // close stdin
        $stdout = stream_get_contents($pipes[1]);
        $stderr = stream_get_contents($pipes[2]);
        fclose($pipes[1]);
        fclose($pipes[2]);
        $exitCode = proc_close($process);

        if ($exitCode !== 0) {
            $errorMsg = trim($stderr) !== '' ? trim($stderr) : trim($stdout);
            throw new \RuntimeException(
                'MorphQL CLI error (exit code ' . $exitCode . '): ' . $errorMsg
            );
        }

        return trim($stdout);
    }

    /**
     * Get current environment variables as an array.
     *
     * @return array
     */
    private static function getEnvArray()
    {
        // $_ENV may be empty if variables_order doesn't include 'E'
        if (!empty($_ENV)) {
            return $_ENV;
        }
        // Fallback: build from getenv() (PHP 7.1+) or return empty
        if (function_exists('getenv') && PHP_VERSION_ID >= 70100) {
            $env = getenv();
            return is_array($env) ? $env : array();
        }
        return array();
    }

    /**
     * Resolve the CLI command to use.
     *
     * Priority:
     *   1. Explicit cli_path (if user overrode the default)
     *   2. Bundled bin/morphql.js (shipped with this package, invoked via node)
     *   3. System-installed "morphql" binary
     *
     * @param array $config
     *
     * @return string Shell-safe command string.
     */
    private static function resolveCliCommand($config)
    {
        if ($config['runtime'] === self::RUNTIME_QJS) {
            return self::resolveQjsCommand($config);
        }

        // 1. User explicitly set a custom cli_path → use it directly
        if (isset($config['cli_path']) && $config['cli_path'] !== 'morphql') {
            return escapeshellarg($config['cli_path']);
        }

        // 2. Bundled binary (shipped with this Composer package)
        $bundled = __DIR__ . '/../bin/morphql.js';
        if (file_exists($bundled)) {
            $node = isset($config['node_path']) ? $config['node_path'] : 'node';
            return escapeshellarg($node) . ' ' . escapeshellarg(realpath($bundled));
        }

        // 3. Fall back to system-installed morphql
        return escapeshellarg($config['cli_path']);
    }

    /**
     * Resolve the QuickJS command to use.
     *
     * @param array $config
     * @return string
     */
    private static function resolveQjsCommand($config)
    {
        $qjsBin = $config['qjs_path'];

        if (!$qjsBin) {
            // Try to find bundled binary based on OS
            $os = strtolower(PHP_OS);
            $suffix = '';
            if (strpos($os, 'win') !== false) {
                $suffix = '-windows-x86_64.exe';
            } elseif (strpos($os, 'darwin') !== false) {
                $suffix = '-darwin'; 
            } else {
                $suffix = '-linux-x86_64';
            }

            $bundledBin = __DIR__ . '/../bin/qjs' . $suffix;
            if (file_exists($bundledBin)) {
                $qjsBin = realpath($bundledBin);
            } else {
                $qjsBin = 'qjs'; // fallback to system path
            }
        }

        // Resolve the standalone JS bundle
        // 1. Check if we are in the monorepo structure
        $bundle = __DIR__ . '/../../cli/dist/qjs/qjs.js';
        if (!file_exists($bundle)) {
            // 2. Check if we are in the distributed structure (where it might be in bin/)
            $bundle = __DIR__ . '/../bin/qjs.js';
        }

        if (!file_exists($bundle)) {
            throw new \RuntimeException('MorphQL: QuickJS bundle not found. Please run build:qjs or install it.');
        }

        return escapeshellarg($qjsBin) . ' --std -m ' . escapeshellarg(realpath($bundle));
    }

    /**
     * Resolve the cache directory for CLI compiled queries.
     *
     * Defaults to sys_get_temp_dir()/morphql to avoid polluting
     * the application's working directory with a .compiled folder.
     *
     * @param array $config
     *
     * @return string Absolute path to the cache directory.
     */
    private static function resolveCacheDir($config)
    {
        if (isset($config['cache_dir']) && $config['cache_dir'] !== null) {
            return $config['cache_dir'];
        }

        return sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'morphql';
    }

    // ------------------------------------------------------------------
    //  Server Provider
    // ------------------------------------------------------------------

    /**
     * Execute a transformation via the MorphQL REST server.
     *
     * Tries cURL first; falls back to file_get_contents with stream context.
     *
     * @param string|null       $query
     * @param string|array|null $data
     * @param array             $config
     * @param string|null       $queryFile
     *
     * @return mixed The transformation result (decoded from JSON response).
     *
     * @throws \RuntimeException On network or server errors.
     */
    private static function executeViaServer($query, $data, $config, $queryFile = null)
    {
        if ($queryFile !== null) {
            $query = trim(file_get_contents($queryFile));
        }

        // The server expects data as a decoded object, not a raw string.
        if (is_string($data)) {
            $decoded = json_decode($data, true);
            if ($decoded !== null) {
                $data = $decoded;
            }
        }

        $payload = json_encode(array(
            'query' => $query,
            'data'  => $data,
        ));

        $url = rtrim($config['server_url'], '/') . '/v1/execute';

        if (function_exists('curl_init')) {
            $body = self::httpPostCurl($url, $payload, $config);
        } else {
            $body = self::httpPostStream($url, $payload, $config);
        }

        $response = json_decode($body, true);

        if (!$response || empty($response['success'])) {
            $msg = isset($response['message']) ? $response['message'] : $body;
            throw new \RuntimeException('MorphQL server error: ' . $msg);
        }

        return $response['result'];
    }

    /**
     * HTTP POST via cURL.
     *
     * @param string $url
     * @param string $payload  JSON-encoded body.
     * @param array  $config
     *
     * @return string Response body.
     *
     * @throws \RuntimeException On cURL failure.
     */
    private static function httpPostCurl($url, $payload, $config)
    {
        $ch = curl_init($url);

        $headers = array('Content-Type: application/json');
        if (isset($config['api_key']) && $config['api_key'] !== null) {
            $headers[] = 'X-API-KEY: ' . $config['api_key'];
        }

        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, (int) $config['timeout']);

        $body    = curl_exec($ch);
        $errNo   = curl_errno($ch);
        $errMsg  = curl_error($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($errNo !== 0) {
            throw new \RuntimeException(
                'MorphQL server unreachable (cURL error ' . $errNo . '): ' . $errMsg
            );
        }

        if ($httpCode >= 400) {
            throw new \RuntimeException(
                'MorphQL server returned HTTP ' . $httpCode . ': ' . $body
            );
        }

        return $body;
    }

    /**
     * HTTP POST via file_get_contents (fallback when cURL is unavailable).
     *
     * @param string $url
     * @param string $payload  JSON-encoded body.
     * @param array  $config
     *
     * @return string Response body.
     *
     * @throws \RuntimeException On connection failure.
     */
    private static function httpPostStream($url, $payload, $config)
    {
        $headerStr = "Content-Type: application/json\r\n";
        if (isset($config['api_key']) && $config['api_key'] !== null) {
            $headerStr .= "X-API-KEY: " . $config['api_key'] . "\r\n";
        }

        $context = stream_context_create(array(
            'http' => array(
                'method'  => 'POST',
                'header'  => $headerStr,
                'content' => $payload,
                'timeout' => (float) $config['timeout'],
                'ignore_errors' => true,
            ),
        ));

        $body = @file_get_contents($url, false, $context);

        if ($body === false) {
            throw new \RuntimeException('MorphQL server unreachable: ' . $url);
        }

        return $body;
    }

    // ------------------------------------------------------------------
    //  Config Resolution
    // ------------------------------------------------------------------

    /**
     * Merge configuration from call options → instance defaults → env vars → hardcoded defaults.
     *
     * @param array $options   Per-call options.
     * @param array $defaults  Instance-level defaults (from constructor).
     *
     * @return array Fully resolved configuration.
     */
    private static function resolveConfig($options = array(), $defaults = array())
    {
        $envMap = array(
            'provider'   => 'MORPHQL_PROVIDER',
            'runtime'    => 'MORPHQL_RUNTIME',
            'cli_path'   => 'MORPHQL_CLI_PATH',
            'node_path'  => 'MORPHQL_NODE_PATH',
            'qjs_path'   => 'MORPHQL_QJS_PATH',
            'cache_dir'  => 'MORPHQL_CACHE_DIR',
            'server_url' => 'MORPHQL_SERVER_URL',
            'api_key'    => 'MORPHQL_API_KEY',
            'timeout'    => 'MORPHQL_TIMEOUT',
        );

        $config = array();

        foreach (self::$optionDefaults as $key => $default) {
            // 1. Explicit call option
            if (isset($options[$key])) {
                $config[$key] = $options[$key];
                continue;
            }

            // 2. Instance default
            if (isset($defaults[$key])) {
                $config[$key] = $defaults[$key];
                continue;
            }

            // 3. Environment variable
            if (isset($envMap[$key])) {
                $env = getenv($envMap[$key]);
                if ($env !== false && $env !== '') {
                    $config[$key] = $env;
                    continue;
                }
            }

            // 4. Hardcoded default
            $config[$key] = $default;
        }

        return $config;
    }

    // ------------------------------------------------------------------
    //  Helpers
    // ------------------------------------------------------------------

    /**
     * Normalize data to a JSON string for CLI transport.
     *
     * @param string|array|object|null $data
     *
     * @return string
     */
    private static function normalizeData($data)
    {
        if ($data === null) {
            return '{}';
        }

        if (is_array($data) || is_object($data)) {
            return json_encode($data);
        }

        return (string) $data;
    }

    /**
     * Require a key from an options array.
     *
     * @param array  $options
     * @param string $key
     *
     * @return mixed
     *
     * @throws \InvalidArgumentException If the key is missing.
     */
    private static function requireKey($options, $key)
    {
        if (!isset($options[$key])) {
            throw new \InvalidArgumentException(
                'MorphQL: missing required option "' . $key . '"'
            );
        }

        return $options[$key];
    }

    /**
     * Validate that a query file exists and is readable.
     *
     * @param string $path
     *
     * @throws \InvalidArgumentException
     */
    private static function validateQueryFile($path)
    {
        if (!file_exists($path)) {
            throw new \InvalidArgumentException('MorphQL: query file not found: ' . $path);
        }
        if (!is_readable($path)) {
            throw new \InvalidArgumentException('MorphQL: query file not readable: ' . $path);
        }
    }
}
