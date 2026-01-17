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
  number: (args: string[]) => {
    if (args.length !== 1) {
      throw new Error('number() requires exactly 1 argument (string)');
    }
    const [str] = args;
    return `Number(${str})`;
  },
};
