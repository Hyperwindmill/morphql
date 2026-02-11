# MorphQL Language Reference

This document provides a complete reference for the Morph Query Language (MorphQL), a declarative DSL for structural data transformation.

## Query Structure

A MorphQL query follows this basic structure:

```morphql
from <source_format> to <target_format>
[transform [unsafe]
  <actions>
]
```

**Supported formats:** `json`, `xml`, `object`, `csv`, `plaintext`

The `transform` block is optional—omit it for pure format conversion:

```morphql
from json to xml
```

### Safe Mode vs Unsafe Mode

By default, MorphQL generates **safe** code that uses optional chaining (`?.`) to prevent crashes when accessing properties on null/undefined values. For performance-critical scenarios with validated data, you can use the `unsafe` keyword:

```morphql
// Safe mode (default) - uses optional chaining
from object to object
transform
  set result = price / quantity

// Unsafe mode - no optional chaining, maximum performance
from object to object
transform unsafe
  set result = price / quantity
```

> [!WARNING]
> Use `unsafe` only with validated/trusted input data. Unsafe mode will crash if it encounters null/undefined values.

---

## Context Identifiers

MorphQL provides special identifiers to control which data context you're reading from or writing to.

### Default Contexts

- **`source`** - The input data (implicit when reading in `set`)
- **`target`** - The output data (implicit when reading in `modify` or `return`)

```morphql
// These are equivalent - 'source' is implicit in set
set name = firstName
set name = source.firstName

// These are equivalent - 'target' is implicit in modify
modify total = total * 1.1
modify total = target.total * 1.1
```

### Explicit Context Access

You can explicitly specify which context to read from:

```morphql
// Read from source explicitly
set result = source.price

// Read from target (useful in set to reference previously set fields)
set first = value
set second = target.first  // References the field we just set

// Mix contexts
set total = source.price + target.markup
```

### Root Context Identifiers

When working inside nested sections, the `source` and `target` identifiers refer to the **current scope**. To access the **root/parent** scope, use `_source` and `_target`:

```morphql
from json to object
transform
  set globalId = id  // Root source.id

  section multiple items(
    set itemId = id           // Current item's id
    set parentId = _source.id // Root source.id (parent scope)
    set globalRef = _target.globalId // Access root target field
  ) from list
```

**Use cases for root identifiers:**

- Access parent data from within nested sections
- Reference root-level computed fields
- Cross-scope data relationships

::: tip
`_source` and `_target` always refer to the **outermost** transformation scope, even when deeply nested in multiple sections or subqueries.
:::

### Iteration Index: `_key`

When inside a `section multiple` block, you can use the `_key` identifier to access the current iteration index (starting from 0).

```morphql
section multiple items(
  set rank = _key + 1
  set name = productName
) from products
```

The `_key` is also available in the `where` clause of a section to filter by position:

```morphql
section multiple firstThree(
  set val = source
) from data where _key < 3
```

---

## Actions

Actions are the commands used inside the `transform` block or `section` blocks.

### `set`

Sets a property on the target object by reading from the **source** data.

```morphql
set fullName = firstName + " " + lastName
set total = (price * quantity) - discount
set shortSku = substring(sku, 0, 3)
```

### `modify`

Modifies a property on the target object by reading from the **target** object itself. This is useful for post-processing values that have already been mapped.

```morphql
set total = price * quantity
modify total = total * 1.10   # Apply a 10% markup to the already calculated total
```

### `section`

Creates a nested object or array. Supports optional format conversion via subqueries.

**Syntax:**

```morphql
section [multiple] <name>( [subquery] <actions> ) [from <path>] [where <condition>]
```

**Parameters:**

- `multiple`: Treats the source as an array and maps each item
- `subquery`: Optional nested query for format conversion
- `from <expression>`: Shifts the context to a specific source data source. Can be a path, the `parent` keyword, or a function call (e.g., `spreadsheet(source)`).
- `where <condition>`: Filters the source data before transformation. For `multiple` sections, only matching items are included. For single sections, the first matching item is used. You can use `_key` here to filter by index.

**Examples:**

```morphql
// Simple nested object
section header(
  set id = orderId
  set date = orderDate
)

// Array mapping
section multiple items(
  set sku = itemSku
  set qty = quantity
) from orderItems

// Filtering with where clause
section multiple activeUsers(
  set name = userName
  set email = userEmail
) from users where status == "active"

// Single section with where (find first match)
section primaryContact(
  set name = contactName
  set phone = contactPhone
) from contacts where isPrimary == true

// Subquery with format conversion
section metadata(
  from xml to object
  transform
    set name = root.productName
    set price = number(root.cost)
) from xmlDataField

// Using an expression in 'from'
section multiple records(
  set val = source
) from concat(list1, list2)
```

### `clone`

Clones the entire source object or specific fields into the target.

```morphql
// Clone everything
clone()

// Clone specific fields
clone(firstName, lastName, email)
```

### `delete`

Removes a property from the target object. Useful after `clone()`.

```morphql
clone()
delete password
delete internalId
```

### `define`

Defines a local variable/alias for use in subsequent expressions within the same scope.

```morphql
define basePrice = price * quantity
set subtotal = basePrice
set total = basePrice - discount
```

### `if` (Conditional Block)

Executes actions conditionally.

```morphql
if (status == "active") (
  set isActive = true
  set badge = "✓"
) else (
  set isActive = false
  set badge = "✗"
)
```

### `return`

Overwrites the target object and returns immediately from the current scope. Expressions inside `return` read from the **target** object by default.

```morphql
// Top level
set greeting = "Hello " + name
return greeting

// Inside section
section user(
  set id = userId
  set name = userName
  return target
)
```

---

## Escaped Identifiers

Use backticks (`` `fieldname` ``) to use reserved keywords or special characters as identifiers:

```morphql
transform
  set `multiple` = true
  set `order-id` = root.`external-id`
  set `field with spaces` = source.`another field`
```

Backticks can be escaped with `\` when needed in a field name.

---

## Functions

Functions are used within expressions to calculate or transform values.

| Function                              | Description                                                                     | Example                           |
| :------------------------------------ | :------------------------------------------------------------------------------ | :-------------------------------- |
| `substring(str, start, [length])`     | Extracts a part of a string. Supports negative indices.                         | `substring(sku, 0, 3)`            |
| `if(cond, trueVal, falseVal)`         | Ternary-like expression.                                                        | `if(age >= 18, "adult", "minor")` |
| `text(val)`                           | Converts a value to a string.                                                   | `text(123)`                       |
| `number(val)`                         | Converts a value to a number.                                                   | `number("42")`                    |
| `replace(str, search, replace)`       | Replaces occurrences in a string.                                               | `replace(name, " ", "_")`         |
| `split(str, [sep], [limit])`          | Splits a string into an array. Default separator is `""`.                       | `split(sku, "-")`                 |
| `extractnumber(str)`                  | Extracts the first numeric sequence from a string.                              | `extractnumber("Price: 100USD")`  |
| `uppercase(str)`                      | Converts string to uppercase.                                                   | `uppercase("hello")`              |
| `lowercase(str)`                      | Converts string to lowercase.                                                   | `lowercase("HELLO")`              |
| `xmlnode(val, [attrKey, attrVal...])` | Wraps a value for XML output with optional attributes.                          | `xmlnode(content, "id", 1)`       |
| `to_base64(val)`                      | Encodes a string to Base64 (isomorphic).                                        | `to_base64("hello")`              |
| `from_base64(val)`                    | Decodes a Base64 string (isomorphic).                                           | `from_base64("aGVsbG8=")`         |
| `aslist(val)`                         | Ensures a value is an array (useful for XML parsing).                           | `aslist(items)`                   |
| `spreadsheet(array)`                  | Transforms an array of objects into a list of row objects.                      | `spreadsheet(rows)`               |
| `unpack(str, spec...)`                | Extracts fields from fixed-length string. Spec pattern: `name:start:len[:raw]`. | `unpack(source, "id:0:5")`        |
| `pack(obj, spec...)`                  | Encodes object to fixed-length string. Spec pattern: `name:start:len[:left]`.   | `pack(target, "id:0:5:left")`     |
| `concat(arg1, arg2...)`               | Concatenates two or more arrays into one.                                       | `concat(list1, list2)`            |

---

## Operators

### Arithmetic

| Operator | Description                     |
| :------- | :------------------------------ |
| `+`      | Addition / String concatenation |
| `-`      | Subtraction / Unary minus       |
| `*`      | Multiplication                  |
| `/`      | Division                        |

### Comparison

| Operator | Description           |
| :------- | :-------------------- |
| `==`     | Loose equality        |
| `===`    | Strict equality       |
| `!=`     | Loose inequality      |
| `!==`    | Strict inequality     |
| `<`      | Less than             |
| `>`      | Greater than          |
| `<=`     | Less than or equal    |
| `>=`     | Greater than or equal |

### Logical

| Operator | Description |
| :------- | :---------- |
| `&&`     | Logical AND |
| `\|\|`   | Logical OR  |
| `!`      | Logical NOT |

### Grouping

Use parentheses `( )` to control operator precedence:

```morphql
set total = (price * quantity) - discount
set isValid = (status == "active") && (count > 0)
```

---

## Complete Examples

### E-commerce Order Transformation

```morphql
from json to json
transform
  set orderId = id
  set customerName = customer.firstName + " " + customer.lastName

  section multiple lineItems(
    set sku = substring(productCode, 0, 6)
    set unitPrice = number(price)
    set total = number(price) * quantity
  ) from items

  section summary(
    set itemCount = items.length
    set status = if(isPaid, "Paid", "Pending")
  )
```

### XML to JSON Conversion with Mapping

```morphql
from xml to json
transform
  define product = root.catalog.product
  set name = product.name
  set price = number(product.price)
  set inStock = product.stock > 0

  section multiple variants(
    set color = variant.color
    set size = uppercase(variant.size)
  ) from product.variants
```

### Spreadsheet Transformation (CSV)

Useful when working with CSV data where the first row contains values that should be mapped as keys for subsequent rows.

```morphql
from csv to json
transform
  // spreadsheet() converts an array of objects (like CSV rows)
  // into a structured array using the first row values as keys.
  set data = spreadsheet(rows)
```

### Format Conversion Only

```morphql
from json to xml
```

```morphql
from xml to object
```
