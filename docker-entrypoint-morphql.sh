#!/bin/sh

# This script runs every time the container starts.
# It ensures that our baked-in custom node is linked correctly inside the persist node volume
mkdir -p /home/node/.n8n/custom/node_modules
ln -sfn /custom-extensions/node_modules/n8n-nodes-morphql /home/node/.n8n/custom/node_modules/n8n-nodes-morphql

# Execute the original n8n entrypoint
exec /docker-entrypoint.sh "$@"
