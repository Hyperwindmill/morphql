# Plaintext Adapter

The Plaintext adapter splits input into an array of strings. It is primarily used as a foundation for processing fixed-length or positional text.

## Options

- `separator` (string | RegExp): The line separator (defaults to `/\r?\n/` for parsing and `\n` for serialization). Can also be passed as the first positional parameter: `plaintext(";")`.

## Data Structure

When parsing, it produces an object with a `rows` array of raw strings.

```morphql
from plaintext to object
transform
  section multiple lines (
    set content = source
  ) from rows
```

> [!TIP]
> For a detailed walkthrough on how to parse and encode fixed-length data using this adapter, see the [Working with Positional Text](/guide/positional-text) guide.
