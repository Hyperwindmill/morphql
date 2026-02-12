#!/bin/bash
# -------------------------------------------------------------------
# bundle-php.sh — Bundle MorphQL CLI into the PHP Composer package
#
# Compiles the CLI + core + all dependencies into a single JS file
# using @vercel/ncc, then copies it into packages/php/bin/.
# Also syncs the monorepo version into composer.json.
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

# 3. Sync version from root package.json → composer.json
VERSION=$(node -p "require('$ROOT_DIR/package.json').version")
echo "  → Syncing version: $VERSION"

# Use node to update composer.json (portable, no jq dependency)
node -e "
const fs = require('fs');
const path = '$PHP_DIR/composer.json';
const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
pkg.version = '$VERSION';
fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
"

echo "==> Done! Bundle: $BIN_DIR/morphql.js ($(du -h "$BIN_DIR/morphql.js" | cut -f1))"
echo "    Version: $VERSION"
