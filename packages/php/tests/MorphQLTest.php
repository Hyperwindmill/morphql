<?php

namespace MorphQL\Tests;

use MorphQL\MorphQL;
use PHPUnit\Framework\TestCase;

class MorphQLTest extends TestCase
{
    // ------------------------------------------------------------------
    //  Array Detection in execute()
    // ------------------------------------------------------------------

    public function testExecuteWithArrayDetectsOptionsBag()
    {
        // Should not throw InvalidArgumentException for missing 'query'
        // when passed as part of the options array
        try {
            MorphQL::execute(array(
                'query' => 'from json to json transform set x = 1',
                'data'  => '{"a":1}',
            ));
            // If CLI is available, this succeeds
            $this->assertTrue(true);
        } catch (\RuntimeException $e) {
            // CLI might not be installed — that's okay for this test,
            // we're verifying array detection, not CLI execution.
            $this->assertStringContainsString('MorphQL CLI error', $e->getMessage());
        }
    }

    public function testExecuteWithArrayRequiresQuery()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('missing required option "query"');

        MorphQL::execute(array('data' => '{"a":1}'));
    }

    // ------------------------------------------------------------------
    //  Config Resolution
    // ------------------------------------------------------------------

    public function testDefaultProviderIsCli()
    {
        // Reflection to test resolveConfig
        $method = new \ReflectionMethod(MorphQL::class, 'resolveConfig');
        $method->setAccessible(true);

        $config = $method->invoke(null, array(), array());

        $this->assertEquals('cli', $config['provider']);
        $this->assertEquals('morphql', $config['cli_path']);
        $this->assertEquals('http://localhost:3000', $config['server_url']);
        $this->assertNull($config['api_key']);
        $this->assertEquals(30, $config['timeout']);
    }

    public function testCallOptionsTakePrecedence()
    {
        $method = new \ReflectionMethod(MorphQL::class, 'resolveConfig');
        $method->setAccessible(true);

        $config = $method->invoke(
            null,
            array('provider' => 'server', 'timeout' => 5),
            array('provider' => 'cli', 'timeout' => 60)
        );

        $this->assertEquals('server', $config['provider']);
        $this->assertEquals(5, $config['timeout']);
    }

    public function testInstanceDefaultsFallback()
    {
        $method = new \ReflectionMethod(MorphQL::class, 'resolveConfig');
        $method->setAccessible(true);

        $config = $method->invoke(
            null,
            array(), // no call options
            array('provider' => 'server', 'api_key' => 'test-key')
        );

        $this->assertEquals('server', $config['provider']);
        $this->assertEquals('test-key', $config['api_key']);
    }

    public function testEnvVarsFallback()
    {
        putenv('MORPHQL_PROVIDER=server');
        putenv('MORPHQL_SERVER_URL=http://env-host:4000');

        $method = new \ReflectionMethod(MorphQL::class, 'resolveConfig');
        $method->setAccessible(true);

        $config = $method->invoke(null, array(), array());

        $this->assertEquals('server', $config['provider']);
        $this->assertEquals('http://env-host:4000', $config['server_url']);

        // Clean up
        putenv('MORPHQL_PROVIDER');
        putenv('MORPHQL_SERVER_URL');
    }

    // ------------------------------------------------------------------
    //  Data Normalization
    // ------------------------------------------------------------------

    public function testNormalizeDataWithNull()
    {
        $method = new \ReflectionMethod(MorphQL::class, 'normalizeData');
        $method->setAccessible(true);

        $this->assertEquals('{}', $method->invoke(null, null));
    }

    public function testNormalizeDataWithArray()
    {
        $method = new \ReflectionMethod(MorphQL::class, 'normalizeData');
        $method->setAccessible(true);

        $result = $method->invoke(null, array('name' => 'Alice'));
        $this->assertEquals('{"name":"Alice"}', $result);
    }

    public function testNormalizeDataWithString()
    {
        $method = new \ReflectionMethod(MorphQL::class, 'normalizeData');
        $method->setAccessible(true);

        $this->assertEquals('{"a":1}', $method->invoke(null, '{"a":1}'));
    }

    // ------------------------------------------------------------------
    //  Instance API
    // ------------------------------------------------------------------

    public function testInstanceRunUsesDefaults()
    {
        $morph = new MorphQL(array(
            'provider' => 'cli',
            'cli_path' => '/nonexistent/morphql',
        ));

        try {
            $morph->run('from json to json', '{}');
            $this->fail('Expected RuntimeException');
        } catch (\RuntimeException $e) {
            // Expected — the binary doesn't exist
            $this->assertStringContainsString('MorphQL CLI error', $e->getMessage());
        }
    }

    // ------------------------------------------------------------------
    //  File-based Execution
    // ------------------------------------------------------------------

    public function testExecuteFileThrowsOnMissingFile()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('MorphQL: query file not found');

        MorphQL::executeFile('/tmp/nonexistent-' . uniqid() . '.morphql', '{}');
    }

    public function testRunFileThrowsOnMissingFile()
    {
        $morph = new MorphQL();

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('MorphQL: query file not found');

        $morph->runFile('/tmp/nonexistent-' . uniqid() . '.morphql', '{}');
    }

    // ------------------------------------------------------------------
    //  CLI Integration (requires @morphql/cli installed)
    // ------------------------------------------------------------------

    public function testCliIntegrationWithQueryFile()
    {
        exec('which morphql 2>/dev/null', $output, $exitCode);
        if ($exitCode !== 0) {
            $this->markTestSkipped('morphql CLI is not installed');
        }

        $tmpFile = tempnam(sys_get_temp_dir(), 'morphql-test-');
        rename($tmpFile, $tmpFile . '.morphql');
        $tmpFile .= '.morphql';

        file_put_contents($tmpFile, 'from json to json transform set greeting = "Hello"');

        try {
            $result = MorphQL::executeFile($tmpFile, '{"name":"World"}');
            $decoded = json_decode($result, true);
            $this->assertEquals('Hello', $decoded['greeting']);
        } finally {
            unlink($tmpFile);
        }
    }

    public function testCliIntegrationSimpleTransform()
    {
        // Check if morphql CLI is available
        exec('which morphql 2>/dev/null', $output, $exitCode);
        if ($exitCode !== 0) {
            // Also try npx
            exec('which npx 2>/dev/null', $output2, $exitCode2);
            if ($exitCode2 !== 0) {
                $this->markTestSkipped('morphql CLI is not installed');
            }
        }

        $result = MorphQL::execute(
            'from json to json transform set greeting = "Hello"',
            '{"name":"World"}'
        );

        $decoded = json_decode($result, true);
        $this->assertNotNull($decoded, 'Result should be valid JSON');
        $this->assertEquals('Hello', $decoded['greeting']);
    }

    public function testCliIntegrationIdentityTransform()
    {
        exec('which morphql 2>/dev/null', $output, $exitCode);
        if ($exitCode !== 0) {
            $this->markTestSkipped('morphql CLI is not installed');
        }

        $input  = '{"a":1,"b":"two"}';
        $result = MorphQL::execute('from json to json', $input);

        $decoded = json_decode($result, true);
        $this->assertNotNull($decoded, 'Result should be valid JSON');
        $this->assertEquals(1, $decoded['a']);
        $this->assertEquals('two', $decoded['b']);
    }
}
