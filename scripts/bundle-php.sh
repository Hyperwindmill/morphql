#!/bin/bash
# -------------------------------------------------------------------
# bundle-php.sh — Bundle MorphQL CLI into the PHP Composer package
#
# Compiles the CLI + core + all dependencies into a single JS file
# using @vercel/ncc, then copies it into packages/php/bin/.
#
# Usage: bash scripts/bundle-php.sh
# -------------------------------------------------------------------

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PHP_DIR="$ROOT_DIR/packages/php"
BIN_DIR="$PHP_DIR/bin"

echo "==> Bundling MorphQL CLI for PHP package..."

# 1. Build the CLI (ensures dist/ is up to date)
echo "  → Building @morphql/core..."
npm run build -w @morphql/core --prefix "$ROOT_DIR"

echo "  → Building @morphql/cli..."
npm run build -w @morphql/cli --prefix "$ROOT_DIR"

# 2. Bundle with ncc
echo "  → Running ncc bundle..."
mkdir -p "$BIN_DIR"
npx -y @vercel/ncc build "$ROOT_DIR/packages/cli/bin/morphql.js" \
    -o "$BIN_DIR" \
    --minify

# Rename to morphql.js for clarity
if [ -f "$BIN_DIR/index.js" ]; then
    mv "$BIN_DIR/index.js" "$BIN_DIR/morphql.js"
fi

# Remove the package.json that ncc generates (not needed)
rm -f "$BIN_DIR/package.json"

echo "==> Done! Bundle: $BIN_DIR/morphql.js ($(du -h "$BIN_DIR/morphql.js" | cut -f1))"
