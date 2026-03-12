# n8n-nodes-morphql

Transform data in your n8n workflows using **MorphQL**, a high-performance, declarative Query-to-Code engine.

![MorphQL Icon](./src/morphql.svg)

## Features

- 🚀 **Declarative DSL**: Write *what* you want to transform, not *how*.
- ⚡ **Native Performance**: Queries are compiled into optimized JavaScript.
- 🔍 **Dynamic Schema Detection**: Automatically identifies fields in your query and provides suggestions to downstream nodes.
- 🛠️ **Format Agnostic**: Seamlessly handles Objects, JSON, XML, and more.

## Installation (Local Development)

To use this node in your n8n instance before it is published to npm:

### 1. Build the package
```bash
npm install
npm run build
```

### 2. Link to n8n
If you are running n8n locally:
```bash
# Inside this directory
npm link

# Inside your n8n nodes directory (usually ~/.n8n/nodes)
npm link n8n-nodes-morphql
```

### 3. Use with Docker
If you use Docker Compose, mount the directory as a volume:
```yaml
services:
  n8n:
    image: n8nio/n8n:latest
    volumes:
      - .:/home/node/.n8n/nodes/node_modules/n8n-nodes-morphql
```

## Usage

1. Add a **MorphQL** node to your workflow.
2. Enter your transformation query in the **Query** field.
3. Observe how downstream nodes automatically see the new fields you've created!

### Example Query
```morphql
from object to object
transform
  set fullName = firstName + " " + lastName
  set isAdult = age >= 18
  section items(
    set name = productName
    set total = price * quantity
  ) from lineItems
```

## License
MIT
