// docs/language-reference.md is the single source of truth.
// This file re-exports the generated content. To regenerate:
//   node scripts/generate-language-reference.mjs
import { languageReferenceContent } from './language-reference.generated.js';

/**
 * The raw MorphQL language reference in Markdown format.
 *
 * This is the full language specification, designed for both human
 * and AI/LLM consumption. Use it to inject the MorphQL spec into
 * custom system prompts.
 *
 * @example
 * ```typescript
 * import { languageReference } from '@morphql/core';
 *
 * const systemPrompt = `You are a helpful assistant.\n\n${languageReference}`;
 * ```
 */
export const languageReference: string = languageReferenceContent;

/**
 * Returns a ready-to-use LLM system prompt for MorphQL query generation.
 *
 * Wraps the full language reference with role instructions and strict
 * response rules. Designed for autonomous query generation by AI models.
 *
 * @example
 * ```typescript
 * import { getSystemPrompt } from '@morphql/core';
 *
 * const messages = [
 *   { role: 'system', content: getSystemPrompt() },
 *   { role: 'user', content: 'Convert this JSON to XML: ...' },
 * ];
 * ```
 */
export function getSystemPrompt(): string {
  return `
You are an expert at writing MorphQL transformation queries.

MorphQL is a declarative DSL for structural data transformation. It is a NEW language
(not in your training data), so rely exclusively on the syntax documented here.

---

${languageReferenceContent}

---

## Rules for your response

1. Return ONLY the MorphQL query — no prose, no markdown fences, no comments.
2. Choose the correct \`from\` and \`to\` formats based on the data provided.
3. Use \`section multiple\` to iterate over arrays; never use loops.
4. Keep expressions simple and readable. Prefer \`define\` for repeated sub-expressions.
5. Do NOT invent functions or syntax not listed above.
6. For fixed-width text output use \`to plaintext\` and \`pack()\`; for reading use \`from plaintext\` and \`unpack()\`.
7. For CSV with headers, always use \`spreadsheet(rows)\` in the \`from\` clause of sections.
8. The query must be syntactically complete and runnable as-is.
`.trim();
}
