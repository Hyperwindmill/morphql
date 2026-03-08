# YAML Adapter

The built-in YAML adapter uses [js-yaml](https://github.com/nodeca/js-yaml) for YAML parsing and serialization.

## Usage

```morphql
from yaml to object
transform
  set name = name
  set age  = age
```

```morphql
from object to yaml
transform clone
```

```morphql
from yaml to yaml
transform
  set key   = key
  set value = value
```

## Options

Options are forwarded directly to the underlying `js-yaml` functions.

### Parse options (`yaml.load`)

| Option   | Type      | Description                                       |
| :------- | :-------- | :------------------------------------------------ |
| `schema` | `string`  | YAML schema to use (default: `DEFAULT_SCHEMA`)    |
| `json`   | `boolean` | Allow duplicate keys (last value wins, like JSON) |

### Serialize options (`yaml.dump`)

| Option      | Type      | Default | Description                                              |
| :---------- | :-------- | :------ | :------------------------------------------------------- |
| `indent`    | `number`  | `2`     | Number of spaces per indentation level                   |
| `lineWidth`  | `number`  | `80`    | Max line width before wrapping (`-1` = no limit)         |
| `noRefs`    | `boolean` | `false` | Disable YAML anchors/aliases for duplicate objects       |
| `sortKeys`  | `boolean` | `false` | Sort object keys alphabetically                          |
| `flowLevel` | `number`  | `-1`    | Level at which to switch to flow style (`-1` = block)    |

### Examples

```morphql
// 4-space indent, no line wrapping
from object to yaml(indent=4, lineWidth=-1)
transform clone
```

```morphql
// Parse with duplicate keys allowed
from yaml(json=true) to object
transform clone
```
