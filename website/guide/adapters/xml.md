# XML Adapter

The built-in XML adapter uses [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) for high-performance XML processing.

## Usage

```morphql
from xml to json
transform clone
```

## Options

The XML adapter supports many options forwarded directly to the underlying parser and builder:

- `rootGenerated` (string): The name of the root tag when serializing.
- `ignoreAttributes` (boolean): Whether to ignore XML attributes.
- `attributeNamePrefix` (string): Prefix used for attributes (default is `$`).
- `format` (boolean): Whether to format/indent the output XML.

### Example

```morphql
// Equivalent to xml(rootGenerated="UserResponse")
from object to xml("UserResponse")
```
