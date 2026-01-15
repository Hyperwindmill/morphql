import { MorphLexer } from './lexer.js';
import { parser } from './parser.js';
import { compiler } from './compiler.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createHash } from 'node:crypto';
import { create } from 'xmlbuilder2';

export interface MorphEngine {
  (source: any): any;
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

  const { code, sourceType, targetType } = compiler.visit(cst);

  // Cache the generated code to files for review
  saveToCache(queryString, code);

  // Create the base transformation function
  const factory = new Function(code);
  const transform = factory() as (source: any) => any;

  // Return the format-aware engine
  return (input: any) => {
    let source = input;

    // Handle Source Parsing
    if (sourceType.name.toLowerCase() === 'json' && typeof input === 'string') {
      source = JSON.parse(input);
    } else if (sourceType.name.toLowerCase() === 'xml' && typeof input === 'string') {
      // Basic XML to JS (might need a dedicated parser for complex cases)
      // For now we assume input is already parsed if it's not a string,
      // or we just handle serialization primarily as requested.
      // Simple XML parsing is better handled by a dedicated library if really needed for 'from xml'
      // But usually 'from static as json' is most common.
    }

    // Execute Mapping
    const result = transform(source);

    // Handle Target Serialization
    if (targetType.name.toLowerCase() === 'json') {
      return JSON.stringify(result, null, 2);
    } else if (targetType.name.toLowerCase() === 'xml') {
      const rootTag = targetType.parameter || 'root';
      const doc = create({ [rootTag]: result });
      return doc.end({ prettyPrint: true });
    }

    return result;
  };
}

function saveToCache(query: string, code: string) {
  const cacheDir = path.resolve(process.cwd(), '.compiled');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const hash = createHash('sha256').update(query).digest('hex').substring(0, 12);
  const filePath = path.join(cacheDir, `morph_${hash}.js`);

  const content = `/* 
Query:
${query}
*/

${code}`;
  fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * Legacy greet function for compatibility during migration.
 */
export function greet(name: string): string {
  return `Hello, ${name}! The Morph engine is ready.`;
}
