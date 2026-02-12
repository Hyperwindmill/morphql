<?php

namespace MorphQL\SymfonyBundle\Tests\DependencyInjection;

use MorphQL\MorphQL;
use MorphQL\SymfonyBundle\DependencyInjection\MorphQLExtension;
use MorphQL\SymfonyBundle\TransformationRegistry;
use PHPUnit\Framework\TestCase;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class MorphQLExtensionTest extends TestCase
{
    private function loadExtension(array $config = []): ContainerBuilder
    {
        $container = new ContainerBuilder();
        $extension = new MorphQLExtension();
        $extension->load([$config], $container);
        return $container;
    }

    public function testMorphQLServiceIsRegistered(): void
    {
        $container = $this->loadExtension();
        $this->assertTrue($container->hasDefinition(MorphQL::class));
    }

    public function testTransformationRegistryIsRegistered(): void
    {
        $container = $this->loadExtension();
        $this->assertTrue($container->hasDefinition(TransformationRegistry::class));
    }

    public function testAliasesAreRegistered(): void
    {
        $container = $this->loadExtension();
        $this->assertTrue($container->hasAlias('morphql'));
        $this->assertTrue($container->hasAlias('morphql.registry'));
    }

    public function testServiceReceivesConfigValues(): void
    {
        $container = $this->loadExtension([
            'provider' => 'server',
            'timeout'  => 45,
        ]);

        $definition = $container->getDefinition(MorphQL::class);
        $args = $definition->getArgument(0);

        $this->assertEquals('server', $args['provider']);
        $this->assertEquals(45, $args['timeout']);
    }

    public function testRegistryReceivesQueryDir(): void
    {
        $container = $this->loadExtension([
            'query_dir' => '/app/queries',
        ]);

        $definition = $container->getDefinition(TransformationRegistry::class);
        $this->assertEquals('/app/queries', $definition->getArgument('$queryDir'));
    }
}
