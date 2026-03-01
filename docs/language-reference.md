# MorphQL Language Reference

MorphQL is a declarative DSL for structural data transformation. A MorphQL **query** compiles into a pure **JavaScript function** `(input) → output`. The engine parses the input with a source adapter, applies transformation actions, and serializes the result with a target adapter. You declare _what_ you want, the engine generates optimized JS that does it.

---

## 1. Query Structure

```
from <source_format> to <target_format>
[transform [unsafe]
  <actions>
]
```

**Rules:**

- `from` and `to` are **required**. They specify input/output formats.
- `transform` is **optional**. Without it, the query is a pure format conversion (e.g., `from json to xml`).
- `unsafe` disables null-safe optional chaining (`?.`). Default (safe mode) prevents crashes on null/undefined but is slightly slower.

**Example — pure conversion (no transform):**

```
Query:    from json to xml
Input:    {"name": "Alice", "age": 25}
Output:   <root><name>Alice</name><age>25</age></root>
```

**Example — with transform:**

```
Query:
  from json to json
  transform
    set fullName = firstName + " " + lastName
    set isAdult = age >= 18

Input:    {"firstName": "Alice", "lastName": "Smith", "age": 25}
Output:   {"fullName": "Alice Smith", "isAdult": true}
```

**Supported formats:** `json`, `xml`, `csv`, `plaintext`, `edifact`, `object`

---

## 2. The Compilation Model — How Scoping Works

Understanding the scoping model is critical. Every query has two data objects:

| Identifier | What it is                    | How it's used                                                               |
| :--------- | :---------------------------- | :-------------------------------------------------------------------------- |
| `source`   | The parsed input data         | Read-only. This is where your input data lives.                             |
| `target`   | The output object being built | Write-only (via `set`). This is the object that gets serialized at the end. |

**Core rule: every expression reads from ONE context depending on the action:**

| Action            | Left side (writes to)  | Right side (reads from)                                        |
| :---------------- | :--------------------- | :------------------------------------------------------------- |
| `set X = expr`    | `target.X`             | `source` (bare identifiers like `price` become `source.price`) |
| `modify X = expr` | `target.X`             | `target` (bare identifiers like `total` become `target.total`) |
| `return expr`     | replaces entire target | `target` (bare identifiers resolve against target)             |
| `define X = expr` | local variable         | `source` (same as `set`)                                       |

**You can override the context explicitly:**

```
set result = source.price       // explicit source (redundant, this is the default)
set result = target.prevField   // read from target even in a set action
modify total = target.total * 2 // explicit target (redundant, this is the default)
```

---

## 3. Context Identifiers

| Identifier | Meaning                                                         |
| :--------- | :-------------------------------------------------------------- |
| `source`   | Current scope's input data. Implicit in `set` and `define`.     |
| `target`   | Current scope's output data. Implicit in `modify` and `return`. |
| `_source`  | The **root** input data. Accessible from any nesting depth.     |
| `_target`  | The **root** output data. Accessible from any nesting depth.    |
| `_key`     | Current iteration index in `section multiple` (0-based).        |

**Example — `_source` and `_target` inside nested sections:**

```
Query:
  from object to object
  transform
    set globalId = id

    section multiple items(
      set itemId = id             // reads from current item (source = current array element)
      set parentId = _source.id   // reads from root input
      set globalRef = _target.globalId  // reads from root output
    ) from list

Input:    {"id": "ROOT", "list": [{"id": "A"}, {"id": "B"}]}
Output:   {"globalId": "ROOT", "items": [
            {"itemId": "A", "parentId": "ROOT", "globalRef": "ROOT"},
            {"itemId": "B", "parentId": "ROOT", "globalRef": "ROOT"}
          ]}
```

**Example — `_key` for iteration index:**

```
Query:
  from object to object
  transform
    section multiple items(
      set rank = _key + 1
      set name = source
    ) from names

Input:    {"names": ["Alice", "Bob", "Charlie"]}
Output:   {"items": [
            {"rank": 1, "name": "Alice"},
            {"rank": 2, "name": "Bob"},
            {"rank": 3, "name": "Charlie"}
          ]}
```

---

## 4. Actions

Actions are commands used inside `transform` or `section` blocks. They are executed in order, top to bottom.

### 4.1 `set`

Reads from **source**, writes to **target**.

```
set fullName = firstName + " " + lastName
set total = (price * quantity) - discount
set code = substring(sku, 0, 3)
```

```
Query:
  from object to object
  transform
    set greeting = "Hello, " + name
    set doubled = value * 2

Input:    {"name": "Alice", "value": 5}
Output:   {"greeting": "Hello, Alice", "doubled": 10}
```

### 4.2 `modify`

Reads from **target**, writes to **target**. Used to post-process values that were already set.

```
set total = price * quantity
modify total = total * 1.10    // "total" here reads from TARGET (the value we just set)
```

```
Query:
  from object to object
  transform
    set total = price * quantity
    modify total = total * 1.10

Input:    {"price": 100, "quantity": 2}
Output:   {"total": 220}
// Explanation: set total = 100 * 2 = 200. modify total = 200 * 1.10 = 220.
```

### 4.3 `section`

Creates a nested object or array in the output. **This is the most important and complex action.**

**Full syntax:**

```
section [multiple] <name>( <actions> ) [from <expression>] [where <condition>]
```

#### How section scoping works (CRITICAL):

**The `<name>` determines the output field.** The section writes to `target.<name>`.

**The `from` clause determines the input context for the section's actions.** If omitted, it defaults to `source.<name>`.

| Syntax                                  | Output                 | Input context for actions              |
| :-------------------------------------- | :--------------------- | :------------------------------------- |
| `section header(...)`                   | `target.header = {}`   | `source.header` (default: same name)   |
| `section header(...) from info`         | `target.header = {}`   | `source.info`                          |
| `section multiple items(...)`           | `target.items = [...]` | iterates `source.items` (each element) |
| `section multiple items(...) from data` | `target.items = [...]` | iterates `source.data` (each element)  |

Inside a section, `source` refers to the **section's scoped data**, not the parent's source.

#### 4.3.1 Simple section (nested object)

```
Query:
  from object to object
  transform
    section meta(
      set version = v
    ) from info

Input:    {"info": {"v": "1.0.0"}}
Output:   {"meta": {"version": "1.0.0"}}
// "meta" is the output field name. "info" is the source field to read from.
// Inside the section, "v" reads from source.info.v (because `from info` shifts context).
```

#### 4.3.2 `section multiple` (array mapping)

Maps each element of a source array into a target array.

```
Query:
  from object to object
  transform
    section multiple items(
      set sku = itemSku
      set qty = quantity
    ) from orderItems

Input:    {"orderItems": [{"itemSku": "ABC", "quantity": 2}, {"itemSku": "XYZ", "quantity": 5}]}
Output:   {"items": [{"sku": "ABC", "qty": 2}, {"sku": "XYZ", "qty": 5}]}
// For each element in source.orderItems, the engine creates an object in target.items.
// Inside the section, "itemSku" reads from the CURRENT array element.
```

#### 4.3.3 `section ... where` (filtering)

The `where` clause filters the source data.

- **With `multiple`**: only matching items are included in the output array.
- **Without `multiple`**: finds the **first** matching item from the array (returns a single object, not an array).

```
Query:
  from object to object
  transform
    section multiple activeUsers(
      set name = name
    ) from users where status == "active"

Input:    {"users": [
            {"name": "Alice", "status": "active"},
            {"name": "Bob", "status": "inactive"},
            {"name": "Charlie", "status": "active"}
          ]}
Output:   {"activeUsers": [{"name": "Alice"}, {"name": "Charlie"}]}
```

**Single section with where (find first match):**

```
Query:
  from object to object
  transform
    section primary(
      set name = name
      set phone = phone
    ) from contacts where isPrimary == true

Input:    {"contacts": [
            {"name": "Work", "phone": "555-0001", "isPrimary": false},
            {"name": "Home", "phone": "555-0002", "isPrimary": true}
          ]}
Output:   {"primary": {"name": "Home", "phone": "555-0002"}}
// Without "multiple", only the FIRST match is used. Result is an object, not an array.
```

#### 4.3.4 Subquery sections (format conversion inside a section)

A section can contain its own `from ... to ... transform` to parse embedded formatted data (e.g., XML inside a JSON field).

```
Query:
  from json to object
  transform
    section metadata(
      from xml to object
      transform
        set name = root.productName
        set price = number(root.cost)
    ) from xmlString

Input:    {"xmlString": "<root><productName>Widget</productName><cost>29.99</cost></root>"}
Output:   {"metadata": {"name": "Widget", "price": 29.99}}
// The xmlString value is parsed as XML inside the section.
```

#### 4.3.5 Complex `from` expressions

The `from` clause accepts any expression, including function calls:

```
section multiple items( set val = source ) from concat(list1, list2)
section multiple groups( set label = key ) from groupby(items, category)
section multiple products( set name = Name ) from spreadsheet(source)
```

#### 4.3.6 Deeply nested sections

Sections nest arbitrarily. Each level creates its own `source` context.

```
Query:
  from object to object
  transform
    section order(
      set orderId = orderId
      section multiple items(
        set sku = itemSku
        section details(
          set color = hex
        ) from info
      ) from products
    )

Input:    {"order": {
            "orderId": "ORD-1",
            "products": [
              {"itemSku": "ABC", "info": {"hex": "#FF0000"}},
              {"itemSku": "XYZ", "info": {"hex": "#0000FF"}}
            ]
          }}
Output:   {"order": {
            "orderId": "ORD-1",
            "items": [
              {"sku": "ABC", "details": {"color": "#FF0000"}},
              {"sku": "XYZ", "details": {"color": "#0000FF"}}
            ]
          }}
```

### 4.4 `clone`

Copies fields from source to target. Can copy all or specific fields.

```
clone()                       // copies all source fields to target
clone(firstName, lastName)    // copies only these fields
```

```
Query:
  from object to object
  transform
    clone(id, name)
    set type = "Electronics"

Input:    {"id": "123", "name": "Laptop", "price": 999}
Output:   {"id": "123", "name": "Laptop", "type": "Electronics"}
// "price" is NOT cloned because we specified only (id, name).
```

### 4.5 `delete`

Removes a field from the target. Typically used after `clone()`.

```
Query:
  from object to object
  transform
    clone()
    delete password

Input:    {"username": "john", "password": "secret123", "email": "john@example.com"}
Output:   {"username": "john", "email": "john@example.com"}
```

### 4.6 `define`

Creates a local variable (alias) available to subsequent expressions in the same scope. Does NOT write to the target.

```
Query:
  from object to object
  transform
    define basePrice = price * quantity
    set subtotal = basePrice
    set total = basePrice - discount

Input:    {"price": 100, "quantity": 3, "discount": 50}
Output:   {"subtotal": 300, "total": 250}
// "basePrice" is a local variable, it does not appear in the output.
```

`define` reads from **source** context (same as `set`). Defined variables can reference previously defined variables:

```
define a = 10
define b = 20
define c = a + b   // c = 30
```

### 4.7 `if` / `else` (conditional blocks)

Executes actions conditionally. Uses parentheses for both condition and body.

**Syntax:** `if (<condition>) ( <actions> ) [else ( <actions> )]`

```
Query:
  from object to object
  transform
    if (age >= 18) (
      set type = "adult"
      set canVote = true
    ) else (
      set type = "minor"
      set canVote = false
    )

Input:    {"age": 20}
Output:   {"type": "adult", "canVote": true}

Input:    {"age": 15}
Output:   {"type": "minor", "canVote": false}
```

`if` blocks can be nested and used inside sections. The condition reads from the current `source` context.

### 4.8 `return`

Replaces the entire target object with a value. Execution stops after `return`. Reads from **target** context by default.

```
Query:
  from object to object
  transform
    set greeting = "Hello " + name
    return greeting

Input:    {"name": "Alice"}
Output:   "Hello Alice"
// Note: the output is the STRING itself, not {"greeting": "Hello Alice"}.
// "greeting" in return reads from target (where we just set it).
```

`return target` returns the entire target object as-is:

```
set val = 1
return target       // returns {"val": 1}
```

`return` can use explicit `source` access:

```
return source.original   // returns the original source value
```

### 4.9 Escaped Identifiers

Use backticks for field names that are reserved words or contain special characters:

```
set `multiple` = true
set `order-id` = root.`external-id`
set `field with spaces` = source.`another field`
```

---

## 5. Operators

### Arithmetic (standard precedence)

| Operator | Description                     | Example                          |
| :------- | :------------------------------ | :------------------------------- |
| `+`      | Addition / String concatenation | `price + tax`, `"Hello " + name` |
| `-`      | Subtraction / Unary minus       | `income - expenses`, `-price`    |
| `*`      | Multiplication                  | `price * quantity`               |
| `/`      | Division                        | `total / count`                  |
| `%`      | Modulo (remainder)              | `index % 2`                      |

### Comparison

| Operator          | Description               |
| :---------------- | :------------------------ |
| `==`              | Loose equality            |
| `===`             | Strict equality           |
| `!=`              | Loose inequality          |
| `!==`             | Strict inequality         |
| `<` `>` `<=` `>=` | Numeric/string comparison |

### Logical

| Operator | Description         |
| :------- | :------------------ |
| `&&`     | Logical AND         |
| `\|\|`   | Logical OR          |
| `!`      | Logical NOT (unary) |

Use parentheses `()` for precedence: `set isValid = (status == "active") && (count > 0)`

---

## 6. Built-in Functions

Function names are **case-insensitive**.

### String Functions

| Function                                                  | Description                                              | Example                                   |
| :-------------------------------------------------------- | :------------------------------------------------------- | :---------------------------------------- |
| `substring(str, start, [length])`                         | Extract part of string. Negative indices count from end. | `substring(sku, 0, 3)` → `"ABC"`          |
| `replace(str, search, replacement)`                       | Replace first occurrence.                                | `replace(title, " ", "-")`                |
| `split(str, [sep], [limit])`                              | Split string into array. Default sep: `""`.              | `split(sku, "-")` → `["ABC","123"]`       |
| `uppercase(str)` / `lowercase(str)`                       | Case conversion.                                         | `uppercase("hello")` → `"HELLO"`          |
| `trim(str)`                                               | Remove leading/trailing whitespace.                      | `trim("  hi  ")` → `"hi"`                 |
| `padstart(str, len, [char])` / `padend(str, len, [char])` | Pad to length. Default char: `" "`.                      | `padstart("42", 5, "0")` → `"00042"`      |
| `indexof(str, search)`                                    | Index of first occurrence, -1 if not found.              | `indexof("hello", "ll")` → `2`            |
| `startswith(str, prefix)` / `endswith(str, suffix)`       | Boolean prefix/suffix check.                             | `startswith("PRD-01", "PRD")` → `true`    |
| `extractnumber(str)`                                      | First numeric sequence from string.                      | `extractnumber("Price: $42.50")` → `42.5` |
| `text(value)`                                             | Convert any value to string.                             | `text(123)` → `"123"`                     |
| `to_base64(value)` / `from_base64(value)`                 | Base64 encode/decode.                                    | `to_base64("hello")` → `"aGVsbG8="`       |

### Numeric Functions

| Function                            | Description                                                    | Example                               |
| :---------------------------------- | :------------------------------------------------------------- | :------------------------------------ |
| `number(value)`                     | Convert to number.                                             | `number("42")` → `42`                 |
| `floor(value)` / `ceil(value)`      | Round down / up.                                               | `floor(3.7)` → `3`, `ceil(3.2)` → `4` |
| `round(value, [mode])`              | Round. Modes: `"half-up"` (default), `"half-even"` (banker's). | `round(4.5)` → `5`                    |
| `abs(value)`                        | Absolute value.                                                | `abs(-5)` → `5`                       |
| `fixed(value, [decimals], [mode])`  | Format to fixed decimals. Returns **string**.                  | `fixed(3.14159, 2)` → `"3.14"`        |
| `min(a, b, ...)` / `max(a, b, ...)` | Min/max of **scalar** values.                                  | `min(price, 99.99)`                   |

### Control Flow

| Function                      | Description                          | Example                     |
| :---------------------------- | :----------------------------------- | :-------------------------- |
| `if(cond, trueVal, falseVal)` | Inline ternary. All 3 args required. | `if(isActive, "Yes", "No")` |

> **Note:** `if(cond, trueVal, falseVal)` is an inline expression function (returns a value). `if (cond) ( actions ) else ( actions )` is a block action (executes actions). They are different constructs.

### Array / Collection Functions

| Function                           | Description                                                     | Example                               |
| :--------------------------------- | :-------------------------------------------------------------- | :------------------------------------ |
| `list(v1, v2, ...)` / `array(...)` | Create an array literal. `array` is an alias.                   | `list("a", "b")` → `["a", "b"]`       |
| `aslist(value)`                    | Ensure value is an array. Wraps scalars, returns `[]` for null. | `aslist("x")` → `["x"]`               |
| `concat(arr1, arr2, ...)`          | Concatenate arrays.                                             | `concat([1,2], [3,4])` → `[1,2,3,4]`  |
| `transpose(source, key1, ...)`     | Zip parallel arrays into row objects.                           | See below.                            |
| `spreadsheet(array)`               | Convert CSV rows (first row = headers) to named objects.        | See below.                            |
| `extract(obj, spec, ...)`          | Extract/rename fields. Spec: `"key"` or `"target:source"`.      | `extract(src, "id", "name:fullName")` |

**`transpose` example:**

```
Query:
  from object to object
  transform
    section multiple rows(
      set name = names
      set age = ages
    ) from transpose(_source, "names", "ages")

Input:    {"names": ["Alice", "Bob"], "ages": [25, 30]}
Output:   {"rows": [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 30}]}
// transpose zips parallel arrays: element 0 of each array becomes row 0, etc.
```

### Fixed-Width String Functions

| Function                 | Description                                                                                                                     |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `unpack(str, spec, ...)` | Extract fields from fixed-width string. Spec: `"name:start:length[:raw]"`. Default: trims whitespace. `:raw` preserves it.      |
| `pack(obj, spec, ...)`   | Write fields into fixed-width string. Spec: `"name:start:length[:left]"`. Default: right-pad. `:left` = left-pad (right-align). |

### XML Function

| Function                                  | Description                     | Example                                                        |
| :---------------------------------------- | :------------------------------ | :------------------------------------------------------------- |
| `xmlnode(value, [attrKey, attrVal, ...])` | Wrap value with XML attributes. | `xmlnode(name, "id", "123")` → `<field id="123">value</field>` |

---

## 7. Aggregate Functions (IMPORTANT)

Aggregate functions operate on arrays. They all take **two arguments**:

```
aggregateFunction(array, expression)
```

**Critical concept:** The second argument (`expression`) is an expression that is **evaluated once per array element**. Bare field names inside the expression resolve against **each array element**, not against the array itself.

**Example to understand:**

```
sum(items, price * quantity)
```

This means: "For each element in `items`, evaluate `element.price * element.quantity`, then sum all results."

It does **NOT** mean `items.price * items.quantity`. The expression is scoped per element.

| Function                                | Description                                          | Empty array        | Null/undefined items |
| :-------------------------------------- | :--------------------------------------------------- | :----------------- | :------------------- |
| `sum(arr, expr)`                        | Sum of expression per element.                       | `0`                | Treated as `0`       |
| `avg(arr, expr)`                        | Average. Skips null/undefined in both sum and count. | `0`                | Skipped              |
| `minof(arr, expr)` / `maxof(arr, expr)` | Min/max of expression.                               | `null`             | Skipped              |
| `every(arr, expr)`                      | True if condition holds for ALL items.               | `true` (vacuously) | —                    |
| `some(arr, expr)`                       | True if condition holds for at least ONE item.       | `false`            | —                    |
| `distinct(arr, expr)`                   | Unique values of expression, first-seen order.       | `[]`               | —                    |
| `groupby(arr, expr)`                    | Group by expression. Returns `[{key, items}, ...]`.  | `[]`               | —                    |

**Examples:**

```
Query:
  from object to object
  transform
    set totalRevenue = sum(orders, amount)
    set avgPrice = avg(products, price)
    set cheapest = minof(products, price)
    set allPaid = every(orders, status == "paid")
    set hasExpensive = some(products, price > 100)
    set categories = distinct(products, category)

Input:    {
            "orders": [{"amount": 100, "status": "paid"}, {"amount": 200, "status": "paid"}],
            "products": [{"price": 50, "category": "A"}, {"price": 150, "category": "B"}, {"price": 50, "category": "A"}]
          }
Output:   {
            "totalRevenue": 300,
            "avgPrice": 83.33...,
            "cheapest": 50,
            "allPaid": true,
            "hasExpensive": true,
            "categories": ["A", "B"]
          }
```

**`groupby` example:**

```
Query:
  from object to object
  transform
    section multiple byStatus(
      set status = key
      set orderCount = items.length
      set totalRevenue = sum(items, amount)
    ) from groupby(orders, status)

Input:    {"orders": [
            {"status": "paid", "amount": 100},
            {"status": "pending", "amount": 50},
            {"status": "paid", "amount": 200}
          ]}
Output:   {"byStatus": [
            {"status": "paid", "orderCount": 2, "totalRevenue": 300},
            {"status": "pending", "orderCount": 1, "totalRevenue": 50}
          ]}
// groupby returns [{key: "paid", items: [...]}, {key: "pending", items: [...]}].
// Inside the section, "key" and "items" are the group's key and elements.
```

---

## 8. Formats & Adapters

| Format      | Description                                                        | Options                                     |
| :---------- | :----------------------------------------------------------------- | :------------------------------------------ |
| `json`      | JSON parse/serialize.                                              | —                                           |
| `xml`       | Attributes prefixed `$`, text content key `_`.                     | `to xml("rootTag")` sets root element name. |
| `csv`       | Rows keyed A,B,C...AA,AB. Result: `{rows: [{A:..., B:...}, ...]}`. | `from csv(";")` custom delimiter.           |
| `plaintext` | Lines as array. Result: `{rows: [line1, line2, ...]}`.             | `from plaintext("\n")` custom separator.    |
| `edifact`   | UN/EDIFACT segments. `{TAG: [elements], ...}`.                     | —                                           |
| `object`    | Identity pass-through (no parsing). Tries `JSON.parse` on strings. | —                                           |
| Custom      | Register via `registerAdapter(name, {parse, serialize})`.          | —                                           |

---

## 9. Edge Cases & Gotchas

1. **Section without `from`**: `section header(...)` reads from `source.header` (same name as section).
2. **Section without `multiple` + `where`**: finds the **first** matching element from the array (returns single object, not array). Returns `undefined` if no match.
3. **Section `multiple` + `where`**: filters the array (returns array, possibly empty).
4. **Safe mode** (default): all property access uses `?.` — `source?.field?.nested`. Returns `undefined` if any level is null.
5. **Aggregates on undefined**: `sum(undefined, x)` → `0`; `minof(undefined, x)` → `null`; `every(undefined, x)` → `true`; `some(undefined, x)` → `false`.
6. **`distinct`/`groupby`**: use `String()` coercion for key comparison. `null` and `undefined` are treated as distinct group keys.
7. **`_key` resets in nested sections**: each `section multiple` gets its own `_key` starting from 0.
8. **`return` stops execution**: no actions after `return` are executed.
9. **`define` does not produce output**: it creates a local variable only, which doesn't appear in the result.
10. **`modify` reads from target**: `modify total = total + 1` reads `target.total`, not `source.total`.

---

## 10. Complete End-to-End Examples

### Example 1: E-commerce Order Transformation

```
Query:
  from json to json
  transform
    set orderId = id
    set customerName = customer.firstName + " " + customer.lastName
    set itemCount = items.length
    set status = if(isPaid, "Paid", "Pending")

    section multiple lineItems(
      set sku = substring(productCode, 0, 6)
      set unitPrice = number(price)
      set total = number(price) * quantity
    ) from items

Input:
  {
    "id": "ORD-42",
    "customer": {"firstName": "Alice", "lastName": "Smith"},
    "items": [
      {"productCode": "PRD-001-A", "price": "29.99", "quantity": 2},
      {"productCode": "PRD-002-B", "price": "9.99", "quantity": 5}
    ],
    "isPaid": true
  }

Output:
  {
    "orderId": "ORD-42",
    "customerName": "Alice Smith",
    "itemCount": 2,
    "status": "Paid",
    "lineItems": [
      {"sku": "PRD-00", "unitPrice": 29.99, "total": 59.98},
      {"sku": "PRD-00", "unitPrice": 9.99,  "total": 49.95}
    ]
  }

// "lineItems" is the output array name. `from items` reads from source.items.
// "items.length" at root level reads source.items.length (= 2).
// substring("PRD-001-A", 0, 6) = "PRD-00" (6 chars from position 0).
```

### Example 2: JSON to XML with Conditionals

```
Query:
  from json to xml("UserProfile")
  transform
    section profile(
      set customerId = id
      set fullName = uppercase(name)
      set status = if(isActive, "Active", "Inactive")

      if (isActive) (
        set accountTier = "Premium"
      ) else (
        set accountTier = "Standard"
      )

      section contactInfo(
        set primaryEmail = email
        set phone = phone
      ) from contact
    ) from customer

Input:
  {
    "customer": {
      "id": 42,
      "name": "alice",
      "isActive": true,
      "contact": {"email": "alice@example.com", "phone": "555-0001"}
    }
  }

Output (XML):
  <UserProfile>
    <profile>
      <customerId>42</customerId>
      <fullName>ALICE</fullName>
      <status>Active</status>
      <accountTier>Premium</accountTier>
      <contactInfo>
        <primaryEmail>alice@example.com</primaryEmail>
        <phone>555-0001</phone>
      </contactInfo>
    </profile>
  </UserProfile>
```

### Example 3: EDIFACT to Object with transpose

```
Query:
  from edifact to object
  transform
    set invoiceNumber = BGM[0][1]
    set invoiceDate = DTM[0][0][1]

    section buyer(
      set id = source[1][0]
      set name = source[3]
    ) from NAD where source[0] == "BY"

    section seller(
      set id = source[1][0]
      set name = source[3]
    ) from NAD where source[0] == "SE"

    section multiple items(
      set lineNo = LIN[0]
      set productId = LIN[2][0]
      set quantity = number(QTY[0][1])
      set amount = number(MOA[0][1])
    ) from transpose(_source, "LIN", "QTY", "MOA")

// NAD is an array of segments. "where source[0] == 'BY'" finds the first segment
// whose first element is "BY". Without "multiple", it returns a single object.
// transpose(_source, "LIN", "QTY", "MOA") zips the LIN, QTY, and MOA segment arrays
// from the root source so each iteration gets {LIN: [...], QTY: [...], MOA: [...]}.
```
