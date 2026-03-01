import { MorphLexer } from './core/lexer.js';
import { parser } from './core/parser.js';
import { compiler } from './core/compiler.js';
import { astVisitor } from './core/ast-visitor.js';
import {
  getAdapter,
  registerAdapter,
  getRegisteredFormats,
  DataAdapter,
} from './runtime/adapters.js';
import { MorphQLCache } from './runtime/cache.js';
import { runtimeFunctions } from './runtime/functions.js';
import type { ParsedQuery } from './core/parse-types.js';

import { AnalyzeResult, SchemaNode, MorphType } from './core/mapping-tracker.js';

export type {
  ParsedQuery,
  ParsedAction,
  ParsedSetAction,
  ParsedModifyAction,
  ParsedDeleteAction,
  ParsedDefineAction,
  ParsedCloneAction,
  ParsedSectionAction,
  ParsedIfAction,
  ParsedReturnAction,
} from './core/parse-types.js';

export {
  MorphQLCache,
  AnalyzeResult,
  SchemaNode,
  MorphType,
  registerAdapter,
  getAdapter,
  getRegisteredFormats,
  DataAdapter,
};
import beautify from 'js-beautify';

export interface MorphEngine<Source = any, Target = any> {
  (source: Source): Promise<Target> | Target;
  code: string;
  analysis?: AnalyzeResult;
}

export interface CompileOptions {
  cache?: MorphQLCache;
  analyze?: boolean;
}

export async function compile<Source = any, Target = any>(
  queryString: string,
  options?: CompileOptions
): Promise<MorphEngine<Source, Target>> {
  // 1. Check Cache
  if (options?.cache) {
    const cachedCode = await options.cache.retrieve(queryString);
    if (cachedCode) {
      return createEngine<Source, Target>(cachedCode);
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

  compiler.isAnalyzing = !!options?.analyze;
  const { code: rawCode, analysis, sourceType, targetType } = compiler.visit(cst);

  const code = beautify.js(rawCode, {
    indent_size: 2,
    space_in_empty_paren: true,
    end_with_newline: true,
  });

  // 3. Save to Cache
  if (options?.cache) {
    await options.cache.save(queryString, code);
  }

  const engine = createEngine<Source, Target>(code);
  if (analysis) {
    analysis.sourceFormat = sourceType.name;
    analysis.targetFormat = targetType.name;
    engine.analysis = analysis;
  }
  return engine;
}

function createEngine<Source, Target>(code: string): MorphEngine<Source, Target> {
  // Create the base transformation function
  const factory = new Function(code);
  const transform = factory() as (source: any, env: any) => any;

  // Environment with adapter lookups
  const env = {
    parse: (format: string, content: string, options?: any) => {
      return getAdapter(format).parse(content, options);
    },
    serialize: (format: string, data: any, options?: any) => {
      return getAdapter(format).serialize(data, options);
    },
    functions: runtimeFunctions,
  };

  // Return the format-aware engine
  const engine = ((input: Source) => {
    return transform(input, env) as Target;
  }) as MorphEngine<Source, Target>;

  engine.code = code;
  return engine;
}

/**
 * Parse a MorphQL query string and return a simplified, JSON-serializable AST.
 *
 * Only the Lexer and Parser phases are executed — no JavaScript is generated.
 * Useful for tools that need to inspect or round-trip a
 * query without executing it.
 *
 * Throws an Error with a human-readable message on any syntax error,
 * consistent with the behaviour of compile().
 *
 * @example
 * ```typescript
 * import { parse } from "@morphql/core";
 *
 * const ast = parse(`
 *   from json to object
 *   transform
 *     set name = firstName
 * `);
 * // ast.from   → "json"
 * // ast.to     → "object"
 * // ast.actions[0] → { type: "set", target: "name", expression: "firstName" }
 * ```
 */
export function parse(queryString: string): ParsedQuery {
  const lexResult = MorphLexer.tokenize(queryString);

  if (lexResult.errors.length > 0) {
    throw new Error(`Lexing errors: ${lexResult.errors[0].message}`);
  }

  parser.input = lexResult.tokens;
  const cst = parser.query();

  if (parser.errors.length > 0) {
    throw new Error(`Parsing errors: ${parser.errors[0].message}`);
  }

  return astVisitor.visit(cst) as ParsedQuery;
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

export { languageReference, getSystemPrompt } from './language-reference.js';
