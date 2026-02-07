# CSV Adapter

The CSV adapter uses [PapaParse](https://www.papaparse.com/) for reliable CSV parsing and serialization.

## Options

- `delimiter` (string): The column delimiter (defaults to `,`). Can also be passed as the first positional parameter: `csv(";")`.
- `skipEmptyLines` (boolean): Whether to skip empty lines (defaults to `true`).

## Data Structure

When parsing, the CSV adapter produces an object with a `rows` array. Each row is an object where columns are mapped to Excel-style letters (`A`, `B`, `C`, ...).

```morphql
from csv to object
transform
  section multiple users (
    set name = A
    set email = B
  ) from rows
```

When serializing, the adapter expects an object with a `rows` array containing objects with these lettered keys.
