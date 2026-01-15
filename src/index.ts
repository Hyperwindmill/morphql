import { MorphLexer } from './lexer.js';
import { parser } from './parser.js';
import { compiler } from './compiler.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createHash } from 'node:crypto';

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

  const code = compiler.visit(cst);

  // Cache the generated code to files for review
  saveToCache(queryString, code);

  // Create the executable function
  const factory = new Function(code);
  return factory() as MorphEngine;
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
