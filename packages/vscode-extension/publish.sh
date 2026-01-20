#!/bin/bash
set -e

echo "🎨 MQL VSCode Extension - Publishing Script"
echo "==========================================="
echo ""

# Check if vsce is installed
if ! command -v vsce &> /dev/null; then
    echo "❌ vsce is not installed"
    echo "📦 Installing vsce..."
    npm install -g @vscode/vsce
fi

echo "🔨 Step 1: Compiling TypeScript..."
npm run compile

echo ""
echo "📦 Step 2: Packaging extension..."
vsce package

echo ""
echo "✅ Package created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Test locally: code --install-extension mql-vscode-0.1.0.vsix"
echo "2. Login to marketplace: vsce login query-morph"
echo "3. Publish: vsce publish"
echo ""
echo "Or run: ./publish.sh --publish to publish automatically"

if [ "$1" == "--publish" ]; then
    echo ""
    echo "🚀 Publishing to marketplace..."
    vsce publish
    echo ""
    echo "✅ Published successfully!"
    echo "🔗 https://marketplace.visualstudio.com/items?itemName=query-morph.mql-vscode"
fi
