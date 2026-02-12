<?php

namespace MorphQL\SymfonyBundle\Tests;

use MorphQL\MorphQL;
use MorphQL\SymfonyBundle\TransformationRegistry;
use PHPUnit\Framework\TestCase;

class TransformationRegistryTest extends TestCase
{
    private string $tempDir;
    private $morphql;
    private TransformationRegistry $registry;

    protected function setUp(): void
    {
        $this->tempDir = sys_get_temp_dir() . '/morphql-test-' . uniqid();
        mkdir($this->tempDir);
        mkdir($this->tempDir . '/invoices');
        mkdir($this->tempDir . '/api');

        file_put_contents($this->tempDir . '/identity.morphql', 'query');
        file_put_contents($this->tempDir . '/invoices/to_xml.morphql', 'query');
        file_put_contents($this->tempDir . '/api/response.morphql', 'query');

        $this->morphql = $this->createMock(MorphQL::class);
        $this->registry = new TransformationRegistry($this->morphql, $this->tempDir);
    }

    protected function tearDown(): void
    {
        $this->removeDir($this->tempDir);
    }

    private function removeDir(string $dir): void
    {
        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            is_dir($path) ? $this->removeDir($path) : unlink($path);
        }
        rmdir($dir);
    }

    public function testResolveExistingFile(): void
    {
        $path = $this->registry->resolve('identity');
        $this->assertEquals($this->tempDir . '/identity.morphql', $path);

        $path = $this->registry->resolve('invoices/to_xml');
        $this->assertEquals($this->tempDir . '/invoices/to_xml.morphql', $path);
    }

    public function testResolveAcceptsExtension(): void
    {
        $path = $this->registry->resolve('identity.morphql');
        $this->assertEquals($this->tempDir . '/identity.morphql', $path);
    }

    public function testResolveThrowsOnMissing(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('MorphQL query file not found');
        $this->registry->resolve('nonexistent');
    }

    public function testHas(): void
    {
        $this->assertTrue($this->registry->has('identity'));
        $this->assertTrue($this->registry->has('invoices/to_xml'));
        $this->assertFalse($this->registry->has('nonexistent'));
    }

    public function testListReturnsSortedIdentifiers(): void
    {
        $list = $this->registry->list();
        $this->assertEquals(['api/response', 'identity', 'invoices/to_xml'], $list);
    }

    public function testTransformCallsRunFile(): void
    {
        $this->morphql->expects($this->once())
            ->method('runFile')
            ->with($this->tempDir . '/identity.morphql', '{"data":1}')
            ->willReturn('result');

        $result = $this->registry->transform('identity', '{"data":1}');
        $this->assertEquals('result', $result);
    }
}
