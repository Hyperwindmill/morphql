# EDIFACT Adapter

The EDIFACT adapter allows MorphQL to parse and serialize UN/EDIFACT (Electronic Data Interchange for Administration, Commerce and Transport) messages. This format is widely used in B2B transactions, logistics, and finance.

## Usage

You can use the `edifact` format in your `from` and `to` clauses.

```morphql
from edifact to json
transform
  set invoiceNumber = BGM[0][1]
  set date = DTM[0][0][1]
```

## Data Structure

When parsing, the EDIFACT adapter converts the message into a JavaScript object where keys are **Segment Tags** (e.g., `UNB`, `UNH`, `BGM`) and values are arrays of segments (to handle repeating segments).

Each segment is represented as an array of **Data Elements**. Data elements can be simple strings or arrays of **Component Elements**.

### Example Mapping

EDIFACT: `BGM+745+987654321+9'`

Parsed Result:

```json
{
  "BGM": [["745", "987654321", "9"]]
}
```

EDIFACT with components: `DTM+137:20240101:102'`

Parsed Result:

```json
{
  "DTM": [[["137", "20240101", "102"]]]
}
```

## Options

### Delimiters and UNA

The adapter automatically detects delimiters if a `UNA` segment is present at the beginning of the message. You can also override delimiters manually via options:

| Option               | Default | Description                                 |
| :------------------- | :------ | :------------------------------------------ |
| `segmentTerminator`  | `'`     | Character that ends a segment               |
| `elementSeparator`   | `+`     | Character that separates data elements      |
| `componentSeparator` | `:`     | Character that separates component elements |
| `releaseChar`        | `?`     | Character used for escaping                 |

### Serialization Options

| Option       | Default | Description                                      |
| :----------- | :------ | :----------------------------------------------- |
| `includeUNA` | `false` | Whether to include a `UNA` segment in the output |

## Escaping

The adapter handles escaping using the `releaseChar` (defaulting to `?`). If a separator character appears within the data, it is automatically escaped during serialization and unescaped during parsing.

```morphql
// Serializing data with reserved characters
from object to edifact
transform
  set MSG = "Value with + plus"
// Result: MSG+Value with ?+ plus'
```
