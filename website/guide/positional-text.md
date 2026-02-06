# Working with Fixed-Length Text

Fixed-length (or positional) text files are common in legacy systems, financial data (like COBOL-style flat files), and logs. MorphQL provides a powerful way to handle these using the `plaintext` adapter combined with the `unpack()` and `pack()` functions.

## Overview

Unlike JSON or CSV, fixed-length text doesn't have delimiters. Fields are identified by their character position and length.

MorphQL handles this in two steps:

1. **The `plaintext` adapter**: Splits the file into raw lines.
2. **Positional functions**: Extract (`unpack`) or encode (`pack`) data within your `transform` block.

## Reading Fixed-Length Data

To read fixed-length data, use the `plaintext` adapter and the `unpack()` function.

### Basic Example

Suppose you have a list of users where each line is exactly 30 characters:

- Name: positions 0-20
- Age: positions 20-23
- ID: positions 23-30

```morphql
from plaintext to json
transform
  section multiple users (
    // unpack transforms the raw line string into an object
    set data = unpack(source, "name:0:20", "age:20:3", "id:23:7")
  ) from rows
```

### Advanced: Record Types

Many fixed-length files contain different types of records on different lines, often identified by a "Type Code" at the start of the line.

```morphql
from plaintext to json
transform
  section multiple records (
    // Check the first two characters for the record type
    if (substring(source, 0, 2) == "01") (
      set type = "Header"
      set info = unpack(source, "company:2:20", "date:22:8")
    ) else (
      set type = "Detail"
      set item = unpack(source, "sku:2:10", "qty:12:5", "price:17:10")
      // Convert extracted text to numbers
      modify item.qty = number(item.qty)
      modify item.price = number(item.price)
    )
  ) from rows
```

### The `unpack` Spec Suffixes

You can append modifiers to your field specifications:

- **`:raw`**: By default, `unpack` trims leading and trailing whitespace. Use `:raw` to preserve it.
  ```morphql
  set data = unpack(source, "padding:20:10:raw")
  ```

## Writing Fixed-Length Data

To generate a fixed-length file, use the `pack()` function and the `to plaintext` adapter.

### Basic Example

```morphql
from object to plaintext
transform
  section multiple rows (
     // pack converts an object into a padded string
     return pack(source, "name:0:20", "age:20:3", "id:23:7")
  ) from users
```

### Alignment and Padding

By default, `pack` uses **right-padding** (left-alignment), which is standard for text. For numbers or IDs, you might want **left-padding** (right-alignment).

- **`:left`**: Uses left-padding.
  ```morphql
  // name will be right-padded to 20 chars
  // score will be left-padded to 5 chars
  return pack(source, "name:0:20", "score:20:5:left")
  ```

## Why this approach?

By separating the line splitting (`plaintext` adapter) from the field extraction (`unpack`), MorphQL gives you:

1. **Maximum Flexibility**: Handle multi-format files effortlessly.
2. **Full Logic Power**: Use `if`, `modify`, and other functions on extracted fields before they even reach the output.
3. **Performance**: Only the fields you need are processed.
