import { OperatorDef } from "./types";

/**
 * MorphQL Operators - Single source of truth
 *
 * When adding a new operator:
 * 1. Add it here
 * 2. Update the lexer in @morphql/core (MIND THE ORDER!)
 * 3. Run build to regenerate VSCode/Monaco configs
 */
export const OPERATORS: OperatorDef[] = [
  // Comparison operators
  { symbol: "===", category: "comparison", precedence: 7 },
  { symbol: "!==", category: "comparison", precedence: 7 },
  { symbol: "==", category: "comparison", precedence: 7 },
  { symbol: "!=", category: "comparison", precedence: 7 },
  { symbol: "<=", category: "comparison", precedence: 6 },
  { symbol: ">=", category: "comparison", precedence: 6 },
  { symbol: "<", category: "comparison", precedence: 6 },
  { symbol: ">", category: "comparison", precedence: 6 },

  // Logical operators
  { symbol: "&&", category: "logical", precedence: 5 },
  { symbol: "||", category: "logical", precedence: 4 },
  { symbol: "!", category: "logical", precedence: 9 },

  // Arithmetic operators
  { symbol: "+", category: "arithmetic", precedence: 10 },
  { symbol: "-", category: "arithmetic", precedence: 10 },
  { symbol: "*", category: "arithmetic", precedence: 11 },
  { symbol: "/", category: "arithmetic", precedence: 11 },
  { symbol: "%", category: "arithmetic", precedence: 11 },

  // Assignment
  { symbol: "=", category: "assignment", precedence: 1 },
];

// Helper to get operators by category
export const getOperatorsByCategory = (category: OperatorDef["category"]) =>
  OPERATORS.filter((op) => op.category === category);

// Helper to get all operator symbols
export const getOperatorSymbols = () => OPERATORS.map((op) => op.symbol);

// Helper to get multi-character operators (for lexer ordering)
export const getMultiCharOperators = () =>
  OPERATORS.filter((op) => op.symbol.length > 1).map((op) => op.symbol);

// Helper to get single-character operators
export const getSingleCharOperators = () =>
  OPERATORS.filter((op) => op.symbol.length === 1).map((op) => op.symbol);
