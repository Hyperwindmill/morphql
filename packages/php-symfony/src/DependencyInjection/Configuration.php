<?php

namespace MorphQL\SymfonyBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder('morphql');
        $rootNode = $treeBuilder->getRootNode();

        $rootNode
            ->children()
                ->enumNode('provider')
                    ->values(['cli', 'server'])
                    ->defaultValue('cli')
                    ->info('Execution provider: "cli" (bundled Node.js engine) or "server" (remote REST API)')
                ->end()
                ->scalarNode('cli_path')
                    ->defaultNull()
                    ->info('Override path to the MorphQL CLI binary. Auto-detected if null.')
                ->end()
                ->scalarNode('node_path')
                    ->defaultValue('node')
                    ->info('Path to the Node.js binary')
                ->end()
                ->scalarNode('cache_dir')
                    ->defaultValue('%kernel.cache_dir%/morphql')
                    ->info('Directory for compiled query cache')
                ->end()
                ->scalarNode('server_url')
                    ->defaultValue('http://localhost:3000')
                    ->info('MorphQL server base URL')
                ->end()
                ->scalarNode('api_key')
                    ->defaultNull()
                    ->info('API key for server authentication')
                ->end()
                ->integerNode('timeout')
                    ->defaultValue(30)
                    ->min(1)
                    ->info('Execution timeout in seconds')
                ->end()
                ->scalarNode('query_dir')
                    ->defaultValue('%kernel.project_dir%/morphql-queries')
                    ->info('Directory containing .morphql files. Analogous to templates/ for Twig.')
                ->end()
            ->end()
        ;

        return $treeBuilder;
    }
}
