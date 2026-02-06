# Detailed Example: Fixed-Length Text Transformation

This example demonstrates how to use the `plaintext` adapter along with `unpack()` and `pack()` to transform complex fixed-length data.

## Input Scenario

Suppose we have a fixed-length log file where rows contain a header or a detail record.

```text
01ACME CORP 20240101
02001   750.50    PRD_XYZ
02002   1250.00   PRD_ABC
```

Field Layouts:

- **Header (Type 01)**:
  - Type: Pos 0, Len 2
  - Company: Pos 2, Len 10
  - Date: Pos 12, Len 8
  - Padding: Pos 20, Len 3
- **Detail (Type 02)**:
  - Type: Pos 0, Len 2
  - ID: Pos 2, Len 5
  - Amount: Pos 7, Len 10 (Left-aligned/Right-padded in input)
  - SKU: Pos 17, Len 10

## Transformation Query (Decoding)

We use `unpack()` to parse each line conditionally.

```morphql
from plaintext to json
transform
  section multiple records (
    define type = substring(source, 0, 2)

    if (type == "01") (
      set kind = "HEADER"
      // Using :raw to preserve the spaces in the name if needed (e.g. for audit)
      // though by default we trim. Here we'll show :raw for the padding field.
      set data = unpack(source, "company:2:10", "date:12:8", "padding:20:3:raw")
    ) else (
      set kind = "DETAIL"
      set data = unpack(source, "id:2:5", "amount:7:10", "sku:17:10")
      // Post-process the extracted values
      modify data.amount = number(data.amount)
    )
  ) from rows
```

## Transformation Query (Encoding)

Building back a fixed-length file with specific padding/alignment.

```morphql
from json to plaintext
transform
  section multiple lines (
    if (kind == "HEADER") (
      // Normal right-pad for text
      return pack(data, "company:0:10", "date:10:8")
    ) else (
      // Use :left for the amount to have it right-aligned/left-padded
      return pack(data, "id:0:5", "amount:5:10:left", "sku:15:10")
    )
  ) from records
```

### Formatting Suffixes Summary

| Suffix  | Function | Effect                                                                          |
| :------ | :------- | :------------------------------------------------------------------------------ |
| `:raw`  | `unpack` | Disables auto-trim. Extracts exactly $L$ characters including whitespace.       |
| `:left` | `pack`   | Use left-padding (right-alignment). Ideal for numbers or fixed-width ID fields. |
| (none)  | `unpack` | Auto-trim trailing/leading whitespace.                                          |
| (none)  | `pack`   | Default right-padding (left-alignment). Standard for text fields.               |

## Error Handling

If you provide an invalid spec (e.g. `unpack(source, "id:abc:5")`), MorphQL will throw an error at compilation time, ensuring your transformation logic is syntactically correct before execution.
