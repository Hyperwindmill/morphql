# MorphQL Language Reference (detailed)

## Query Structure
```morphql
from <source_format> to <target_format>
[transform [unsafe]
  <actions>
]
```
- `transform` block is optional (pure format conversion without it)
- Safe mode (default): uses optional chaining `?.` — prevents crashes on null/undefined
- `unsafe`: disables optional chaining, max performance, requires validated input

## Context Identifiers
- `source` – input data (implicit in `set`)
- `target` – output data (implicit in `modify`, `return`)
- `_source` – root source (accessible from any nesting depth)
- `_target` – root target (accessible from any nesting depth)
- `_key` – current iteration index in `section multiple` (0-based)

## Keywords (18 total)
- `from`, `to` – format specifiers
- `transform`, `unsafe` – transformation block
- `set` – assign to target (reads from source context)
- `modify` – modify target (reads from target context)
- `section [multiple]` – nested object or array
- `clone` – copy fields from source
- `delete` – remove field from target
- `define` – local variable/alias
- `if`/`else` – conditionals
- `where` – filter for sections
- `return` – bypass serialization, return custom value

## Actions

### set / modify
```morphql
set fullName = firstName + " " + lastName
modify total = total * 1.10   # reads from target
```

### section
```morphql
section header( set id = orderId )                          # nested object
section multiple items( set sku = sku ) from orderItems     # array mapping
section multiple active( set name = name ) from users where status == "active"
section first( set val = val ) from data where id > 100    # finds first match
```
Subquery section (format conversion inside):
```morphql
section data(
  from json to object
  transform
    set name = root.productName
) from xmlDataField
```
Complex `from` expressions:
```morphql
section multiple items( set val = source ) from concat(list1, list2)
section multiple groups( set label = key ) from groupby(items, category)
```

### clone / delete
```morphql
clone()                      # all fields
clone(firstName, lastName)   # specific fields
delete password
```

### define
```morphql
define basePrice = price * quantity
set total = basePrice - discount
```

### if/else
```morphql
if (status == "active") (
  set isActive = true
) else (
  set isActive = false
)
```

### return
```morphql
set greeting = "Hello " + name
return greeting
```

### Escaped identifiers
Use backticks for reserved words or special chars:
```morphql
set `multiple` = true
set `order-id` = root.`external-id`
```

## Operators
Arithmetic (prec 10-11): `+` `-` `*` `/` `%`
Comparison (prec 6-7): `==` `===` `!=` `!==` `<` `>` `<=` `>=`
Logical (prec 4-5, 9): `&&` `||` `!`
Assignment (prec 1): `=`

## Built-in Functions

### String
- `substring(str, start, [length])` – supports negative indices
- `split(str, [sep], [limit])`
- `replace(str, search, replacement)`
- `text(value)` – to string
- `uppercase(str)` / `lowercase(str)`
- `trim(str)`
- `padstart(str, length, [char])` / `padend(str, length, [char])`
- `indexof(str, search)` – returns -1 if not found
- `startswith(str, prefix)` / `endswith(str, suffix)` – returns boolean
- `extractnumber(str)` – extracts first numeric sequence, e.g. "Price: $42.50" → 42.5
- `to_base64(value)` / `from_base64(value)`

### Numeric
- `number(value)` – to number
- `floor(value)` / `ceil(value)`
- `round(value, [mode])` – modes: "half-up" (default), "half-even"
- `abs(value)`
- `fixed(value, [decimals], [mode])` – returns string, e.g. fixed(3.14159, 2) → "3.14"
- `min(a, b, ...)` / `max(a, b, ...)`

### Array Aggregates (all take array + expression over each item)
- `sum(array, expr)` – null/undefined/non-numeric treated as 0
- `avg(array, expr)` – skips null/undefined; 0 for empty
- `minof(array, expr)` / `maxof(array, expr)` – null for empty/null; skips non-numeric
- `every(array, cond)` – true for empty (vacuously true)
- `some(array, cond)` – false for empty
- `distinct(array, expr)` – unique values, first-seen order
- `groupby(array, keyExpr)` → `[{ key, items }, ...]`

### Data Structure
- `list(v1, v2, ...)` / `array(...)` – create array from args
- `aslist(value)` – wrap in array if not already; null/undefined → []
- `concat(a, b, ...)` – concatenate arrays
- `spreadsheet(array)` – array of objects with A,B,C... keys; first row = headers
- `transpose(source, key1, [key2,...])` – parallel arrays → object array
- `extract(source, spec, ...)` – "key" or "targetKey:sourcePath"

### Fixed-Length Strings
- `unpack(str, spec, ...)` – spec: "name:start:length[:raw]"; default trims whitespace
- `pack(obj, spec, ...)` – spec: "name:start:length[:left]"; default right-pad, :left = right-align

### XML / Format
- `xmlnode(value, [attrKey, attrVal, ...])` – wrap with XML attributes
- `if(condition, trueVal, falseVal)` – ternary function (distinct from action `if`)

## Formats & Adapters
- `json` – JSON parse/serialize
- `xml` – attributes prefixed `$`, text content key `_`; `to xml("root")` sets root tag
- `csv` – columns A,B,C...AA,AB...; `{ rows: [{A:..., B:...}, ...] }`; `from csv(";")` custom delimiter
- `plaintext` – `{ rows: [line1, line2, ...] }`; `from plaintext("\n")` custom separator
- `edifact` – UN/EDIFACT; `{ TAG: [elements], ... }`; separators: `+` `:` `?` `'`
- `object` – identity (passes JS object through; tries JSON.parse on string)
- Custom: `registerAdapter(name, { parse(content, options?), serialize(data, options?) })`

## Edge Cases
- Safe mode: `source?.field?.nested` — undefined if any level is null
- `sum(undefined, x)` → 0; `minof(undefined, x)` → null; `every(undefined, x)` → true; `some(undefined, x)` → false
- `distinct`/`groupby` use `String()` coercion for keys; null/undefined are distinct groups
- `section ... where cond` (no `multiple`) finds FIRST matching item from array
- `section multiple ... where cond` filters array items

## Compiler Internals
Generated JS structure:
```js
return function(input, env) {
  const source = env.parse('format', input, options);
  const _rootSource = source;
  const target = {};
  const _rootTarget = target;
  // compiled actions...
  return env.serialize('format', target, options);
}
```
- `readFrom` tracks source vs target context per expression
- `scopeStack` manages nested section format contexts
- Safe mode: replaces `.` with `?.` and `[` with `?.[` in property access
