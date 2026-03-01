#!/usr/bin/env node
/**
 * Generates language-reference.generated.ts from docs/language-reference.md.
 * Run this before building @morphql/core, or as part of the build pipeline.
 *
 * Usage: node scripts/generate-language-reference.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const mdPath = resolve(__dirname, '../../../docs/language-reference.md');
const outPath = resolve(__dirname, '../src/language-reference.generated.ts');

const content = readFileSync(mdPath, 'utf-8');

// Escape backticks and ${} in the content for template literal safety
const escaped = content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

const tsContent = `// AUTO-GENERATED — DO NOT EDIT.
// Source: docs/language-reference.md
// Regenerate with: node scripts/generate-language-reference.mjs
export const languageReferenceContent = \`${escaped}\`;
`;

writeFileSync(outPath, tsContent, 'utf-8');
console.log(`✓ Generated ${outPath}`);
