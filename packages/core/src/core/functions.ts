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
    return `Number(String(${str}).match(/\\d+(\\.\\d+)?/)[0])`;
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
      let [list, chunkSize] = [attributesList, 2];
      list = [...Array(Math.ceil(list.length / chunkSize))]
        .map((_) => list.splice(0, chunkSize))
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
};
