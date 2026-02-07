# JSON Adapter

The JSON adapter leverages native JavaScript `JSON.parse` and `JSON.stringify` for high-performance data processing.

## Usage

Use the `json` format in your `from` and `to` clauses.

```morphql
from json to object
transform clone
```

## Options

The JSON adapter currently doesn't require specific options, as it follows standard JSON regulations.
