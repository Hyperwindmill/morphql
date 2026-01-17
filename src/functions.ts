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
    const [str, start, end] = args;
    const endArg = end !== undefined ? `, ${end}` : '';
    return `String(${str}).substring(${start}${endArg})`;
  },
};
