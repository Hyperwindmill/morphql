import { MorphLexer } from './lexer.js';
import { parser } from './parser.js';
import { compiler } from './compiler.js';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import beautify from 'js-beautify';

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

export interface MorphEngine {
  (source: any): any;
  code: string;
}

export function compile(queryString: string): MorphEngine {
  const lexResult = MorphLexer.tokenize(queryString);

  if (lexResult.errors.length > 0) {
    throw new Error(`Lexing errors: ${lexResult.errors[0].message}`);
  }

  parser.input = lexResult.tokens;
  const cst = parser.query();

  if (parser.errors.length > 0) {
    throw new Error(`Parsing errors: ${parser.errors[0].message}`);
  }

  const { code: rawCode, sourceType, targetType } = compiler.visit(cst);

  const code = beautify.js(rawCode, {
    indent_size: 2,
    space_in_empty_paren: true,
    end_with_newline: true,
  });

  // Cache the generated code for review only in Node environments
  if (isNode) {
    import('./node-cache.js').then((m) => m.saveToCache(queryString, code)).catch(() => {});
  }

  // Create the base transformation function
  const factory = new Function(code);
  const transform = factory() as (source: any) => any;

  // Return the format-aware engine
  const engine = ((input: any) => {
    let source = input;

    // Handle Source Parsing
    if (sourceType.name.toLowerCase() === 'json' && typeof input === 'string') {
      source = JSON.parse(input);
    } else if (sourceType.name.toLowerCase() === 'xml' && typeof input === 'string') {
      const xmlParser = new XMLParser({
        ignoreAttributes: false,
        removeNSPrefix: true,
      });
      source = xmlParser.parse(input);
    }

    // Execute Mapping
    const result = transform(source);

    // Handle Target Serialization
    if (targetType.name.toLowerCase() === 'json') {
      return JSON.stringify(result, null, 2);
    } else if (targetType.name.toLowerCase() === 'xml') {
      const rootTag = targetType.parameter || 'root';
      const builder = new XMLBuilder({
        ignoreAttributes: false,
        format: true,
      });
      return builder.build({ [rootTag]: result });
    }

    return result;
  }) as MorphEngine;

  engine.code = code;
  return engine;
}

/**
 * Legacy greet function for compatibility during migration.
 */
export function greet(name: string): string {
  return `Hello, ${name}! The Morph engine is ready.`;
}
