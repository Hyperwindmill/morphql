# n8n-nodes-morphql

Transform data in your n8n workflows using **MorphQL**, a high-performance, declarative Query-to-Code engine.

![MorphQL Icon](./src/morphql.svg)

## Features

- 🚀 **Declarative DSL**: Write _what_ you want to transform, not _how_.
- ⚡ **Native Performance**: Queries are compiled into optimized JavaScript (local mode).
- 🌐 **Server Mode**: Connect to a remote MorphQL server for staged queries.
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

The node supports two execution modes:

### Local Mode (Default)

1. Add a **MorphQL** node to your workflow.
2. Set **Mode** to `Local`.
3. Enter your transformation query in the **Query** field.
4. Observe how downstream nodes automatically see the new fields you've created!

### Server Mode

1. Configure **Credentials** first (see below).
2. Add a **MorphQL** node to your workflow.
3. Set **Mode** to `Server` and select your credentials.
4. Choose **Query Type**:
   - **Inline**: Enter your query directly in the **Query** field.
   - **Staged**: Select from pre-defined queries on the server by name.
5. Provide input data and execute.

#### Server Credentials Setup

To connect to a MorphQL server:

1. Go to **Settings** > **Credentials** in n8n.
2. Click **Add Credential** > **MorphQL Server API**.
3. Enter your server URL (e.g., `https://api.example.com`).
4. Optionally enter your API key for authentication.
5. Click **Test Connection** to verify.
6. Save the credential for use in workflows.

#### Server API Endpoints

The node communicates with these endpoints:

| Query Type | Endpoint           | Description                        |
| ---------- | ------------------ | ---------------------------------- |
| Inline     | `POST /v1/execute` | Execute a query string directly    |
| Staged     | `POST /v1/q/:name` | Execute a pre-defined staged query |

When using the server mode:

- The `X-API-KEY` header is sent if credentials include an API key
- The server must respond with `{ "success": true, "result": "..." }`
- Errors return `{ "success": false, "error": "..." }`

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

## Troubleshooting

### Local Mode Issues

**"Failed to compile query"**

- Verify your MorphQL syntax is correct
- Check the query uses valid DSL constructs

### Server Mode Issues

**"Connection refused"**

- Verify the server URL is correct and accessible
- Check if the server is running and accepting connections
- Ensure the URL does not include trailing `/v1` (it's appended automatically)

**"Unauthorized"**

- Ensure your API key is correct
- Verify the server requires authentication
- Check the server's API key configuration

**"Query not found" (staged queries)**

- Verify the query name matches exactly (case-sensitive)
- Check if the staged query exists on the server

**Health check timeout**

- The credentials test calls `/v1/health`
- Verify the server responds to this endpoint
- Check network connectivity and firewalls

## License

MIT
