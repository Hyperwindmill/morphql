import { generateMonacoLanguageConfig } from "@morphql/language-definitions";

/**
 * MorphQL Language configuration for Monaco Editor
 * Auto-generated from @morphql/language-definitions
 */
export const morphqlLanguageConfig = generateMonacoLanguageConfig();

/**
 * Register MorphQL language with Monaco Editor
 */
export function registerMorphQLLanguage(monaco: any) {
  // Register the language
  monaco.languages.register({ id: "morphql" });

  // Set the tokens provider
  monaco.languages.setMonarchTokensProvider("morphql", morphqlLanguageConfig);

  // Set language configuration
  monaco.languages.setLanguageConfiguration("morphql", {
    comments: {
      lineComment: "//",
      blockComment: ["/*", "*/"],
    },
    brackets: [
      ["(", ")"],
      ["{", "}"],
      ["[", "]"],
    ],
    autoClosingPairs: [
      { open: "(", close: ")" },
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: "(", close: ")" },
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
  });
}
