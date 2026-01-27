#!/usr/bin/env node
/**
 * Regenerates VSCode TextMate grammar from language definitions
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  generateTextMateKeywordsPattern,
  generateTextMateFunctionsPattern,
} from '@morphql/language-definitions';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const grammarPath = join(__dirname, 'syntaxes', 'morphql.tmLanguage.json');

// Read existing grammar
const grammar = JSON.parse(readFileSync(grammarPath, 'utf-8'));

// Generate new patterns
const keywordsPattern = JSON.parse(generateTextMateKeywordsPattern());
const functionsPattern = JSON.parse(generateTextMateFunctionsPattern());

// Update grammar
grammar.repository.keywords = keywordsPattern;
grammar.repository.functions = functionsPattern;

// Write back
writeFileSync(grammarPath, JSON.stringify(grammar, null, 2) + '\n');

console.log('✅ TextMate grammar regenerated from language definitions');
console.log(`   Keywords: ${keywordsPattern.patterns.length} patterns`);
console.log(`   Functions: ${functionsPattern.patterns.length} patterns`);
