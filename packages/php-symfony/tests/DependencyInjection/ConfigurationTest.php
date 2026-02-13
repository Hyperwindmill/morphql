<?php

namespace MorphQL\SymfonyBundle\Tests\DependencyInjection;

use MorphQL\SymfonyBundle\DependencyInjection\Configuration;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Config\Definition\Processor;

class ConfigurationTest extends TestCase
{
    private function process(array $config): array
    {
        return (new Processor())->processConfiguration(new Configuration(), [$config]);
    }

    public function testDefaultValues(): void
    {
        $result = $this->process([]);

        $this->assertEquals('cli', $result['provider']);
        $this->assertNull($result['cli_path']);
        $this->assertNull($result['node_path']);
        $this->assertEquals('%kernel.cache_dir%/morphql', $result['cache_dir']);
        $this->assertNull($result['server_url']);
        $this->assertNull($result['api_key']);
        $this->assertNull($result['timeout']);
        $this->assertEquals('%kernel.project_dir%/morphql-queries', $result['query_dir']);
    }

    public function testProviderValidation(): void
    {
        $this->expectException(\Exception::class);
        $this->process(['provider' => 'ftp']);
    }

    public function testCustomValues(): void
    {
        $result = $this->process([
            'provider'   => 'server',
            'server_url' => 'https://api.morphql.com',
            'api_key'    => 'secret-key',
            'timeout'    => 60,
            'query_dir'  => '/custom/queries',
        ]);

        $this->assertEquals('server', $result['provider']);
        $this->assertEquals('https://api.morphql.com', $result['server_url']);
        $this->assertEquals('secret-key', $result['api_key']);
        $this->assertEquals(60, $result['timeout']);
        $this->assertEquals('/custom/queries', $result['query_dir']);
    }
}
