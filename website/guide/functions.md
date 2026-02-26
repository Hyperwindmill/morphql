# Functions Reference

Functions are used within expressions to compute or transform values. All function names are **case-insensitive**.

## String

### `substring(str, start, [length])`

Extracts a portion of a string. Supports negative indices (counting from the end).

```morphql
set code    = substring(sku, 0, 3)       // "ABC"
set suffix  = substring(filename, -4)    // ".xml"
set middle  = substring(name, 2, 5)      // 5 chars starting at index 2
```

---

### `replace(str, search, replacement)`

Replaces the first occurrence of `search` in `str` with `replacement`.

```morphql
set slug = replace(title, " ", "-")
```

---

### `split(str, [separator], [limit])`

Splits a string into an array. Default separator: `""` (splits into individual characters).

```morphql
set parts = split(sku, "-")          // ["ABC", "123", "XY"]
set words = split(sentence, " ", 3)  // max 3 parts
```

---

### `uppercase(str)` / `lowercase(str)`

Converts a string to upper or lower case.

```morphql
set label = uppercase(category)   // "ELECTRONICS"
set key   = lowercase(code)       // "abc-001"
```

---

### `trim(str)`

Removes leading and trailing whitespace.

```morphql
set name = trim(rawName)
```

---

### `padstart(str, length, [char])` / `padend(str, length, [char])`

Pads a string at the start or end until it reaches `length`. Default pad character: `" "`.

```morphql
set id      = padstart(number, 8, "0")   // "00000042"
set label   = padend(name, 20)           // "Alice               "
```

---

### `indexof(str, search)`

Returns the index of the first occurrence of `search`, or `-1` if not found.

```morphql
set pos = indexof(code, "SKU-")
```

---

### `startswith(str, prefix)` / `endswith(str, suffix)`

Returns `true` if the string starts or ends with the given substring.

```morphql
set isProduct = startswith(code, "PRD-")
set isXml     = endswith(filename, ".xml")
```

---

### `extractnumber(str)`

Extracts the first numeric sequence from a string. Returns `null` if none is found.

```morphql
set price = extractnumber("Price: 100 USD")   // 100
```

---

### `text(value)`

Converts any value to a string via `String(value)`.

```morphql
set label = text(orderId)
```

## Type Conversion

### `number(value)`

Converts a value to a number via `Number(value)`.

```morphql
set qty = number(rawQuantity)
```

---

### `to_base64(value)` / `from_base64(value)`

Encodes or decodes a string to/from Base64. Works in both Node.js and browsers.

```morphql
set encoded = to_base64("hello")       // "aGVsbG8="
set decoded = from_base64(encodedVal)
```

## Math

### `floor(value)` / `ceil(value)`

Rounds a number down or up to the nearest integer.

```morphql
set units = floor(total / boxSize)
set pages = ceil(itemCount / pageSize)
```

---

### `round(value, [mode])`

Rounds to the nearest integer.

| Mode | Behavior |
| :--- | :--- |
| `"half-up"` (default) | 0.5 rounds away from zero |
| `"half-even"` | Banker's rounding — 0.5 rounds to the nearest even integer |

```morphql
set result = round(4.5)                // 5
set result = round(4.5, "half-even")   // 4 (nearest even)
```

---

### `abs(value)`

Returns the absolute value.

```morphql
set diff = abs(target - actual)
```

---

### `fixed(value, [decimals], [mode])`

Formats a number to a fixed number of decimal places. Returns a **string**. Default: 2 decimals, `"half-up"` rounding.

```morphql
set price = fixed(amount, 2)                    // "12.50"
set price = fixed(amount, 2, "half-even")       // banker's rounding
```

---

### `min(a, b, ...)` / `max(a, b, ...)`

Returns the smallest or largest of two or more **scalar** values.

```morphql
set capped   = min(price, 99.99)
set floored  = max(0, discount)
```

> For finding the min/max across an array, use [`minof`](#minof-array-expr) / [`maxof`](#maxof-array-expr).

## Control Flow

### `if(condition, trueValue, falseValue)`

Inline ternary expression. All three arguments are required.

```morphql
set label  = if(isActive, "Active", "Inactive")
set tier   = if(visits > 40, "Frequent", "Casual")
set amount = if(discount > 0, price * (1 - discount), price)
```

> For multi-action branching, use the [`if` action](/guide/language-reference#if-else).

## Array / Collection

### `list(v1, [v2, ...])` / `array(v1, [v2, ...])`

Creates an array literal. `array` is an alias for `list`.

```morphql
set tags    = list("featured", "sale")
set matrix  = list(list(1, 2), list(3, 4))
```

---

### `aslist(value)`

Ensures the value is an array. Returns `[]` for null/undefined, wraps scalars in `[value]`, and passes arrays through unchanged. Useful when XML parsing may return a single object or an array for the same element.

```morphql
section multiple items(
  set name = name
) from aslist(product)
```

---

### `concat(arr1, arr2, ...)`

Concatenates two or more arrays (or scalar values) into a single flat array.

```morphql
section multiple all(
  set val = source
) from concat(listA, listB, singleItem)
```

---

### `distinct(array, expr)`

Returns an array of distinct values of an expression evaluated per item, in first-seen order. Deduplication uses `String()` coercion.

```morphql
set categories = distinct(products, category)
set statuses   = distinct(orders, uppercase(status))
```

---

### `transpose(source, key1, [key2, ...])`

Zips parallel arrays from a source object into an array of row objects.

```morphql
// Input: { names: ["Alice", "Bob"], ages: [25, 30] }
section multiple rows(
  set name = name
  set age  = age
) from transpose(_source, "names", "ages")
// Output: [{ name: "Alice", age: 25 }, { name: "Bob", age: 30 }]
```

---

### `spreadsheet(data)`

Converts CSV-parsed data (array of column-keyed objects, first row = headers) into an array of named objects.

```morphql
section multiple rows(
  set productName = Name
  set unitPrice   = Price
) from spreadsheet(source.rows)
```

## Aggregates

All aggregate functions take an **array** and an **expression** evaluated per item. Bare field names inside the expression resolve against each array element.

### `sum(array, expr)`

Sums a numeric expression across the array. `null`, `undefined` and non-numeric values count as **0**.

```morphql
set total      = sum(orders, amount)
set subtotal   = sum(items, price * quantity)
```

---

### `avg(array, expr)`

Returns the arithmetic average. `null` and `undefined` values are **skipped** (not counted as 0). Returns `0` for empty arrays.

```morphql
set avgPrice   = avg(products, price)
set avgRevenue = avg(orders, amount * (1 - discountRate))
```

---

### `minof(array, expr)` / `maxof(array, expr)`

Returns the minimum or maximum of a numeric expression. `null`/`undefined` values are skipped. Returns `null` for empty arrays.

```morphql
set cheapest      = minof(products, price)
set mostExpensive = maxof(products, price)
set bestMargin    = maxof(orders, revenue - cost)
```

---

### `every(array, expr)` / `some(array, expr)`

Boolean aggregates. `every` returns `true` if the condition holds for **all** items (vacuously true for empty arrays). `some` returns `true` if at least **one** item matches (false for empty arrays).

```morphql
set allPaid    = every(orders, status == "paid")
set hasOverdue = some(invoices, daysOverdue > 0)
```

These are especially useful in `where` clauses combined with [`groupby`](#groupby-array-expr):

```morphql
section multiple clientsWithOverdue(
  set client = key
) from groupby(invoices, client) where some(items, daysOverdue > 0)
```

## Data Grouping & Extraction

### `groupby(array, expr)`

Groups an array by a key expression evaluated per item. Returns `[{ key, items }]` in insertion order. Designed to be used as the `from` source of a `section multiple`.

- `key` — the group key value
- `items` — array of all elements that share this key

```morphql
section multiple byStatus(
  set status       = key
  set orderCount   = items.length
  set totalRevenue = sum(items, amount)
  section multiple orders(
    set id     = id
    set amount = amount
  ) from items
) from groupby(orders, status)
```

The key expression can be any expression — field access, function call, or compound formula:

```morphql
) from groupby(products, uppercase(category))
) from groupby(events, substring(date, 0, 7))   // group by YYYY-MM
```

---

### `extract(obj, spec...)`

Extracts and optionally renames fields from an object. Each spec is either `"key"` (copy as-is) or `"targetKey:sourcePath"` (rename with optional dot-path source).

```morphql
set doc = extract(source, "id", "name:fullName", "city:address.city")
```

---

### `unpack(str, spec...)` / `pack(obj, spec...)`

Read and write **fixed-width strings**. Spec pattern: `"name:start:length[:modifier]"`.

- `unpack` extracts fields from a fixed-width string. Add `:raw` to disable auto-trimming.
- `pack` writes object fields into a fixed-width string. Add `:left` for right-alignment.

```morphql
set parsed = unpack(record, "id:0:5", "name:5:20", "code:25:3:raw")
set line   = pack(target, "id:0:5:left", "name:5:20")
```

---

### `xmlnode(value, [attrKey, attrVal, ...])`

Wraps a value with XML attributes for the XML adapter. Pairs of `attrKey, attrVal` arguments define attributes.

```morphql
set product = xmlnode(name, "id", productId, "type", "physical")
// serializes as: <product id="123" type="physical">Widget</product>
```
