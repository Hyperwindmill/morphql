<?php
/**
 * QuickJS-ng Binary Installer for MorphQL
 *
 * Downloads precompiled QuickJS-ng binaries from GitHub for Linux, macOS, and Windows.
 */

$version = 'v0.11.0';
$baseUrl = "https://github.com/quickjs-ng/quickjs/releases/download/$version/";

$binaries = [
    'qjs-linux-x86_64' => 'qjs-linux-x86_64',
    'qjs-darwin' => 'qjs-darwin',
    'qjs-windows-x86_64.exe' => 'qjs-windows-x86_64.exe',
];

$binDir = __DIR__;
if (!is_dir($binDir)) {
    mkdir($binDir, 0755, true);
}

echo "Installing QuickJS-ng $version binaries to $binDir...\n";

foreach ($binaries as $remote => $local) {
    $url = $baseUrl . $remote;
    $target = $binDir . DIRECTORY_SEPARATOR . $local;

    echo "Downloading $remote... ";

    $content = @file_get_contents($url);
    if ($content === false) {
        // Fallback for some PHP environments that don't follow redirects automatically
        if (function_exists('curl_init')) {
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            $content = curl_exec($ch);
            curl_close($ch);
        }
    }

    if ($content === false || strlen($content) < 1000) {
        echo "FAILED\n";
        continue;
    }

    file_put_contents($target, $content);
    chmod($target, 0755);
    echo "Done (" . round(strlen($content) / 1024 / 1024, 2) . " MB)\n";
}

// Also try to copy the JS bundle if we are in the monorepo
$monorepoBundle = __DIR__ . '/../../cli/dist/qjs/qjs.js';
if (file_exists($monorepoBundle)) {
    echo "Copying JS bundle from monorepo... ";
    copy($monorepoBundle, $binDir . '/qjs.js');
    echo "Done\n";
}

echo "\nInstallation complete.\n";
