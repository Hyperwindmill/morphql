# Why MorphQL?

## The Challenge

In modern software development, data transformation is ubiquitous. Whether you are shaping API responses, processing ETL pipelines, or integrating third-party services, you often face:

*   **Complex mapping logic** scattered across your codebase.
*   **Performance bottlenecks** when processing large datasets.
*   **Format juggling** between JSON, XML, and native Objects.
*   **Inconsistent transformations** across different microservices.
*   **Debug difficulty** with deeply nested, imperative mapping code.

## The MorphQL Solution

MorphQL provides a unified, declarative approach to data transformation.

| Feature | Benefit |
| :--- | :--- |
| **Declarative DSL** | Write *what* you want, not *how* to loop and assign. Queries are self-documenting. |
| **Native Performance** | Queries are compiled to optimized JavaScript functions. Compile once, execute millions of times. |
| **Format Agnostic** | Built-in format conversion (JSON ↔ XML ↔ Object) in a single query. |
| **Centralized Logic** | Keep your transformation logic separate from your business logic. |
| **Inspectable Code** | The generated code is readable JavaScript, making it easy to debug if needed. |

## Use Cases

### 🔄 API Response Transformation

Shape backend responses into frontend-friendly formats without cluttering your application code.

```javascript
const shapeOrder = await compile(morphQL`
  from json to json
  transform
    set id = orderId
    set customer = billing.customerName
    section multiple items(
      set name = productName
      set price = number(unitPrice)
    ) from lineItems
`);
```

### 📦 ETL Pipelines

Process large datasets with compiled transformations for optimal throughput.

```javascript
const transform = await compile(morphQL`
  from xml to json
  transform
    set productId = root.product.id
    set price = extractnumber(root.product.price)
    set available = root.product.stock > 0
`);

// Process millions of records efficiently
data.map(transform);
```

### 🔧 Format Conversion

Convert between formats with zero transformation logic—just specify source and target.

```javascript
const xmlToJson = await compile(morphQL`from xml to json`);
const jsonToXml = await compile(morphQL`from json to xml`);
```

### 🧩 Nested Data Processing

Handle complex nested structures with subqueries that can parse embedded data (e.g., XML inside a JSON field).

```javascript
const engine = await compile(morphQL`
  from json to object
  transform
    set orderId = id
    section metadata(
      from xml to object
      transform
        set supplier = root.vendor.name
    ) from embeddedXmlField
`);
```
