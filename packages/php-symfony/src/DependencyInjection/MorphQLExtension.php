<?php

namespace MorphQL\SymfonyBundle\DependencyInjection;

use MorphQL\MorphQL;
use MorphQL\SymfonyBundle\TransformationRegistry;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Definition;
use Symfony\Component\DependencyInjection\Extension\Extension;

class MorphQLExtension extends Extension
{
    public function load(array $configs, ContainerBuilder $container): void
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration($configuration, $configs);

        // Register MorphQL service (autowirable)
        $morphqlDef = new Definition(MorphQL::class);
        $morphqlDef->setArgument(0, [
            'provider'   => $config['provider'],
            'cli_path'   => $config['cli_path'],
            'node_path'  => $config['node_path'],
            'cache_dir'  => $config['cache_dir'],
            'server_url' => $config['server_url'],
            'api_key'    => $config['api_key'],
            'timeout'    => $config['timeout'],
        ]);
        $morphqlDef->setPublic(false);
        $container->setDefinition(MorphQL::class, $morphqlDef);
        $container->setAlias('morphql', MorphQL::class)->setPublic(false);

        // Register TransformationRegistry (autowirable)
        $registryDef = new Definition(TransformationRegistry::class);
        $registryDef->setArgument('$morphql', $container->getDefinition(MorphQL::class));
        $registryDef->setArgument('$queryDir', $config['query_dir']);
        $registryDef->setPublic(false);
        $container->setDefinition(TransformationRegistry::class, $registryDef);
        $container->setAlias('morphql.registry', TransformationRegistry::class)->setPublic(false);
    }

    public function getAlias(): string
    {
        return 'morphql';
    }
}
