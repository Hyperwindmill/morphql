# MorphQL Language Reference

This document provides a complete reference for the Morph Query Language (MorphQL), a declarative DSL for structural data transformation.

## Query Structure

A MorphQL query follows this basic structure:

```morphql
from <source_format> to <target_format>
[transform
  <actions>
]
```

**Supported formats:** `json`, `xml`, `object`

The `transform` block is optional—omit it for pure format conversion:

```morphql
from json to xml
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
section [multiple] <name>( [subquery] <actions> ) [from <path>]
```

**Parameters:**

- `multiple`: Treats the source as an array and maps each item
- `subquery`: Optional nested query for format conversion
- `from <path>`: Shifts the context to a specific source path

**Examples:**

```morphql
# Simple nested object
section header(
  set id = orderId
  set date = orderDate
)

# Array mapping
section multiple items(
  set sku = itemSku
  set qty = quantity
) from orderItems

# Subquery with format conversion
section metadata(
  from xml to object
  transform
    set name = root.productName
    set price = number(root.cost)
) from xmlDataField
```

### `clone`

Clones the entire source object or specific fields into the target.

```morphql
# Clone everything
clone()

# Clone specific fields
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

| Function                              | Description                                               | Example                           |
| :------------------------------------ | :-------------------------------------------------------- | :-------------------------------- |
| `substring(str, start, [length])`     | Extracts a part of a string. Supports negative indices.   | `substring(sku, 0, 3)`            |
| `if(cond, trueVal, falseVal)`         | Ternary-like expression.                                  | `if(age >= 18, "adult", "minor")` |
| `text(val)`                           | Converts a value to a string.                             | `text(123)`                       |
| `number(val)`                         | Converts a value to a number.                             | `number("42")`                    |
| `replace(str, search, replace)`       | Replaces occurrences in a string.                         | `replace(name, " ", "_")`         |
| `split(str, [sep], [limit])`          | Splits a string into an array. Default separator is `""`. | `split(sku, "-")`                 |
| `extractnumber(str)`                  | Extracts the first numeric sequence from a string.        | `extractnumber("Price: 100USD")`  |
| `uppercase(str)`                      | Converts string to uppercase.                             | `uppercase("hello")`              |
| `lowercase(str)`                      | Converts string to lowercase.                             | `lowercase("HELLO")`              |
| `xmlnode(val, [attrKey, attrVal...])` | Wraps a value for XML output with optional attributes.    | `xmlnode(content, "id", 1)`       |
| `to_base64(val)`                      | Encodes a string to Base64 (isomorphic).                  | `to_base64("hello")`              |
| `from_base64(val)`                    | Decodes a Base64 string (isomorphic).                     | `from_base64("aGVsbG8=")`         |
| `aslist(val)`                         | Ensures a value is an array (useful for XML parsing).     | `aslist(items)`                   |

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

### Format Conversion Only

```morphql
from json to xml
```

```morphql
from xml to object
```
