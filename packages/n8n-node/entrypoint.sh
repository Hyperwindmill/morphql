#!/bin/sh

print_banner() {
    echo "----------------------------------------"
    echo "n8n MorphQL Node - Environment Details"
    echo "----------------------------------------"
    echo "Node.js version: $(node -v)"
    echo "n8n version: $(n8n --version)"

    # Get MorphQL version if installed
    MORPHQL_PATH="/opt/n8n-custom/node_modules/n8n-nodes-morphql"
    if [ -f "$MORPHQL_PATH/package.json" ]; then
        MORPHQL_VERSION=$(node -p "require('$MORPHQL_PATH/package.json').version")
        echo "n8n-nodes-morphql version: $MORPHQL_VERSION"
    else
        echo "n8n-nodes-morphql: not installed"
    fi

    echo "----------------------------------------"
}

# Add custom nodes to the N8N_CUSTOM_EXTENSIONS
if [ -n "$N8N_CUSTOM_EXTENSIONS" ]; then
    export N8N_CUSTOM_EXTENSIONS="/opt/n8n-custom:${N8N_CUSTOM_EXTENSIONS}"
else
    export N8N_CUSTOM_EXTENSIONS="/opt/n8n-custom"
fi

print_banner

# Execute the original n8n entrypoint script
exec /docker-entrypoint.sh "$@"
