import { MorphLexer } from './core/lexer.js';
import { parser } from './core/parser.js';
import { compiler } from './core/compiler.js';
import { getAdapter } from './runtime/adapters.js';
import { MorphQLCache } from './runtime/cache.js';

export { MorphQLCache };
import beautify from 'js-beautify';

export interface MorphEngine {
  (source: any): Promise<any> | any;
  code: string;
}

export interface CompileOptions {
  cache?: MorphQLCache;
}

export async function compile(queryString: string, options?: CompileOptions): Promise<MorphEngine> {
  // 1. Check Cache
  if (options?.cache) {
    const cachedCode = await options.cache.retrieve(queryString);
    if (cachedCode) {
      return createEngine(cachedCode);
    }
  }

  // 2. Compile if miss
  const lexResult = MorphLexer.tokenize(queryString);

  if (lexResult.errors.length > 0) {
    throw new Error(`Lexing errors: ${lexResult.errors[0].message}`);
  }

  parser.input = lexResult.tokens;
  const cst = parser.query();

  if (parser.errors.length > 0) {
    throw new Error(`Parsing errors: ${parser.errors[0].message}`);
  }

  const { code: rawCode } = compiler.visit(cst);

  const code = beautify.js(rawCode, {
    indent_size: 2,
    space_in_empty_paren: true,
    end_with_newline: true,
  });

  // 3. Save to Cache
  if (options?.cache) {
    await options.cache.save(queryString, code);
  }

  return createEngine(code);
}

function createEngine(code: string): MorphEngine {
  // Create the base transformation function
  const factory = new Function(code);
  const transform = factory() as (source: any, env: any) => any;

  // Environment with adapter lookups
  const env = {
    parse: (format: string, content: string) => {
      return getAdapter(format).parse(content);
    },
    serialize: (format: string, data: any, options?: any) => {
      return getAdapter(format).serialize(data, options);
    },
  };

  // Return the format-aware engine
  const engine = ((input: any) => {
    return transform(input, env);
  }) as MorphEngine;

  engine.code = code;
  return engine;
}

/**
 * Tagged template helper for MorphQL queries.
 * Enables syntax highlighting in VSCode and provides a cleaner API.
 *
 * @example
 * ```typescript
 * const query = morphQL`
 *   from json to xml
 *   transform
 *     set fullName = firstName + " " + lastName
 * `;
 * const engine = await compile(query);
 * ```
 */
export function morphQL(strings: TemplateStringsArray, ...values: any[]): string {
  return strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '');
}

/**
 * Legacy greet function for compatibility during migration.
 */
export function greet(name: string): string {
  return `Hello, ${name}! The Morph engine is ready.`;
}
