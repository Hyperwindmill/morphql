/**
 * Type for a function handler that generates JavaScript code for a DSL function call.
 * @param args - The compiled JavaScript strings for each argument.
 * @returns The generated JavaScript code for the function call.
 */
export type FunctionHandler = (args: string[]) => string;

/**
 * Registry of available transformation functions in the DSL.
 */
export const functionRegistry: Record<string, FunctionHandler> = {
  substring: (args: string[]) => {
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
  if: (args: string[]) => {
    if (args.length !== 3) {
      throw new Error('if() requires exactly 3 arguments (condition, trueValue, falseValue)');
    }
    const [condition, trueValue, falseValue] = args;
    // Compile to ternary operator
    // Wrap in parentheses to ensure precedence is correct
    return `((${condition}) ? (${trueValue}) : (${falseValue}))`;
  },
  text: (args: string[]) => {
    if (args.length !== 1) {
      throw new Error('text() requires exactly 1 argument (string or number)');
    }
    const [str] = args;
    return `String(${str})`;
  },
  replace: (args: string[]) => {
    if (args.length !== 3) {
      throw new Error('replace() requires exactly 3 arguments (string, search, replacement)');
    }
    const [str, search, replacement] = args;
    return `String(${str}).replace(${search}, ${replacement})`;
  },
  number: (args: string[]) => {
    if (args.length !== 1) {
      throw new Error('number() requires exactly 1 argument (string)');
    }
    const [str] = args;
    return `Number(${str})`;
  },
  extractnumber: (args: string[]) => {
    if (args.length !== 1) {
      throw new Error('extractNumber() requires exactly 1 argument (string)');
    }
    const [str] = args;
    return `(() => { const match = String(${str}).match(/\\d+(\\.\\d+)?/); return match ? Number(match[0]) : null; })()`;
  },
  uppercase: (args: string[]) => {
    if (args.length !== 1) {
      throw new Error('uppercase() requires exactly 1 argument (string)');
    }
    const [str] = args;
    return `String(${str}).toUpperCase()`;
  },
  lowercase: (args: string[]) => {
    if (args.length !== 1) {
      throw new Error('lowercase() requires exactly 1 argument (string)');
    }
    const [str] = args;
    return `String(${str}).toLowerCase()`;
  },
  xmlnode: (args: string[]) => {
    if (args.length < 1) {
      throw new Error('xmlnode() requires at least 1 argument (string)');
    }
    const value = args[0];
    const attributesList = [...args.slice(1)];
    let attributes = '';
    if (attributesList.length > 0) {
      const chunkSize = 2;
      let list = [...attributesList];
      list = [...Array(Math.ceil(list.length / chunkSize))]
        .map(() => list.splice(0, chunkSize))
        .map(([key, value]) => {
          let attrKey = key;
          if (key.startsWith('"') || key.startsWith("'")) {
            attrKey = `"$${key.slice(1, -1)}"`;
          } else {
            attrKey = `["$"+${key}]`;
          }
          return `${attrKey}:${value ? value : 'null'}`;
        });
      attributes = ',' + list.join(',');
    } else {
      return value;
    }
    return `{_:${value}${attributes}}`;
  },
  split: (args: string[]) => {
    if (args.length < 1) {
      throw new Error('split() requires at least 1 argument (string)');
    }
    const [str, separator, limit] = args;
    const sep = separator !== undefined ? separator : '""';
    const lim = limit !== undefined ? `, ${limit}` : '';
    return `String(${str}).split(${sep}${lim})`;
  },
  to_base64: (args: string[]) => {
    if (args.length !== 1) {
      throw new Error('to_base64() requires exactly 1 argument (string)');
    }
    const [val] = args;
    return `(typeof btoa === 'function' ? btoa(unescape(encodeURIComponent(String(${val})))) : Buffer.from(String(${val}), 'utf-8').toString('base64'))`;
  },
  from_base64: (args: string[]) => {
    if (args.length !== 1) {
      throw new Error('from_base64() requires exactly 1 argument (string)');
    }
    const [val] = args;
    return `(typeof atob === 'function' ? decodeURIComponent(escape(atob(String(${val})))) : Buffer.from(String(${val}), 'base64').toString('utf-8'))`;
  },
  aslist: (args: string[]) => {
    if (args.length !== 1) {
      throw new Error('aslist() requires exactly 1 argument');
    }
    const [val] = args;
    return `(Array.isArray(${val}) ? ${val} : (${val} == null ? [] : [${val}]))`;
  },
  spreadsheet: (args: string[]) => {
    if (args.length !== 1) {
      throw new Error('spreadsheet() requires exactly 1 argument');
    }
    const [val] = args;
    return `((data)=>{
      const spreadsheet = Array.isArray(data) ? data : (data == null ? [] : [data]);
      const out = [];
      const titles = [];
      let keys = [];
      for (let i = 0; i < spreadsheet.length; i++) {
        const line = spreadsheet[i];
        if (!line || typeof line !== 'object') continue;
        if (i === 0) {
          keys = Object.keys(line);
          for (const k of keys) titles.push(line[k]);
        } else {
          const tempLine = {};
          for (let j = 0; j < keys.length; j++) {
            tempLine[titles[j]] = line[keys[j]];
          }
          out.push(tempLine);
        }
      }
      return out;
    })(${val})`;
  },
  unpack: (args: string[]) => {
    if (args.length < 2) {
      throw new Error(
        'unpack() requires at least 2 arguments (string, fieldSpec1, [fieldSpec2, ...])'
      );
    }
    const [str, ...specs] = args;
    const extractions = specs
      .map((spec) => {
        const clean = spec.replace(/^["']|["']$/g, '');
        const parts = clean.split(':');
        if (parts.length < 3) {
          throw new Error(
            `Invalid field spec for unpack(): ${clean}. Expected "name:start:length[:modifier]"`
          );
        }
        const [name, startStr, lengthStr, modifier] = parts;

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

        let extraction = `String(${str} || "").substring(${start}, ${start} + ${length})`;
        if (modifier !== 'raw') {
          extraction = `(${extraction}).trim()`;
        }
        return `"${name}": ${extraction}`;
      })
      .join(', ');

    return `({ ${extractions} })`;
  },
  pack: (args: string[]) => {
    if (args.length < 2) {
      throw new Error(
        'pack() requires at least 2 arguments (object, fieldSpec1, [fieldSpec2, ...])'
      );
    }
    const [obj, ...specs] = args;

    const fields = specs.map((spec) => {
      const clean = spec.replace(/^["']|["']$/g, '');
      const parts = clean.split(':');
      if (parts.length < 3) {
        throw new Error(
          `Invalid field spec for pack(): ${clean}. Expected "name:start:length[:modifier]"`
        );
      }
      const [name, startStr, lengthStr, modifier] = parts;

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
      return { name, start, length, left: modifier === 'left' };
    });

    const totalWidth = fields.reduce((max, f) => Math.max(max, f.start + f.length), 0);

    return `((val) => {
      if (!val) return ' '.repeat(${totalWidth});
      let line = ' '.repeat(${totalWidth});
      ${fields
        .map((f, i) => {
          const valueExpr = `String(val["${f.name}"] ?? "")`;
          const padExpr = f.left
            ? `(${valueExpr}).padStart(${f.length})`
            : `(${valueExpr}).padEnd(${f.length})`;
          return `
      const v${i} = (${padExpr}).substring(0, ${f.length});
      line = line.substring(0, ${f.start}) + v${i} + line.substring(${f.start} + ${f.length});`;
        })
        .join('')}
      return line;
    })(${obj})`;
  },
};
