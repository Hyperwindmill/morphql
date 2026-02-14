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
                ->enumNode('runtime')
                    ->values(['node', 'qjs'])
                    ->defaultValue('node')
                    ->info('Runtime engine: "node" (default) or "qjs" (QuickJS, no external deps)')
                ->end()
                ->scalarNode('cli_path')
                    ->defaultNull()
                    ->info('Override path to the MorphQL CLI binary. Auto-detected if null.')
                ->end()
                ->scalarNode('node_path')
                    ->defaultNull()
                    ->info('Path to the Node.js binary (defaults to "node" if null)')
                ->end()
                ->scalarNode('qjs_path')
                    ->defaultNull()
                    ->info('Path to the QuickJS binary (auto-downloaded/detected if null)')
                ->end()
                ->scalarNode('cache_dir')
                    ->defaultValue('%kernel.cache_dir%/morphql')
                    ->info('Directory for compiled query cache')
                ->end()
                ->scalarNode('server_url')
                    ->defaultNull()
                    ->info('MorphQL server base URL (defaults to http://localhost:3000 if null)')
                ->end()
                ->scalarNode('api_key')
                    ->defaultNull()
                    ->info('API key for server authentication')
                ->end()
                ->integerNode('timeout')
                    ->defaultNull()
                    ->info('Execution timeout in seconds (defaults to 30 if null)')
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
