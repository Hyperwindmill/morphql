#!/bin/sh

# Install custom node into n8n's community nodes directory
mkdir -p /home/node/.n8n/nodes/node_modules/n8n-nodes-morphql
cp -r /opt/n8n-custom/n8n-nodes-morphql/* /home/node/.n8n/nodes/node_modules/n8n-nodes-morphql/

# Start n8n
exec n8n "$@"
