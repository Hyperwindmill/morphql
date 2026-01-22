import {
  KEYWORDS,
  getKeywordNames,
  getKeywordsByCategory,
  getKeywordDoc,
} from "./keywords";
import { FUNCTIONS, getFunctionNames, getFunctionDoc } from "./functions";
import {
  OPERATORS,
  getOperatorsByCategory,
  getOperatorSymbols,
  getMultiCharOperators,
  getSingleCharOperators,
} from "./operators";
import type {
  LanguageDefinition,
  KeywordDef,
  FunctionDef,
  OperatorDef,
  DocEntry,
} from "./types";

/**
 * Complete MorphQL language definition
 */
export const MORPHQL_LANGUAGE: LanguageDefinition = {
  keywords: KEYWORDS,
  functions: FUNCTIONS,
  operators: OPERATORS,
  comments: {
    line: "//",
    blockStart: "/*",
    blockEnd: "*/",
  },
};

// Re-export everything
export {
  // Data
  KEYWORDS,
  FUNCTIONS,
  OPERATORS,

  // Helpers
  getKeywordNames,
  getKeywordsByCategory,
  getKeywordDoc,
  getFunctionNames,
  getFunctionDoc,
  getOperatorsByCategory,
  getOperatorSymbols,
  getMultiCharOperators,
  getSingleCharOperators,

  // Types
  type LanguageDefinition,
  type KeywordDef,
  type FunctionDef,
  type OperatorDef,
  type DocEntry,
};

/**
 * Generators for different platforms
 */

/**
 * Generate TextMate grammar keywords pattern
 */
export function generateTextMateKeywordsPattern(): string {
  const controlKeywords = getKeywordsByCategory("control").map((k) => k.name);
  const actionKeywords = getKeywordsByCategory("action").map((k) => k.name);

  return JSON.stringify(
    {
      patterns: [
        {
          name: "keyword.control.morphql",
          match: `\\b(${controlKeywords.join("|")})\\b`,
        },
        {
          name: "keyword.other.morphql",
          match: `\\b(${actionKeywords.join("|")})\\b`,
        },
      ],
    },
    null,
    2,
  );
}

/**
 * Generate TextMate grammar functions pattern
 */
export function generateTextMateFunctionsPattern(): string {
  const functionNames = getFunctionNames();

  return JSON.stringify(
    {
      patterns: [
        {
          name: "entity.name.function.morphql",
          match: `\\b(${functionNames.join("|")})(?=\\s*\\()`,
        },
      ],
    },
    null,
    2,
  );
}

/**
 * Generate Monaco language configuration
 */
export function generateMonacoLanguageConfig() {
  return {
    keywords: getKeywordNames(),
    builtinFunctions: getFunctionNames(),
    operators: getOperatorSymbols(),
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes:
      /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    tokenizer: {
      root: [
        // Comments
        [/\/\/.*$/, "comment"],
        [/\/\*/, "comment", "@comment"],

        // Keywords
        [
          /[a-zA-Z_$][\w$]*/,
          {
            cases: {
              "@keywords": "keyword",
              "@builtinFunctions": "predefined",
              "@default": "identifier",
            },
          },
        ],

        // Strings
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/'([^'\\]|\\.)*$/, "string.invalid"],
        [/"/, "string", "@string_double"],
        [/'/, "string", "@string_single"],

        // Numbers
        [/-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/, "number"],

        // Operators
        [/[{}()\[\]]/, "@brackets"],
        [
          /@symbols/,
          {
            cases: {
              "@operators": "operator",
              "@default": "",
            },
          },
        ],
      ],

      comment: [
        [/[^\/*]+/, "comment"],
        [/\*\//, "comment", "@pop"],
        [/[\/*]/, "comment"],
      ],

      string_double: [
        [/[^\\"]+/, "string"],
        [/@escapes/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [/"/, "string", "@pop"],
      ],

      string_single: [
        [/[^\\']+/, "string"],
        [/@escapes/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [/'/, "string", "@pop"],
      ],
    },
  };
}

/**
 * Generate hover documentation map for VSCode
 */
export function generateHoverDocs() {
  const keywordDocs: Record<string, DocEntry> = {};
  KEYWORDS.forEach((k) => {
    keywordDocs[k.name] = k.doc;
  });

  const functionDocs: Record<string, DocEntry> = {};
  FUNCTIONS.forEach((f) => {
    functionDocs[f.name] = f.doc;
  });

  return { keywordDocs, functionDocs };
}
