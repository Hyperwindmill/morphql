# Advanced Object Construction

This guide demonstrates how to handle complex object construction scenarios, such as flattening multiple source fields into a single array of structured objects.

## Scenario: Normalizing Multiple Document Types

Consider a CSV row (represented here as a flat object) where different types of document numbers are stored in separate columns. Our goal is to transform this into a uniform `documents` array, where each entry identifies the document type.

### Input Data (CSV Row)

| inv_number  | trn_number | date       |
| :---------- | :--------- | :--------- |
| INV-2024-01 | TRN-9988   | 2024-02-12 |

### Transformation Query

To achieve this, we use a combination of `define` (to create constants), `extract` (to shape our objects), and `list` (to join them into an array).

```morphql
from object to object
transform
  // 1. Define constant types that will be available in the 'source' context
  define INV_TYPE = "Invoice"
  define TRN_TYPE = "Transport Document"

  // 2. Extract and Rename fields into multiple objects, then join them
  set documents = list(
    extract(source, "number:inv_number", "type:INV_TYPE"),
    extract(source, "number:trn_number", "type:TRN_TYPE")
  )
```

### Resulting Output

```json
{
  "date": "2024-02-12",
  "documents": [
    {
      "number": "INV-2024-01",
      "type": "Invoice"
    },
    {
      "number": "TRN-9988",
      "type": "Transport Document"
    }
  ]
}
```

## How it Works

1. **`define`**: By defining `INV_TYPE` and `TRN_TYPE`, we add these fields to the current transformation's `source` context. This allows `extract` to "pick" them just like it picks fields from the original input.
2. **`extract`**: We use renaming syntax (`targetKey:sourceKey`) to normalize different source column names (`inv_number`, `trn_number`) into a consistent target field (`number`).
3. **`list`**: Finally, `list` (or its alias `array`) takes the individual objects and merges them into a single array.

::: tip
This pattern is extremely versatile for ETL tasks where you need to "verticalize" data that was delivered in a horizontal/flat format.
:::
