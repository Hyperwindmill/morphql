/**
 * Type for a function handler that generates JavaScript code for a DSL function call.
 * @param args - The compiled JavaScript strings for each argument.
 * @returns The generated JavaScript code for the function call.
 */
export type FunctionHandler = (args: string[], compiler: any) => string;

/**
 * Registry of available transformation functions in the DSL.
 */
export const functionRegistry: Record<string, FunctionHandler> = {
  substring: (args: string[], _compiler) => {
    if (args.length < 2) {
      throw new Error('substring() requires at least 2 arguments (string, start, [length])');
    }
    const [str, start, length] = args;
    if (length !== undefined) {
      // Third parameter is length, so calculate end as start + length
      return `String(${str}).slice(${start}, (${start}) + (${length}))`;
    }
    // Only 2 arguments: slice from start to end of string
    return `String(${str}).slice(${start})`;
  },
  if: (args: string[], _compiler) => {
    if (args.length !== 3) {
      throw new Error('if() requires exactly 3 arguments (condition, trueValue, falseValue)');
    }
    const [condition, trueValue, falseValue] = args;
    // Compile to ternary operator
    // Wrap in parentheses to ensure precedence is correct
    return `((${condition}) ? (${trueValue}) : (${falseValue}))`;
  },
  text: (args: string[], _compiler) => {
    if (args.length !== 1) {
      throw new Error('text() requires exactly 1 argument (string or number)');
    }
    const [str] = args;
    return `String(${str})`;
  },
  replace: (args: string[], _compiler) => {
    if (args.length !== 3) {
      throw new Error('replace() requires exactly 3 arguments (string, search, replacement)');
    }
    const [str, search, replacement] = args;
    return `String(${str}).replace(${search}, ${replacement})`;
  },
  number: (args: string[], _compiler) => {
    if (args.length !== 1) {
      throw new Error('number() requires exactly 1 argument (string)');
    }
    const [str] = args;
    return `Number(${str})`;
  },
  extractnumber: (args: string[], _compiler) => {
    if (args.length !== 1) {
      throw new Error('extractNumber() requires exactly 1 argument (string)');
    }
    const [str] = args;
    return `(() => { const match = String(${str}).match(/\\d+(\\.\\d+)?/); return match ? Number(match[0]) : null; })()`;
  },
  uppercase: (args: string[], _compiler) => {
    if (args.length !== 1) {
      throw new Error('uppercase() requires exactly 1 argument (string)');
    }
    const [str] = args;
    return `String(${str}).toUpperCase()`;
  },
  lowercase: (args: string[], _compiler) => {
    if (args.length !== 1) {
      throw new Error('lowercase() requires exactly 1 argument (string)');
    }
    const [str] = args;
    return `String(${str}).toLowerCase()`;
  },
  xmlnode: (args: string[], _compiler) => {
    if (args.length < 1) {
      throw new Error('xmlnode() requires at least 1 argument (string)');
    }
    const [value, ...attributes] = args;
    const attrArgs = attributes.join(', ');
    return `env.functions.xmlnode(${value}${attrArgs ? ', ' + attrArgs : ''})`;
  },
  split: (args: string[], _compiler) => {
    if (args.length < 1) {
      throw new Error('split() requires at least 1 argument (string)');
    }
    const [str, separator, limit] = args;
    const sep = separator !== undefined ? separator : '""';
    const lim = limit !== undefined ? `, ${limit}` : '';
    return `String(${str}).split(${sep}${lim})`;
  },
  to_base64: (args: string[], _compiler) => {
    if (args.length !== 1) {
      throw new Error('to_base64() requires exactly 1 argument (string)');
    }
    const [val] = args;
    return `env.functions.to_base64(${val})`;
  },
  from_base64: (args: string[], _compiler) => {
    if (args.length !== 1) {
      throw new Error('from_base64() requires exactly 1 argument (string)');
    }
    const [val] = args;
    return `env.functions.from_base64(${val})`;
  },
  aslist: (args: string[], _compiler) => {
    if (args.length !== 1) {
      throw new Error('aslist() requires exactly 1 argument');
    }
    const [val] = args;
    return `env.functions.aslist(${val})`;
  },
  spreadsheet: (args: string[], _compiler) => {
    if (args.length !== 1) {
      throw new Error('spreadsheet() requires exactly 1 argument');
    }
    const [val] = args;
    return `env.functions.spreadsheet(${val})`;
  },
  unpack: (args: string[], _compiler) => {
    if (args.length < 2) {
      throw new Error(
        'unpack() requires at least 2 arguments (string, fieldSpec1, [fieldSpec2, ...])'
      );
    }
    const [str, ...specs] = args;

    // Validate specs at compile time
    specs.forEach((spec) => {
      const clean = spec.replace(/^["']|["']$/g, '');
      const parts = clean.split(':');
      if (parts.length < 3) {
        throw new Error(
          `Invalid field spec for unpack(): ${clean}. Expected "name:start:length[:modifier]"`
        );
      }
      const [name, startStr, lengthStr] = parts;

      // Hardened validation for field name
      if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
        throw new Error(
          `Invalid field name in unpack() spec: "${name}". Must be a valid JavaScript identifier.`
        );
      }

      const start = parseInt(startStr, 10);
      const length = parseInt(lengthStr, 10);
      if (isNaN(start) || isNaN(length)) {
        throw new Error(`Invalid character positions in unpack() spec: ${clean}`);
      }
    });

    // We pass specs as individual arguments to the helper
    const specArgs = specs.join(', ');
    return `env.functions.unpack(${str}, ${specArgs})`;
  },
  pack: (args: string[], _compiler) => {
    if (args.length < 2) {
      throw new Error(
        'pack() requires at least 2 arguments (object, fieldSpec1, [fieldSpec2, ...])'
      );
    }
    const [obj, ...specs] = args;

    // Validate specs at compile time
    specs.forEach((spec) => {
      const clean = spec.replace(/^["']|["']$/g, '');
      const parts = clean.split(':');
      if (parts.length < 3) {
        throw new Error(
          `Invalid field spec for pack(): ${clean}. Expected "name:start:length[:modifier]"`
        );
      }
      const [name, startStr, lengthStr] = parts;

      // Hardened validation for field name
      if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
        throw new Error(
          `Invalid field name in pack() spec: "${name}". Must be a valid JavaScript identifier.`
        );
      }

      const start = parseInt(startStr, 10);
      const length = parseInt(lengthStr, 10);
      if (isNaN(start) || isNaN(length)) {
        throw new Error(`Invalid character positions in pack() spec: ${clean}`);
      }
    });

    const specArgs = specs.join(', ');
    return `env.functions.pack(${obj}, ${specArgs})`;
  },
  concat: (args: string[], _compiler) => {
    return `env.functions.concat(${args.join(', ')})`;
  },
  transpose: (args: string[], _compiler) => {
    if (args.length < 2) {
      throw new Error('transpose() requires at least 2 arguments (source, key1, [key2, ...])');
    }
    return `env.functions.transpose(${args.join(', ')})`;
  },
  list: (args: string[], _compiler) => {
    return `[${args.join(', ')}]`;
  },
  array: (args: string[], _compiler) => {
    return `[${args.join(', ')}]`;
  },
  extract: (args: string[], compiler) => {
    if (args.length < 2) {
      throw new Error('extract() requires at least 2 arguments (source, key1, [key2, ...])');
    }
    const [source, ...rest] = args;
    // Pass safeMode from compiler to runtime function
    return `env.functions.extract(${source}, ${compiler.safeMode}, ${rest.join(', ')})`;
  },

  // ── Math functions ──────────────────────────────────────────────────────────
  floor: (args: string[], _compiler) => {
    if (args.length !== 1) throw new Error('floor() requires exactly 1 argument');
    return `Math.floor(${args[0]})`;
  },
  ceil: (args: string[], _compiler) => {
    if (args.length !== 1) throw new Error('ceil() requires exactly 1 argument');
    return `Math.ceil(${args[0]})`;
  },
  round: (args: string[], _compiler) => {
    if (args.length < 1 || args.length > 2)
      throw new Error('round() requires 1 or 2 arguments (value, [mode])');
    const [val, mode = '"half-up"'] = args;
    // mode "half-up"   → standard Math.round (half away from zero for positives)
    // mode "half-even" → banker's rounding (round half to nearest even integer)
    return `(() => {
      const _v = Number(${val});
      const _mode = ${mode};
      if (_mode === 'half-even') {
        const _f = Math.floor(_v);
        const _frac = _v - _f;
        if (_frac === 0.5) return (_f % 2 === 0) ? _f : _f + 1;
        return Math.round(_v);
      }
      return Math.round(_v);
    })()`;
  },
  abs: (args: string[], _compiler) => {
    if (args.length !== 1) throw new Error('abs() requires exactly 1 argument');
    return `Math.abs(${args[0]})`;
  },
  fixed: (args: string[], _compiler) => {
    if (args.length < 1 || args.length > 2)
      throw new Error('fixed() requires 1 or 2 arguments (value, [decimals])');
    const [val, decimals = '2'] = args;
    // Inline half-away-from-zero rounding:
    // 1. Multiply by 10^d, round, divide back, then format with padded zeros.
    // We use a self-invoking function to keep the generated code clean.
    return `(() => {
      const _v = Number(${val});
      const _d = Math.max(0, Math.floor(Number(${decimals})));
      const _f = Math.pow(10, _d);
      const _r = Math.round(Math.abs(_v) * _f) / _f * Math.sign(_v || 1);
      const _s = _r.toFixed(_d);
      return _s;
    })()`;
  },
  min: (args: string[], _compiler) => {
    if (args.length < 2) throw new Error('min() requires at least 2 arguments');
    return `Math.min(${args.join(', ')})`;
  },
  max: (args: string[], _compiler) => {
    if (args.length < 2) throw new Error('max() requires at least 2 arguments');
    return `Math.max(${args.join(', ')})`;
  },

  // ── String functions ─────────────────────────────────────────────────────────
  trim: (args: string[], _compiler) => {
    if (args.length !== 1) throw new Error('trim() requires exactly 1 argument');
    return `String(${args[0]}).trim()`;
  },
  padstart: (args: string[], _compiler) => {
    if (args.length < 2)
      throw new Error('padstart() requires at least 2 arguments (str, length, [char])');
    const [str, len, char] = args;
    return char !== undefined
      ? `String(${str}).padStart(${len}, ${char})`
      : `String(${str}).padStart(${len})`;
  },
  padend: (args: string[], _compiler) => {
    if (args.length < 2)
      throw new Error('padend() requires at least 2 arguments (str, length, [char])');
    const [str, len, char] = args;
    return char !== undefined
      ? `String(${str}).padEnd(${len}, ${char})`
      : `String(${str}).padEnd(${len})`;
  },
  indexof: (args: string[], _compiler) => {
    if (args.length !== 2) throw new Error('indexof() requires exactly 2 arguments (str, search)');
    return `String(${args[0]}).indexOf(${args[1]})`;
  },
  startswith: (args: string[], _compiler) => {
    if (args.length !== 2)
      throw new Error('startswith() requires exactly 2 arguments (str, prefix)');
    return `String(${args[0]}).startsWith(${args[1]})`;
  },
  endswith: (args: string[], _compiler) => {
    if (args.length !== 2) throw new Error('endswith() requires exactly 2 arguments (str, suffix)');
    return `String(${args[0]}).endsWith(${args[1]})`;
  },
};
